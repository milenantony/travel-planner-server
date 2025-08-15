// server/routes/trips.js

const express = require('express');
const router = express.Router();
// This path is now corrected to match your filename
const auth = require('../middleware/authMiddleware'); 
const {
  getTrips,
  createTrip,
  deleteTrip,
  getTripById,
  addDestination,
  deleteDestination,
  addActivity,
  deleteActivity
} = require('../controllers/tripsController');

// --- Trip Routes ---
router.get('/', auth, getTrips);
router.post('/', auth, createTrip);
router.get('/:id', auth, getTripById);
router.delete('/:id', auth, deleteTrip);

// --- Destination Routes ---
router.post('/:tripId/destinations', auth, addDestination);
router.delete('/:tripId/destinations/:destinationId', auth, deleteDestination);

// --- Activity Routes ---
router.post('/:tripId/destinations/:destinationId/activities', auth, addActivity);
router.delete('/:tripId/destinations/:destinationId/activities/:activityId', auth, deleteActivity);

module.exports = router;