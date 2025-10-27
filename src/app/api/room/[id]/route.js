import { connectToDB } from '@/lib/db';
import {Room} from '@/models/Room';
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
  try {
    await connectToDB();
    const room = await Room.findById(params.id).lean();
    if (!room) return NextResponse.json({ error: 'Room not found' }, { status: 404 });

    return NextResponse.json({ room });
  } catch (err) {
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}
