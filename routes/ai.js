// server/routes/ai.js

const express = require('express');
const router = express.Router();

// Import our controller that contains the main AI logic
const aiController = require('../controllers/aiController');

// When a POST request comes to the URL '/suggest',
// run the 'suggestActivities' function from our controller.
router.post('/suggest', aiController.suggestActivities);

module.exports = router;