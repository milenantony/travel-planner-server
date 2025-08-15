// server.js

// Import our tools
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
require('dotenv').config();

// Load our secrets from the .env file
dotenv.config();

// Initialize the express app
const app = express();

// Connect to the Database
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully!'))
  .catch(err => console.error('MongoDB connection error:', err));

// Use Middlewares
app.use(cors()); // Allows our frontend to talk to this server
app.use(express.json()); // Allows the server to understand JSON data sent to it

// Define and use our Routes
app.use('/api/auth', require('./routes/auth')); // Handles login/register routes
app.use('/api/ai', require('./routes/ai'));   // Handles all AI-related routes
app.use('/api/trips', require('./routes/trips'));

// Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));