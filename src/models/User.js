import mongoose from 'mongoose';

const UserPreferencesSchema = new mongoose.Schema({
  defaultCurrency: { type: String, default: 'USD' },
  defaultTravelStyle: { type: String, enum: ['budget', 'mid-range', 'luxury'], default: 'mid-range' },
  notifications: {
    email: { type: Boolean, default: true },
    push: { type: Boolean, default: true },
    tripUpdates: { type: Boolean, default: true },
    expenseAlerts: { type: Boolean, default: true },
    collaborationUpdates: { type: Boolean, default: true }
  },
  privacy: {
    showEmail: { type: Boolean, default: false },
    showTrips: { type: Boolean, default: false },
    allowInvites: { type: Boolean, default: true }
  },
  interests: [{ type: String }],
  languages: [{ type: String }],
  timezone: { type: String, default: 'UTC' }
});

const UserStatsSchema = new mongoose.Schema({
  tripsCreated: { type: Number, default: 0 },
  tripsJoined: { type: Number, default: 0 },
  totalExpenses: { type: Number, default: 0 },
  countriesVisited: [{ type: String }],
  favoriteDestinations: [{ type: String }],
  totalDistance: { type: Number, default: 0 }, // in km
  collaborationsCount: { type: Number, default: 0 }
});

const UserSchema = new mongoose.Schema({
  clerkId: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  avatar: { type: String },
  bio: { type: String, maxlength: 500 },
  preferences: { type: UserPreferencesSchema, default: {} },
  stats: { type: UserStatsSchema, default: {} },
  subscription: {
    plan: { type: String, enum: ['free', 'premium', 'enterprise'], default: 'free' },
    expiresAt: { type: Date },
    features: [{ type: String }]
  },
  lastActiveAt: { type: Date, default: Date.now },
  isVerified: { type: Boolean, default: false },
  status: { type: String, enum: ['active', 'suspended', 'deleted'], default: 'active' }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
UserSchema.index({ clerkId: 1 });
UserSchema.index({ email: 1 });
UserSchema.index({ status: 1 });
UserSchema.index({ 'subscription.plan': 1 });

// Virtual for full name
UserSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual for subscription status
UserSchema.virtual('isSubscriptionActive').get(function() {
  if (this.subscription.plan === 'free') return true;
  return this.subscription.expiresAt && this.subscription.expiresAt > new Date();
});

export default mongoose.models.User || mongoose.model('User', UserSchema);