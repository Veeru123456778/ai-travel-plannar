import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Trip from '@/models/Trip';
import { auth } from '@clerk/nextjs/server';
import { v4 as uuidv4 } from 'uuid';

// GET - Fetch trip notes
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
    }).select('notes owner collaborators').lean();

    if (!trip) {
      return NextResponse.json({ error: 'Trip not found' }, { status: 404 });
    }

    // Filter notes based on permissions
    const isOwner = trip.owner.userId === userId;
    const collaborator = trip.collaborators.find(c => c.userId === userId);
    
    let notes = trip.notes || [];
    
    // Non-collaborators can only see public notes
    if (!isOwner && !collaborator) {
      notes = notes.filter(note => !note.isPrivate);
    }

    // Sort notes by creation date (newest first)
    notes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return NextResponse.json({ notes });

  } catch (error) {
    console.error('Error fetching notes:', error);
    return NextResponse.json({ error: 'Failed to fetch notes' }, { status: 500 });
  }
}

// POST - Create new note
export async function POST(req, { params }) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const { id } = params;
    const { content, isPrivate = false, mentions = [] } = await req.json();

    if (!content || content.trim().length === 0) {
      return NextResponse.json({ error: 'Note content is required' }, { status: 400 });
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
    
    if (!isOwner && !collaborator) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    // Create new note
    const noteId = uuidv4();
    const newNote = {
      id: noteId,
      content: content.trim(),
      author: {
        userId: userId,
        name: isOwner ? trip.owner.name : collaborator.name,
        avatar: '' // Could be populated from user data
      },
      isPrivate: isPrivate,
      mentions: mentions,
      attachments: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    trip.notes.push(newNote);
    await trip.save();

    return NextResponse.json({ 
      success: true, 
      note: newNote 
    });

  } catch (error) {
    console.error('Error creating note:', error);
    return NextResponse.json({ error: 'Failed to create note' }, { status: 500 });
  }
}