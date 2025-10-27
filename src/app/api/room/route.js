// app/api/room/route.js
import { NextResponse } from 'next/server';
import { Room } from '@/models/Room';
import { connectToDB } from '@/lib/db';

export async function POST(req) {
  try {
    await connectToDB();

    const body = await req.json().catch(() => ({}));
    const userId = String(body.userId || '').trim();
    const email = String(body.email || '').trim().toLowerCase();

    if (!userId || !email) {
      return NextResponse.json({ error: 'userId and email are required' }, { status: 400 });
    }

    const room = await Room.create({
      ownerId: userId,
      ownerEmail: email,
      destination: null,
      dates: { startDate: '', endDate: '' },
      notes: '',
      itinerary: null,
      hotelCoords: {},              // optional; matches schema
      collaborators: [{ userId, email, permission: 'owner' }],
      // `type` intentionally ignored (generic trips now)
    });

    return NextResponse.json(
      { roomId: room._id.toString(), route: `/trip/${room._id}` },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating room:', error);
    return NextResponse.json({ error: 'Failed to create room' }, { status: 500 });
  }
}
