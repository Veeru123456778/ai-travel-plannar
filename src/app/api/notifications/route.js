import { Notification } from "@/models/Notification";
import { connectToDB } from "@/lib/db";

export async function GET(req) {
  try {
    await connectToDB();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId"); // Clerk userId

    if (!userId) return new Response("Missing userId", { status: 400 });

    const notifications = await Notification.find({
      recipientId: userId,
      status: 'pending'
    }).sort({ createdAt: -1 });

    return new Response(JSON.stringify(notifications), { status: 200 });
  } catch (err) {
    console.error("Error fetching notifications:", err);
    return new Response("Internal server error", { status: 500 });
  }
}
