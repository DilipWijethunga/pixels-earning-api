// server.js  (or index.js - whatever your main file is)
require('dotenv').config();   // ← Must stay at the very top

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const entriesRouter = require('./routes/entries');
const priceRouter = require('./routes/price');

const app = express();
const PORT = process.env.PORT || 5000;

// Simple permissive CORS
// This handles any origin, including Vercel preview URLs.
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/entries', entriesRouter);
app.use('/api/pixel-price', priceRouter);

// Health check (very useful on Render)
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'production'
  });
});

// Better MongoDB connection with validation
const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error('❌ MONGODB_URI is missing! Please add it in Render Environment Variables.');
    process.exit(1);
  }

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,   // Fail faster if can't connect
    });
    console.log('✅ Connected to MongoDB successfully');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  }
};

// Connect DB and start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`Backend URL: https://your-service-name.onrender.com`);
  });
});

// Optional: Handle graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('MongoDB connection closed.');
  process.exit(0);
});