// server/models/Trip.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// --- NEW ---
const ActivitySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  // We could add notes, time, cost, etc. later
});
// --- END NEW ---

const DestinationSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  // --- THIS IS THE CHANGE ---
  activities: [ActivitySchema],
  // --- END CHANGE ---
});

const TripSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  destinations: [DestinationSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Trip', TripSchema);