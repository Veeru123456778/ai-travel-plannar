import mongoose from 'mongoose';
const { Schema } = mongoose;

const NotificationSchema = new Schema({
  recipientId: { type: String, required: true }, // Clerk User ID
  type: { type: String, enum: ['room_invite'], required: true },
  roomId: { type: Schema.Types.ObjectId, ref: 'Room', required: true },
  inviterEmail: { type: String, required: true },
  permission: { type: String, enum: ['editor', 'viewer'], required: true },
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

export const Notification = mongoose.models.Notification || mongoose.model('Notification', NotificationSchema);
