// server/routes/trips.js

const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
// --- IMPORT THE NEW FUNCTION ---
const { getTrips, createTrip, deleteTrip, getTripById,addDestination,deleteDestination,addActivity,deleteActivity,} = require('../controllers/tripsController');

// ... (GET '/' and POST '/' routes are unchanged) ...
router.get('/', authMiddleware, getTrips);
router.post('/', authMiddleware, createTrip);


// --- NEW ROUTE ---
// @route   GET api/trips/:id
// @desc    Get a single trip
// @access  Private
router.get('/:id', authMiddleware, getTripById);
// --- NEW ROUTES ---

// @route   POST api/trips/:tripId/destinations
// @desc    Add a destination to a trip
// @access  Private
router.post('/:tripId/destinations', authMiddleware, addDestination);
// --- NEW ROUTES ---

// @route   POST /api/trips/:tripId/destinations/:destinationId/activities
// @desc    Add an activity
// @access  Private
router.post('/:tripId/destinations/:destinationId/activities', authMiddleware, addActivity);

// @route   DELETE /api/trips/:tripId/destinations/:destinationId/activities/:activityId
// @desc    Delete an activity
// @access  Private
router.delete('/:tripId/destinations/:destinationId/activities/:activityId', authMiddleware, deleteActivity);
// @route   DELETE api/trips/:tripId/destinations/:destinationId
// @desc    Delete a destination
// @access  Private
router.delete('/:tripId/destinations/:destinationId', authMiddleware, deleteDestination);



// ... (DELETE '/:id' route is unchanged) ...
router.delete('/:id', authMiddleware, deleteTrip);


module.exports = router;