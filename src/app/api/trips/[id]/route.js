import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Trip from '@/models/Trip';
import User from '@/models/User';
import { auth } from '@clerk/nextjs/server';

// GET - Fetch specific trip
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
            { 'collaborators.userId': userId },
            { isPublic: true }
          ]
        }
      ]
    }).lean();

    if (!trip) {
      return NextResponse.json({ error: 'Trip not found' }, { status: 404 });
    }

    // Check user permissions
    const isOwner = trip.owner.userId === userId;
    const collaborator = trip.collaborators.find(c => c.userId === userId);
    const userRole = isOwner ? 'owner' : (collaborator?.role || 'viewer');
    const canEdit = isOwner || collaborator?.role === 'editor';

    // Filter sensitive data based on permissions
    let responseTrip = { ...trip };
    if (!canEdit) {
      // Remove sensitive fields for viewers
      delete responseTrip.fieldLocks;
      responseTrip.expenses = responseTrip.expenses?.map(expense => ({
        ...expense,
        receipt: undefined // Hide receipt URLs for viewers
      }));
    }

    return NextResponse.json({
      trip: responseTrip,
      userRole,
      canEdit,
      permissions: {
        canEdit,
        canDelete: isOwner,
        canInvite: isOwner || collaborator?.role === 'editor',
        canViewExpenses: canEdit
      }
    });

  } catch (error) {
    console.error('Error fetching trip:', error);
    return NextResponse.json({ error: 'Failed to fetch trip' }, { status: 500 });
  }
}

// PUT - Update trip
export async function PUT(req, { params }) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const { id } = params;
    const updateData = await req.json();

    // Find trip and check permissions
    const trip = await Trip.findOne({ id: id });
    
    if (!trip) {
      return NextResponse.json({ error: 'Trip not found' }, { status: 404 });
    }

    const isOwner = trip.owner.userId === userId;
    const collaborator = trip.collaborators.find(c => c.userId === userId);
    const canEdit = isOwner || collaborator?.role === 'editor';

    if (!canEdit) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    // Prevent modification of certain fields by non-owners
    if (!isOwner) {
      delete updateData.owner;
      delete updateData.collaborators;
      delete updateData.shareCode;
      delete updateData.isPublic;
    }

    // Update version for optimistic locking
    const currentVersion = trip.version || 1;
    if (updateData.version && updateData.version !== currentVersion) {
      return NextResponse.json({ 
        error: 'Trip was modified by another user. Please refresh and try again.' 
      }, { status: 409 });
    }

    // Apply updates
    Object.assign(trip, updateData);
    trip.version = currentVersion + 1;
    trip.lastModified = new Date();

    await trip.save();

    return NextResponse.json({ 
      success: true, 
      trip: trip.toObject(),
      version: trip.version
    });

  } catch (error) {
    console.error('Error updating trip:', error);
    return NextResponse.json({ error: 'Failed to update trip' }, { status: 500 });
  }
}

// DELETE - Delete trip
export async function DELETE(req, { params }) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const { id } = params;

    const trip = await Trip.findOne({ id: id });
    
    if (!trip) {
      return NextResponse.json({ error: 'Trip not found' }, { status: 404 });
    }

    // Only owner can delete
    if (trip.owner.userId !== userId) {
      return NextResponse.json({ error: 'Only trip owner can delete' }, { status: 403 });
    }

    await Trip.deleteOne({ id: id });

    // Update user stats
    const user = await User.findOne({ clerkId: userId });
    if (user && user.stats.tripsCreated > 0) {
      user.stats.tripsCreated -= 1;
      await user.save();
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error deleting trip:', error);
    return NextResponse.json({ error: 'Failed to delete trip' }, { status: 500 });
  }
}