// server/index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');


const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
mongoose.connect('mongodb://localhost:27017/voting-db').then(console.log("successful"));

// Routes
app.use('/api', require('./routes/signup'));
app.use('/api', require('./routes/login'));

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));