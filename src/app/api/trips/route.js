import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Trip from '@/models/Trip';
import User from '@/models/User';
import { auth } from '@clerk/nextjs/server';

// GET - Fetch user's trips
export async function GET(req) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const sort = searchParams.get('sort') || '-createdAt';

    // Build query
    const query = {
      $or: [
        { 'owner.userId': userId },
        { 'collaborators.userId': userId }
      ]
    };

    if (status) {
      query.status = status;
    }

    const skip = (page - 1) * limit;

    const trips = await Trip.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .select('-fieldLocks -notes -expenses.receipt')
      .lean();

    const total = await Trip.countDocuments(query);

    // Add user role information
    const tripsWithRoles = trips.map(trip => {
      const isOwner = trip.owner.userId === userId;
      const collaborator = trip.collaborators.find(c => c.userId === userId);
      
      return {
        ...trip,
        userRole: isOwner ? 'owner' : (collaborator?.role || 'viewer'),
        canEdit: isOwner || collaborator?.role === 'editor'
      };
    });

    return NextResponse.json({
      trips: tripsWithRoles,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching trips:', error);
    return NextResponse.json({ error: 'Failed to fetch trips' }, { status: 500 });
  }
}

// POST - Create a new trip
export async function POST(req) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const tripData = await req.json();
    await connectDB();

    // Validate required fields
    const requiredFields = ['title', 'destination', 'dates'];
    const missingFields = requiredFields.filter(field => !tripData[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json({ 
        error: `Missing required fields: ${missingFields.join(', ')}` 
      }, { status: 400 });
    }

    // Get user information
    const user = await User.findOne({ clerkId: userId });
    
    const trip = new Trip({
      ...tripData,
      owner: {
        userId: userId,
        email: user?.email || tripData.userEmail || '',
        name: user?.fullName || tripData.userName || ''
      },
      collaborators: [],
      expenses: [],
      notes: [],
      fieldLocks: [],
      status: 'draft'
    });

    await trip.save();

    // Update user stats
    if (user) {
      user.stats.tripsCreated += 1;
      await user.save();
    }

    return NextResponse.json({ 
      success: true, 
      trip: trip.toObject() 
    });

  } catch (error) {
    console.error('Error creating trip:', error);
    return NextResponse.json({ error: 'Failed to create trip' }, { status: 500 });
  }
}