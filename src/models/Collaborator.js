import mongoose from 'mongoose';
const { Schema } = mongoose;

export const CollaboratorSchema = new Schema({
  userId: { type: String, required: true }, // Clerk user ID
  email: { type: String, required: true },
  permission: {
    type: String,
    enum: ['viewer', 'editor','owner'],
    default: 'viewer',
  },
}, { _id: false }); // Prevents Mongoose from creating separate _id for each collaborator
