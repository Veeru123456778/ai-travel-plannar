import { NextResponse } from 'next/server';
import { generateOptimizedItinerary } from '@/lib/ai';
import connectDB from '@/lib/db';
import Trip from '@/models/Trip';
import { auth } from '@clerk/nextjs/server';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const tripData = await req.json();

    // Validate required fields
    const requiredFields = ['destination', 'dates', 'preferences'];
    const missingFields = requiredFields.filter(field => !tripData[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json({ 
        error: `Missing required fields: ${missingFields.join(', ')}` 
      }, { status: 400 });
    }

    // Generate optimized itinerary using AI
    const itineraryData = await generateOptimizedItinerary(tripData);

    // Connect to database
    await connectDB();

    // Create trip document
    const tripId = uuidv4();
    const shareCode = uuidv4().substring(0, 8);

    const trip = new Trip({
      id: tripId,
      title: itineraryData.title || `Trip to ${tripData.destination.city}`,
      description: itineraryData.overview || '',
      destination: {
        city: tripData.destination.city,
        country: tripData.destination.country,
        coordinates: tripData.destination.coordinates
      },
      dates: {
        startDate: new Date(tripData.dates.startDate),
        endDate: new Date(tripData.dates.endDate),
        duration: Math.ceil((new Date(tripData.dates.endDate) - new Date(tripData.dates.startDate)) / (1000 * 60 * 60 * 24))
      },
      budget: {
        total: tripData.budget?.total || itineraryData.totalEstimatedCost.total,
        currency: tripData.budget?.currency || 'USD',
        categories: {
          transport: itineraryData.totalEstimatedCost.transport,
          accommodation: itineraryData.totalEstimatedCost.accommodation,
          food: itineraryData.totalEstimatedCost.food,
          activities: itineraryData.totalEstimatedCost.activities,
          other: 0
        }
      },
      preferences: {
        travelStyle: tripData.preferences.travelStyle || 'mid-range',
        groupSize: tripData.preferences.groupSize || 1,
        interests: tripData.preferences.interests || [],
        accessibility: tripData.preferences.accessibility || [],
        dietaryRestrictions: tripData.preferences.dietaryRestrictions || []
      },
      dayPlans: itineraryData.dailyPlans.map(day => ({
        day: day.day,
        date: new Date(day.date),
        activities: day.activities.map(activity => ({
          id: activity.id,
          name: activity.name,
          description: activity.description,
          location: activity.location,
          time: activity.time,
          cost: activity.cost,
          images: activity.images || [],
          tags: activity.tags || [],
          priority: activity.priority || 1,
          bookingInfo: {
            isBooked: false,
            bookingId: '',
            bookingUrl: ''
          }
        })),
        totalCost: day.totalCost || 0,
        notes: ''
      })),
      owner: {
        userId: userId,
        email: tripData.userEmail || '',
        name: tripData.userName || ''
      },
      collaborators: [],
      expenses: [],
      notes: [],
      fieldLocks: [],
      status: 'draft',
      isPublic: false,
      shareCode: shareCode,
      aiGeneratedAt: new Date(),
      metadata: {
        totalActivities: itineraryData.metadata?.totalActivities || 0,
        totalCost: itineraryData.totalEstimatedCost.total,
        weatherFetched: false,
        optimizationApplied: itineraryData.metadata?.optimizationApplied || false
      }
    });

    // Save to database
    await trip.save();

    // Return response with trip data and cost breakdown
    return NextResponse.json({
      success: true,
      trip: {
        id: tripId,
        title: trip.title,
        description: trip.description,
        destination: trip.destination,
        dates: trip.dates,
        budget: trip.budget,
        preferences: trip.preferences,
        dayPlans: trip.dayPlans,
        shareCode: shareCode,
        metadata: trip.metadata,
        aiGeneratedAt: trip.aiGeneratedAt
      },
      itinerary: itineraryData,
      costBreakdown: {
        estimated: itineraryData.totalEstimatedCost,
        ranges: itineraryData.costRanges,
        recommendations: itineraryData.recommendations
      }
    });

  } catch (error) {
    console.error('Error generating itinerary:', error);
    
    // Return appropriate error response
    if (error.message.includes('Failed to parse AI response')) {
      return NextResponse.json({ 
        error: 'AI service temporarily unavailable. Please try again.' 
      }, { status: 503 });
    }
    
    if (error.message.includes('GEMINI_API_KEY')) {
      return NextResponse.json({ 
        error: 'AI service configuration error.' 
      }, { status: 500 });
    }

    return NextResponse.json({ 
      error: 'Failed to generate itinerary. Please try again.' 
    }, { status: 500 });
  }
}


