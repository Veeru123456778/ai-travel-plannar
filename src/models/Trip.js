import mongoose from 'mongoose';

const DayPlanSchema = new mongoose.Schema({
  day: { type: Number, required: true },
  date: { type: Date, required: true },
  activities: [{
    id: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String },
    location: {
      name: { type: String, required: true },
      coordinates: {
        lat: { type: Number },
        lng: { type: Number }
      },
      address: { type: String }
    },
    time: {
      start: { type: String },
      end: { type: String },
      duration: { type: Number } // in minutes
    },
    cost: {
      amount: { type: Number, default: 0 },
      currency: { type: String, default: 'USD' },
      category: { type: String, enum: ['transport', 'food', 'accommodation', 'activity', 'other'], default: 'activity' }
    },
    images: [{ type: String }],
    tags: [{ type: String }],
    priority: { type: Number, default: 1 }, // 1-5 priority
    bookingInfo: {
      isBooked: { type: Boolean, default: false },
      bookingId: { type: String },
      bookingUrl: { type: String }
    }
  }],
  totalCost: { type: Number, default: 0 },
  notes: { type: String }
});

const CollaboratorSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // Clerk user ID
  email: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, enum: ['owner', 'editor', 'viewer'], default: 'viewer' },
  joinedAt: { type: Date, default: Date.now },
  lastActive: { type: Date, default: Date.now },
  avatar: { type: String }
});

const ExpenseSchema = new mongoose.Schema({
  id: { type: String, required: true },
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'USD' },
  category: { type: String, enum: ['transport', 'food', 'accommodation', 'activity', 'other'], required: true },
  paidBy: {
    userId: { type: String, required: true },
    name: { type: String, required: true }
  },
  splitBetween: [{
    userId: { type: String, required: true },
    name: { type: String, required: true },
    amount: { type: Number, required: true }
  }],
  date: { type: Date, required: true },
  receipt: { type: String }, // URL to receipt image
  attachedToActivity: { type: String }, // Activity ID if linked
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const NoteSchema = new mongoose.Schema({
  id: { type: String, required: true },
  content: { type: String, required: true },
  author: {
    userId: { type: String, required: true },
    name: { type: String, required: true },
    avatar: { type: String }
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  attachments: [{ type: String }], // URLs to attachments
  mentions: [{ type: String }], // User IDs mentioned in the note
  isPrivate: { type: Boolean, default: false }
});

const FieldLockSchema = new mongoose.Schema({
  fieldPath: { type: String, required: true }, // e.g., "dayPlans.0.activities.1.name"
  lockedBy: {
    userId: { type: String, required: true },
    name: { type: String, required: true }
  },
  lockedAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true } // Auto-unlock after 5 minutes of inactivity
});

const TripSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String },
  destination: {
    city: { type: String, required: true },
    country: { type: String, required: true },
    coordinates: {
      lat: { type: Number },
      lng: { type: Number }
    }
  },
  dates: {
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    duration: { type: Number, required: true } // in days
  },
  budget: {
    total: { type: Number, default: 0 },
    currency: { type: String, default: 'USD' },
    categories: {
      transport: { type: Number, default: 0 },
      accommodation: { type: Number, default: 0 },
      food: { type: Number, default: 0 },
      activities: { type: Number, default: 0 },
      other: { type: Number, default: 0 }
    }
  },
  preferences: {
    travelStyle: { type: String, enum: ['budget', 'mid-range', 'luxury'], default: 'mid-range' },
    groupSize: { type: Number, default: 1 },
    interests: [{ type: String }], // e.g., ['culture', 'adventure', 'food', 'nightlife']
    accessibility: [{ type: String }], // accessibility requirements
    dietaryRestrictions: [{ type: String }]
  },
  dayPlans: [DayPlanSchema],
  collaborators: [CollaboratorSchema],
  expenses: [ExpenseSchema],
  notes: [NoteSchema],
  fieldLocks: [FieldLockSchema],
  owner: {
    userId: { type: String, required: true },
    email: { type: String, required: true },
    name: { type: String, required: true }
  },
  status: { type: String, enum: ['draft', 'planning', 'confirmed', 'active', 'completed', 'cancelled'], default: 'draft' },
  isPublic: { type: Boolean, default: false },
  shareCode: { type: String, unique: true }, // For sharing trips via URL
  aiGeneratedAt: { type: Date },
  lastModified: { type: Date, default: Date.now },
  version: { type: Number, default: 1 }, // For optimistic locking
  metadata: {
    totalActivities: { type: Number, default: 0 },
    totalCost: { type: Number, default: 0 },
    weatherFetched: { type: Boolean, default: false },
    optimizationApplied: { type: Boolean, default: false }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
TripSchema.index({ 'owner.userId': 1 });
TripSchema.index({ 'collaborators.userId': 1 });
TripSchema.index({ shareCode: 1 });
TripSchema.index({ status: 1 });
TripSchema.index({ 'dates.startDate': 1 });
TripSchema.index({ createdAt: -1 });

// Virtual for total expenses
TripSchema.virtual('totalExpenses').get(function() {
  return this.expenses.reduce((total, expense) => total + expense.amount, 0);
});

// Virtual for days remaining
TripSchema.virtual('daysRemaining').get(function() {
  const now = new Date();
  const startDate = new Date(this.dates.startDate);
  const diffTime = startDate - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
});

// Middleware to update lastModified
TripSchema.pre('save', function(next) {
  this.lastModified = new Date();
  next();
});

// Middleware to clean up expired locks
TripSchema.pre('save', function(next) {
  const now = new Date();
  this.fieldLocks = this.fieldLocks.filter(lock => lock.expiresAt > now);
  next();
});

export default mongoose.models.Trip || mongoose.model('Trip', TripSchema);