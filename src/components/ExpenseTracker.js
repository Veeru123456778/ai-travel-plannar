'use client';

import { useState, useEffect } from 'react';
import { useSocket } from '@/context/SocketContext';
import { useUser } from '@clerk/nextjs';
import toast from 'react-hot-toast';
import { 
  CurrencyDollarIcon, 
  PlusIcon, 
  ChartPieIcon,
  ReceiptPercentIcon,
  UserGroupIcon,
  CalendarIcon,
  TagIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const EXPENSE_CATEGORIES = [
  { id: 'transport', name: 'Transport', color: '#3B82F6', icon: '🚗' },
  { id: 'accommodation', name: 'Accommodation', color: '#10B981', icon: '🏨' },
  { id: 'food', name: 'Food & Dining', color: '#F59E0B', icon: '🍽️' },
  { id: 'activity', name: 'Activities', color: '#8B5CF6', icon: '🎯' },
  { id: 'other', name: 'Other', color: '#6B7280', icon: '📦' }
];

export default function ExpenseTracker({ tripId, budget, participants }) {
  const { user } = useUser();
  const { socket, sendExpenseUpdate } = useSocket();
  
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  
  const [newExpense, setNewExpense] = useState({
    description: '',
    amount: '',
    category: 'food',
    date: new Date().toISOString().split('T')[0],
    splitBetween: []
  });

  useEffect(() => {
    fetchExpenses();
  }, [tripId]);

  useEffect(() => {
    if (!socket) return;

    const handleExpenseUpdated = (data) => {
      const { expenseId, expense, action, updatedBy, timestamp } = data;
      
      if (action === 'create') {
        setExpenses(prev => [expense, ...prev]);
        toast.success(`${updatedBy.name} added an expense`);
        calculateSummary([expense, ...expenses]);
      } else if (action === 'update') {
        setExpenses(prev => prev.map(exp => 
          exp.id === expenseId ? expense : exp
        ));
        calculateSummary(expenses.map(exp => exp.id === expenseId ? expense : exp));
      } else if (action === 'delete') {
        setExpenses(prev => prev.filter(exp => exp.id !== expenseId));
        calculateSummary(expenses.filter(exp => exp.id !== expenseId));
      }
    };

    socket.on('expense-updated', handleExpenseUpdated);
    return () => socket.off('expense-updated', handleExpenseUpdated);
  }, [socket, expenses]);

  const fetchExpenses = async () => {
    try {
      const response = await fetch(`/api/trips/${tripId}/expenses`);
      if (response.ok) {
        const data = await response.json();
        setExpenses(data.expenses);
        setSummary(data.summary);
      }
    } catch (error) {
      console.error('Error fetching expenses:', error);
      toast.error('Failed to load expenses');
    } finally {
      setLoading(false);
    }
  };

  const calculateSummary = (expenseList) => {
    const newSummary = {
      total: expenseList.reduce((sum, expense) => sum + expense.amount, 0),
      currency: budget?.currency || 'USD',
      byCategory: {},
      byUser: {},
      owedToUser: 0,
      owesToOthers: 0
    };

    // Calculate category totals
    expenseList.forEach(expense => {
      const category = expense.category || 'other';
      newSummary.byCategory[category] = (newSummary.byCategory[category] || 0) + expense.amount;
    });

    // Calculate user balances
    expenseList.forEach(expense => {
      const paidBy = expense.paidBy.userId;
      newSummary.byUser[paidBy] = newSummary.byUser[paidBy] || { 
        paid: 0, 
        owes: 0, 
        name: expense.paidBy.name 
      };
      newSummary.byUser[paidBy].paid += expense.amount;

      expense.splitBetween.forEach(split => {
        const userId = split.userId;
        newSummary.byUser[userId] = newSummary.byUser[userId] || { 
          paid: 0, 
          owes: 0, 
          name: split.name 
        };
        newSummary.byUser[userId].owes += split.amount;
      });
    });

    // Calculate what current user owes/is owed
    if (newSummary.byUser[user?.id]) {
      const userBalance = newSummary.byUser[user.id];
      const netBalance = userBalance.paid - userBalance.owes;
      if (netBalance > 0) {
        newSummary.owedToUser = netBalance;
      } else {
        newSummary.owesToOthers = Math.abs(netBalance);
      }
    }

    setSummary(newSummary);
  };

  const addExpense = async () => {
    if (!newExpense.description.trim() || !newExpense.amount) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const response = await fetch(`/api/trips/${tripId}/expenses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newExpense)
      });

      if (response.ok) {
        const data = await response.json();
        setExpenses(prev => [data.expense, ...prev]);
        setNewExpense({
          description: '',
          amount: '',
          category: 'food',
          date: new Date().toISOString().split('T')[0],
          splitBetween: []
        });
        setShowAddForm(false);
        
        // Send real-time update
        sendExpenseUpdate(data.expense.id, data.expense, 'create');
        
        toast.success('Expense added');
        calculateSummary([data.expense, ...expenses]);
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to add expense');
      }
    } catch (error) {
      console.error('Error adding expense:', error);
      toast.error('Failed to add expense');
    }
  };

  const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const getCategoryIcon = (categoryId) => {
    const category = EXPENSE_CATEGORIES.find(c => c.id === categoryId);
    return category?.icon || '📦';
  };

  const getCategoryColor = (categoryId) => {
    const category = EXPENSE_CATEGORIES.find(c => c.id === categoryId);
    return category?.color || '#6B7280';
  };

  // Chart data
  const categoryChartData = {
    labels: Object.keys(summary.byCategory || {}).map(cat => 
      EXPENSE_CATEGORIES.find(c => c.id === cat)?.name || cat
    ),
    datasets: [{
      data: Object.values(summary.byCategory || {}),
      backgroundColor: Object.keys(summary.byCategory || {}).map(cat => getCategoryColor(cat)),
      borderWidth: 2,
      borderColor: '#ffffff'
    }]
  };

  const budgetData = {
    labels: EXPENSE_CATEGORIES.map(cat => cat.name),
    datasets: [
      {
        label: 'Spent',
        data: EXPENSE_CATEGORIES.map(cat => summary.byCategory?.[cat.id] || 0),
        backgroundColor: EXPENSE_CATEGORIES.map(cat => cat.color + '80'),
        borderColor: EXPENSE_CATEGORIES.map(cat => cat.color),
        borderWidth: 1
      },
      {
        label: 'Budget',
        data: EXPENSE_CATEGORIES.map(cat => budget?.categories?.[cat.id] || 0),
        backgroundColor: EXPENSE_CATEGORIES.map(cat => cat.color + '20'),
        borderColor: EXPENSE_CATEGORIES.map(cat => cat.color),
        borderWidth: 1,
        borderDash: [5, 5]
      }
    ]
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <CurrencyDollarIcon className="h-6 w-6 text-green-500" />
            <div>
              <h3 className="text-lg font-medium text-gray-900">Expense Tracker</h3>
              <p className="text-sm text-gray-500">
                Total: {formatCurrency(summary.total, summary.currency)}
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            <PlusIcon className="h-4 w-4" />
            <span>Add Expense</span>
          </button>
        </div>

        {/* Balance Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">↑</span>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-900">You're owed</p>
                <p className="text-lg font-semibold text-green-700">
                  {formatCurrency(summary.owedToUser || 0, summary.currency)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-red-50 p-4 rounded-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">↓</span>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-red-900">You owe</p>
                <p className="text-lg font-semibold text-red-700">
                  {formatCurrency(summary.owesToOthers || 0, summary.currency)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <ReceiptPercentIcon className="h-4 w-4 text-white" />
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-blue-900">Your share</p>
                <p className="text-lg font-semibold text-blue-700">
                  {formatCurrency((summary.byUser?.[user?.id]?.owes || 0), summary.currency)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6">
          {[
            { id: 'overview', name: 'Overview', icon: ChartPieIcon },
            { id: 'expenses', name: 'Expenses', icon: ReceiptPercentIcon },
            { id: 'balances', name: 'Balances', icon: UserGroupIcon }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Category Breakdown */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-md font-medium text-gray-900 mb-4">Spending by Category</h4>
              {Object.keys(summary.byCategory || {}).length > 0 ? (
                <div className="h-64">
                  <Doughnut 
                    data={categoryChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'bottom'
                        }
                      }
                    }}
                  />
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center text-gray-500">
                  No expenses yet
                </div>
              )}
            </div>

            {/* Budget vs Spent */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-md font-medium text-gray-900 mb-4">Budget vs Spending</h4>
              <div className="h-64">
                <Bar 
                  data={budgetData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true
                      }
                    },
                    plugins: {
                      legend: {
                        position: 'bottom'
                      }
                    }
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'expenses' && (
          <div className="space-y-4">
            {expenses.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <ReceiptPercentIcon className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                <p>No expenses recorded yet</p>
              </div>
            ) : (
              expenses.map(expense => (
                <div key={expense.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className="text-2xl">{getCategoryIcon(expense.category)}</div>
                      <div>
                        <h4 className="font-medium text-gray-900">{expense.description}</h4>
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                          <span className="flex items-center">
                            <TagIcon className="h-4 w-4 mr-1" />
                            {EXPENSE_CATEGORIES.find(c => c.id === expense.category)?.name}
                          </span>
                          <span className="flex items-center">
                            <CalendarIcon className="h-4 w-4 mr-1" />
                            {new Date(expense.date).toLocaleDateString()}
                          </span>
                          <span>Paid by {expense.paidBy.name}</span>
                        </div>
                        <div className="mt-2">
                          <span className="text-xs text-gray-400">Split between:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {expense.splitBetween.map(split => (
                              <span key={split.userId} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                                {split.name}: {formatCurrency(split.amount, expense.currency)}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold text-gray-900">
                        {formatCurrency(expense.amount, expense.currency)}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'balances' && (
          <div className="space-y-4">
            {Object.entries(summary.byUser || {}).map(([userId, userBalance]) => (
              <div key={userId} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-gray-600 font-medium">
                        {userBalance.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{userBalance.name}</h4>
                      <p className="text-sm text-gray-500">
                        Paid: {formatCurrency(userBalance.paid, summary.currency)} • 
                        Owes: {formatCurrency(userBalance.owes, summary.currency)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    {userBalance.paid - userBalance.owes >= 0 ? (
                      <div className="text-green-600 font-semibold">
                        +{formatCurrency(userBalance.paid - userBalance.owes, summary.currency)}
                      </div>
                    ) : (
                      <div className="text-red-600 font-semibold">
                        {formatCurrency(userBalance.paid - userBalance.owes, summary.currency)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Expense Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Add New Expense</h3>
              <button
                onClick={() => setShowAddForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  value={newExpense.description}
                  onChange={(e) => setNewExpense(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="What did you spend on?"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Amount
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={newExpense.amount}
                    onChange={(e) => setNewExpense(prev => ({ ...prev, amount: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    value={newExpense.category}
                    onChange={(e) => setNewExpense(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {EXPENSE_CATEGORIES.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.icon} {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={newExpense.date}
                  onChange={(e) => setNewExpense(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={addExpense}
                  className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  Add Expense
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}