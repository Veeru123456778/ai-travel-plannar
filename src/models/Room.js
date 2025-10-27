import mongoose from 'mongoose';
import { CollaboratorSchema } from './Collaborator.js';

const { Schema } = mongoose;

// --- Subdocs (no _id) ---
const DatesSchema = new Schema(
  {
    startDate: { type: String, default: '' }, // ISO yyyy-mm-dd
    endDate:   { type: String, default: '' },
  },
  { _id: false }
);


// --- Main Room schema ---
const RoomSchema = new Schema(
  {
    // Ownership
    ownerId:    { type: String, required: true, index: true },
    ownerEmail: { type: String, required: true, lowercase: true, trim: true },

    // Minimal required fields for the new flow
    destination: { type: String, trim: true, default: null },
    dates:       { type: DatesSchema, default: () => ({}) },
    notes:       { type: String, default: '' },

    // Generated content
    itinerary:   { type: Schema.Types.Mixed, default: null }, // store whatever the LLM returns

    // Collaboration (invites / roles)
    collaborators: { type: [CollaboratorSchema], default: [] },

    // If some old routes still send these, they won’t crash.
    type:       { type: String, enum: ['ai', 'manual'], default: undefined, select: false },
    source:     { type: String, default: undefined, select: false },
    startDate:  { type: String, default: undefined, select: false },
    endDate:    { type: String, default: undefined, select: false },
    budget:     { type: String, default: undefined, select: false },
  },
  {
    timestamps: true,   // createdAt, updatedAt
    minimize: true,     // drop empty objects
    versionKey: false,  // remove __v
  }
);

// --- Validation: if both dates present, end >= start ---
RoomSchema.path('dates').validate(function (v) {
  const s = v?.startDate, e = v?.endDate;
  if (!s || !e) return true; // optional; UI enforces when needed
  // ISO yyyy-mm-dd strings compare lexicographically safely
  return e >= s;
}, 'endDate must be same or after startDate');

// --- Helpful indexes ---
RoomSchema.index({ createdAt: -1 });
RoomSchema.index({ destination: 1 });


export const Room = mongoose.models.Room || mongoose.model('Room', RoomSchema);
