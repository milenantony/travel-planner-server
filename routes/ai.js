const express = require('express');
const router = express.Router();

// Import the specific controller for each route
const suggestActivitiesHandler = require('../controllers/suggestActivitiesController');
const generatePlanHandler = require('../controllers/generatePlanController');

// Use the imported handlers directly.
router.post('/suggest', suggestActivitiesHandler);
router.post('/generate-plan', generatePlanHandler);

module.exports = router;