import { connectToDB } from '@/lib/db';
import { Notification } from '@/models/Notification';
import { Room } from '@/models/Room';

export async function POST(req) {
  try {
    await connectToDB();

    const { email, roomId, permission, inviterId, inviterEmail } = await req.json();

    // 1. Fetch user from Clerk
    const userRes = await fetch(`https://api.clerk.com/v1/users?email_address=${email}`, {
      headers: {
        Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
      },
    });

    const users = await userRes.json();

    if (!Array.isArray(users) || users.length === 0) {
      return new Response(JSON.stringify({ error: 'User does not exist' }), { status: 404 });
    }

    const targetUser = users[0];
    const recipientId = targetUser.id;

    // 2. Check for existing pending invite
    const existingInvite = await Notification.findOne({
      recipientId,
      roomId,
      status: 'pending',
    });

    if (existingInvite) {
      return new Response(JSON.stringify({ error: 'User already invited' }), { status: 409 });
    }

    // 3. Create notification
    await Notification.create({
      recipientId,
      type: 'room_invite',
      roomId,
      inviterEmail,
      permission,
    });

   
    
    await fetch('http://localhost:5000/send-notification', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: recipientId,
        data: {
          title: 'Room Invite',
          message: `${inviterEmail} invited you to collaborate.`,
          roomId
        },
      }),
    });

    

    return new Response(JSON.stringify({ success: true }), { status: 200 });

  } catch (err) {
    console.error('Invite error:', err);
    return new Response('Internal Server Error', { status: 500 });
  }
}
