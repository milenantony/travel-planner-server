// server/controllers/tripsController.js

const Trip = require('../models/Trip');

// Get all trips for the logged-in user
exports.getTrips = async (req, res) => {
  // ... (this function is unchanged)
  try {
    const trips = await Trip.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(trips);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Create a new trip for the logged-in user
exports.createTrip = async (req, res) => {
  // ... (this function is unchanged)
  try {
    const { name } = req.body;
    const newTrip = new Trip({
      name,
      user: req.user.id,
    });
    const trip = await newTrip.save();
    res.status(201).json(trip);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// --- NEW FUNCTION ---
// @desc    Delete a trip
exports.deleteTrip = async (req, res) => {
  try {
    // 1. Find the trip in the database by its ID
    let trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({ msg: 'Trip not found' });
    }

    // 2. CRITICAL: Make sure the logged-in user is the owner of the trip
    if (trip.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    // 3. If everything is okay, delete the trip
    await Trip.findByIdAndDelete(req.params.id);

    res.json({ msg: 'Trip removed successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// server/controllers/tripsController.js
// ... (getTrips, createTrip, deleteTrip functions are unchanged) ...

// --- NEW FUNCTION ---
// @desc    Get a single trip by its ID
exports.getTripById = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({ msg: 'Trip not found' });
    }

    // Ensure the logged-in user is the owner
    if (trip.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    res.json(trip);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};


// --- NEW FUNCTIONS ---

// @desc    Add a destination to a trip
exports.addDestination = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.tripId);
    if (!trip) return res.status(404).json({ msg: 'Trip not found' });
    if (trip.user.toString() !== req.user.id) return res.status(401).json({ msg: 'User not authorized' });

    const newDestination = {
      name: req.body.name,
    };

    trip.destinations.unshift(newDestination); // Add to the beginning of the array
    await trip.save();
    res.json(trip.destinations);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Delete a destination from a trip
exports.deleteDestination = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.tripId);
    if (!trip) return res.status(404).json({ msg: 'Trip not found' });
    if (trip.user.toString() !== req.user.id) return res.status(401).json({ msg: 'User not authorized' });

    // Pull out the destination from the array by its ID
    trip.destinations = trip.destinations.filter(
      (dest) => dest._id.toString() !== req.params.destinationId
    );

    await trip.save();
    res.json(trip.destinations);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};



// --- NEW FUNCTIONS ---

// @desc    Add an activity to a destination
exports.addActivity = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.tripId);
    if (!trip) return res.status(404).json({ msg: 'Trip not found' });
    if (trip.user.toString() !== req.user.id) return res.status(401).json({ msg: 'User not authorized' });

    // Find the specific destination within the trip
    const destination = trip.destinations.id(req.params.destinationId);
    if (!destination) return res.status(404).json({ msg: 'Destination not found' });

    const newActivity = {
      name: req.body.name,
    };

    destination.activities.unshift(newActivity); // Add activity to the destination
    await trip.save();
    res.json(trip); // Return the entire updated trip
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Delete an activity from a destination
exports.deleteActivity = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.tripId);
    if (!trip) return res.status(404).json({ msg: 'Trip not found' });
    if (trip.user.toString() !== req.user.id) return res.status(401).json({ msg: 'User not authorized' });

    const destination = trip.destinations.id(req.params.destinationId);
    if (!destination) return res.status(404).json({ msg: 'Destination not found' });

    // Pull the activity out of the destination's activities array
    destination.activities = destination.activities.filter(
      (activity) => activity._id.toString() !== req.params.activityId
    );

    await trip.save();
    res.json(trip); // Return the entire updated trip
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};