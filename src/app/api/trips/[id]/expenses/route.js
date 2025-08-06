import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Trip from '@/models/Trip';
import { auth } from '@clerk/nextjs/server';
import { v4 as uuidv4 } from 'uuid';

// GET - Fetch trip expenses
export async function GET(req, { params }) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const { id } = params;

    const trip = await Trip.findOne({
      $and: [
        { id: id },
        {
          $or: [
            { 'owner.userId': userId },
            { 'collaborators.userId': userId }
          ]
        }
      ]
    }).select('expenses owner collaborators budget').lean();

    if (!trip) {
      return NextResponse.json({ error: 'Trip not found' }, { status: 404 });
    }

    // Check permissions
    const isOwner = trip.owner.userId === userId;
    const collaborator = trip.collaborators.find(c => c.userId === userId);
    const canViewExpenses = isOwner || collaborator?.role === 'editor';

    if (!canViewExpenses) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const expenses = trip.expenses || [];
    
    // Calculate expense summary
    const summary = {
      total: expenses.reduce((sum, expense) => sum + expense.amount, 0),
      currency: trip.budget?.currency || 'USD',
      byCategory: {},
      byUser: {},
      owedToUser: 0, // Amount others owe to current user
      owesToOthers: 0 // Amount current user owes to others
    };

    // Calculate category totals
    expenses.forEach(expense => {
      const category = expense.category || 'other';
      summary.byCategory[category] = (summary.byCategory[category] || 0) + expense.amount;
    });

    // Calculate user balances
    expenses.forEach(expense => {
      const paidBy = expense.paidBy.userId;
      summary.byUser[paidBy] = summary.byUser[paidBy] || { paid: 0, owes: 0, name: expense.paidBy.name };
      summary.byUser[paidBy].paid += expense.amount;

      expense.splitBetween.forEach(split => {
        const userId = split.userId;
        summary.byUser[userId] = summary.byUser[userId] || { paid: 0, owes: 0, name: split.name };
        summary.byUser[userId].owes += split.amount;
      });
    });

    // Calculate what current user owes/is owed
    if (summary.byUser[userId]) {
      const userBalance = summary.byUser[userId];
      const netBalance = userBalance.paid - userBalance.owes;
      if (netBalance > 0) {
        summary.owedToUser = netBalance;
      } else {
        summary.owesToOthers = Math.abs(netBalance);
      }
    }

    // Sort expenses by date (newest first)
    expenses.sort((a, b) => new Date(b.date) - new Date(a.date));

    return NextResponse.json({ 
      expenses,
      summary,
      budget: trip.budget 
    });

  } catch (error) {
    console.error('Error fetching expenses:', error);
    return NextResponse.json({ error: 'Failed to fetch expenses' }, { status: 500 });
  }
}

// POST - Create new expense
export async function POST(req, { params }) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const { id } = params;
    const expenseData = await req.json();

    // Validate required fields
    const { description, amount, category, date, splitBetween } = expenseData;
    
    if (!description || !amount || !category || !date) {
      return NextResponse.json({ 
        error: 'Missing required fields: description, amount, category, date' 
      }, { status: 400 });
    }

    if (amount <= 0) {
      return NextResponse.json({ error: 'Amount must be greater than 0' }, { status: 400 });
    }

    const trip = await Trip.findOne({
      $and: [
        { id: id },
        {
          $or: [
            { 'owner.userId': userId },
            { 'collaborators.userId': userId }
          ]
        }
      ]
    });

    if (!trip) {
      return NextResponse.json({ error: 'Trip not found' }, { status: 404 });
    }

    // Check permissions
    const isOwner = trip.owner.userId === userId;
    const collaborator = trip.collaborators.find(c => c.userId === userId);
    const canAddExpenses = isOwner || collaborator?.role === 'editor';

    if (!canAddExpenses) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    // Get user name
    const userName = isOwner ? trip.owner.name : collaborator.name;

    // Default split between all collaborators if not specified
    let splitDetails = splitBetween;
    if (!splitDetails || splitDetails.length === 0) {
      const allParticipants = [
        { userId: trip.owner.userId, name: trip.owner.name },
        ...trip.collaborators.filter(c => c.role === 'editor').map(c => ({ userId: c.userId, name: c.name }))
      ];
      
      const splitAmount = amount / allParticipants.length;
      splitDetails = allParticipants.map(participant => ({
        userId: participant.userId,
        name: participant.name,
        amount: splitAmount
      }));
    }

    // Validate split amounts
    const totalSplit = splitDetails.reduce((sum, split) => sum + split.amount, 0);
    if (Math.abs(totalSplit - amount) > 0.01) { // Allow for small rounding differences
      return NextResponse.json({ 
        error: 'Split amounts must equal the total expense amount' 
      }, { status: 400 });
    }

    // Create new expense
    const expenseId = uuidv4();
    const newExpense = {
      id: expenseId,
      description: description.trim(),
      amount: parseFloat(amount),
      currency: trip.budget?.currency || 'USD',
      category: category,
      paidBy: {
        userId: userId,
        name: userName
      },
      splitBetween: splitDetails,
      date: new Date(date),
      receipt: expenseData.receipt || '',
      attachedToActivity: expenseData.attachedToActivity || '',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    trip.expenses.push(newExpense);
    
    // Update budget categories
    if (trip.budget && trip.budget.categories) {
      trip.budget.categories[category] = (trip.budget.categories[category] || 0) + parseFloat(amount);
    }

    await trip.save();

    return NextResponse.json({ 
      success: true, 
      expense: newExpense 
    });

  } catch (error) {
    console.error('Error creating expense:', error);
    return NextResponse.json({ error: 'Failed to create expense' }, { status: 500 });
  }
}