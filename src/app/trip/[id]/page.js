'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { useSocket } from '@/context/SocketContext';
import toast from 'react-hot-toast';

// Components
import TripNotes from '@/components/TripNotes';
import ExpenseTracker from '@/components/ExpenseTracker';
import PDFExportButton from '@/components/PDFExportButton';

// Icons
import { 
  CalendarIcon,
  MapPinIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  ClockIcon,
  ShareIcon,
  Cog6ToothIcon,
  ChatBubbleLeftRightIcon,
  ReceiptPercentIcon,
  DocumentArrowDownIcon,
  SparklesIcon,
  LockClosedIcon,
  PlusIcon
} from '@heroicons/react/24/outline';

export default function TripDetailPage() {
  const params = useParams();
  const { user } = useUser();
  const { 
    socket, 
    joinTrip, 
    participants, 
    isConnected, 
    isFieldLocked, 
    getFieldLock,
    lockField,
    unlockField,
    sendTripUpdate
  } = useSocket();

  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('itinerary');
  const [permissions, setPermissions] = useState({});
  const [editingField, setEditingField] = useState(null);
  const [showInviteModal, setShowInviteModal] = useState(false);

  const tripId = params.id;

  // Fetch trip data
  useEffect(() => {
    if (tripId) {
      fetchTrip();
    }
  }, [tripId]);

  // Join Socket.IO room when trip is loaded
  useEffect(() => {
    if (trip && user && socket) {
      joinTrip(tripId);
    }
  }, [trip, user, socket, tripId, joinTrip]);

  // Listen for real-time trip updates
  useEffect(() => {
    if (!socket) return;

    const handleTripUpdated = (data) => {
      const { updateType, payload, updatedBy, version } = data;
      
      if (updateType === 'itinerary-update') {
        setTrip(prev => ({ ...prev, ...payload, version }));
        if (updatedBy.userId !== user?.id) {
          toast.success(`${updatedBy.name} updated the itinerary`);
        }
      }
    };

    socket.on('trip-updated', handleTripUpdated);
    return () => socket.off('trip-updated', handleTripUpdated);
  }, [socket, user]);

  const fetchTrip = async () => {
    try {
      const response = await fetch(`/api/trips/${tripId}`);
      if (response.ok) {
        const data = await response.json();
        setTrip(data.trip);
        setPermissions(data.permissions);
      } else {
        toast.error('Failed to load trip');
      }
    } catch (error) {
      console.error('Error fetching trip:', error);
      toast.error('Failed to load trip');
    } finally {
      setLoading(false);
    }
  };

  const handleFieldEdit = (fieldPath, value) => {
    if (isFieldLocked(fieldPath)) {
      const lock = getFieldLock(fieldPath);
      toast.error(`Field is being edited by ${lock.userName}`);
      return;
    }

    // Lock the field and update
    lockField(fieldPath);
    setEditingField(fieldPath);

    // Update trip data
    const updatedTrip = { ...trip };
    const pathParts = fieldPath.split('.');
    let current = updatedTrip;
    
    for (let i = 0; i < pathParts.length - 1; i++) {
      current = current[pathParts[i]];
    }
    current[pathParts[pathParts.length - 1]] = value;

    setTrip(updatedTrip);

    // Send real-time update
    sendTripUpdate('itinerary-update', updatedTrip, trip.version + 1);

    // Unlock field after delay
    setTimeout(() => {
      unlockField(fieldPath);
      setEditingField(null);
    }, 1000);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (time) => {
    if (!time) return '';
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading trip details...</p>
        </div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Trip Not Found</h1>
          <p className="text-gray-600">The trip you're looking for doesn't exist or you don't have access to it.</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'itinerary', name: 'Itinerary', icon: CalendarIcon },
    { id: 'notes', name: 'Notes', icon: ChatBubbleLeftRightIcon },
    { id: 'expenses', name: 'Expenses', icon: ReceiptPercentIcon }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            {/* Trip Info */}
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">{trip.title}</h1>
              <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                <span className="flex items-center">
                  <MapPinIcon className="h-4 w-4 mr-1" />
                  {trip.destination.city}, {trip.destination.country}
                </span>
                <span className="flex items-center">
                  <CalendarIcon className="h-4 w-4 mr-1" />
                  {formatDate(trip.dates.startDate)} - {formatDate(trip.dates.endDate)}
                </span>
                <span className="flex items-center">
                  <ClockIcon className="h-4 w-4 mr-1" />
                  {trip.dates.duration} days
                </span>
                {trip.budget && (
                  <span className="flex items-center">
                    <CurrencyDollarIcon className="h-4 w-4 mr-1" />
                    {formatCurrency(trip.budget.total, trip.budget.currency)}
                  </span>
                )}
              </div>
            </div>

            {/* Participants & Actions */}
            <div className="flex items-center space-x-4">
              {/* Real-time participants */}
              {participants.length > 0 && (
                <div className="flex items-center space-x-2">
                  <div className="flex -space-x-2">
                    {participants.slice(0, 4).map((participant) => (
                      <div
                        key={participant.userId}
                        className="h-8 w-8 rounded-full bg-gray-300 border-2 border-white flex items-center justify-center text-xs font-medium"
                        title={participant.name}
                      >
                        {participant.name.charAt(0).toUpperCase()}
                      </div>
                    ))}
                    {participants.length > 4 && (
                      <div className="h-8 w-8 rounded-full bg-gray-500 border-2 border-white flex items-center justify-center text-xs font-medium text-white">
                        +{participants.length - 4}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className={`h-2 w-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span className="text-xs text-gray-500">
                      {isConnected ? 'Connected' : 'Disconnected'}
                    </span>
                  </div>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex items-center space-x-2">
                {permissions.canInvite && (
                  <button
                    onClick={() => setShowInviteModal(true)}
                    className="flex items-center space-x-1 px-3 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    <UserGroupIcon className="h-4 w-4" />
                    <span>Invite</span>
                  </button>
                )}
                
                <button className="flex items-center space-x-1 px-3 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                  <ShareIcon className="h-4 w-4" />
                  <span>Share</span>
                </button>

                <PDFExportButton 
                  tripData={trip} 
                  variant="outline"
                  buttonText="Export"
                />

                {permissions.canEdit && (
                  <button className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100">
                    <Cog6ToothIcon className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              {tabs.map((tab) => (
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
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'itinerary' && (
          <div className="space-y-6">
            {/* Trip Overview */}
            {trip.description && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Trip Overview</h3>
                <p className="text-gray-600">{trip.description}</p>
              </div>
            )}

            {/* Daily Itinerary */}
            <div className="space-y-4">
              {trip.dayPlans && trip.dayPlans.length > 0 ? (
                trip.dayPlans.map((day, dayIndex) => (
                  <div key={day.day} className="bg-white rounded-lg shadow">
                    {/* Day Header */}
                    <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 rounded-t-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">
                            Day {day.day} - {formatDate(day.date)}
                          </h3>
                          {day.notes && (
                            <p className="text-sm text-gray-600 mt-1">{day.notes}</p>
                          )}
                        </div>
                        {day.totalCost > 0 && (
                          <div className="text-right">
                            <span className="text-sm text-gray-500">Day Total</span>
                            <div className="text-lg font-semibold text-gray-900">
                              {formatCurrency(day.totalCost, trip.budget?.currency)}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Activities */}
                    <div className="p-6">
                      {day.activities && day.activities.length > 0 ? (
                        <div className="space-y-4">
                          {day.activities.map((activity, actIndex) => (
                            <div
                              key={activity.id}
                              className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                            >
                              {/* Time */}
                              <div className="flex-shrink-0 w-20 text-sm">
                                {activity.time?.start && (
                                  <div className="font-medium text-blue-600">
                                    {formatTime(activity.time.start)}
                                  </div>
                                )}
                                {activity.time?.duration && (
                                  <div className="text-gray-500">
                                    {activity.time.duration}m
                                  </div>
                                )}
                              </div>

                              {/* Activity Details */}
                              <div className="flex-1 min-w-0">
                                <h4 className="text-lg font-medium text-gray-900">
                                  {activity.name}
                                </h4>
                                {activity.description && (
                                  <p className="text-gray-600 mt-1">{activity.description}</p>
                                )}
                                {activity.location?.name && (
                                  <div className="flex items-center mt-2 text-sm text-gray-500">
                                    <MapPinIcon className="h-4 w-4 mr-1" />
                                    {activity.location.name}
                                  </div>
                                )}
                                {activity.tags && activity.tags.length > 0 && (
                                  <div className="flex flex-wrap gap-1 mt-2">
                                    {activity.tags.map((tag, tagIndex) => (
                                      <span
                                        key={tagIndex}
                                        className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
                                      >
                                        {tag}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>

                              {/* Cost & Actions */}
                              <div className="flex-shrink-0 text-right">
                                {activity.cost?.amount > 0 && (
                                  <div className="text-lg font-semibold text-gray-900">
                                    {formatCurrency(activity.cost.amount, activity.cost.currency)}
                                  </div>
                                )}
                                {activity.priority && (
                                  <div className="text-sm text-gray-500">
                                    Priority: {activity.priority}/5
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <CalendarIcon className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                          <p>No activities planned for this day</p>
                          {permissions.canEdit && (
                            <button className="mt-2 text-blue-500 hover:text-blue-600">
                              Add Activity
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-white rounded-lg shadow p-8 text-center">
                  <SparklesIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Itinerary Yet</h3>
                  <p className="text-gray-600 mb-4">
                    Get started by generating an AI-powered itinerary or creating one manually.
                  </p>
                  {permissions.canEdit && (
                    <div className="flex justify-center space-x-3">
                      <button className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                        <SparklesIcon className="h-4 w-4" />
                        <span>Generate with AI</span>
                      </button>
                      <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                        <PlusIcon className="h-4 w-4" />
                        <span>Add Manually</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'notes' && (
          <div className="h-96">
            <TripNotes tripId={tripId} />
          </div>
        )}

        {activeTab === 'expenses' && (
          <ExpenseTracker 
            tripId={tripId} 
            budget={trip.budget} 
            participants={[trip.owner, ...trip.collaborators]} 
          />
        )}
      </div>
    </div>
  );
}
  