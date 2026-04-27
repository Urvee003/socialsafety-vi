// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Connect to database
connectDB();

const app = express();

// Body parser and CORS middleware
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Basic Route for testing
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Setup Port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
