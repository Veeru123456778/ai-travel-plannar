import mongoose from 'mongoose';

const InviteSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  tripId: { type: String, required: true },
  tripTitle: { type: String, required: true },
  inviterUserId: { type: String, required: true },
  inviterName: { type: String, required: true },
  inviterEmail: { type: String, required: true },
  inviteeEmail: { type: String, required: true },
  inviteeUserId: { type: String }, // Set when invite is accepted by registered user
  role: { type: String, enum: ['editor', 'viewer'], required: true },
  status: { type: String, enum: ['pending', 'accepted', 'declined', 'expired', 'revoked'], default: 'pending' },
  token: { type: String, required: true, unique: true }, // Secure token for invite link
  message: { type: String, maxlength: 500 }, // Optional personal message
  expiresAt: { type: Date, required: true }, // Invites expire after 7 days
  acceptedAt: { type: Date },
  declinedAt: { type: Date },
  revokedAt: { type: Date },
  remindersSent: { type: Number, default: 0 },
  lastReminderAt: { type: Date },
  metadata: {
    inviteMethod: { type: String, enum: ['email', 'link', 'direct'], default: 'email' },
    userAgent: { type: String },
    ipAddress: { type: String }
  }
}, {
  timestamps: true
});

// Indexes for performance
InviteSchema.index({ tripId: 1 });
InviteSchema.index({ inviteeEmail: 1 });
InviteSchema.index({ token: 1 });
InviteSchema.index({ status: 1 });
InviteSchema.index({ expiresAt: 1 });
InviteSchema.index({ inviterUserId: 1 });

// Compound indexes
InviteSchema.index({ tripId: 1, inviteeEmail: 1 }, { unique: true }); // Prevent duplicate invites
InviteSchema.index({ status: 1, expiresAt: 1 }); // For cleanup of expired invites

// Virtual to check if invite is expired
InviteSchema.virtual('isExpired').get(function() {
  return this.expiresAt < new Date();
});

// Virtual to check if invite is still valid
InviteSchema.virtual('isValid').get(function() {
  return this.status === 'pending' && !this.isExpired;
});

// Middleware to auto-expire invites
InviteSchema.pre('save', function(next) {
  if (this.isExpired && this.status === 'pending') {
    this.status = 'expired';
  }
  next();
});

export default mongoose.models.Invite || mongoose.model('Invite', InviteSchema);