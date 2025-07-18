require('dotenv').config();
const express = require('express');
const cors = require('cors');
const videoRoutes = require('./api/video');
const userRoutes = require('./api/users');
const postRoutes = require('./api/posts');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/video', videoRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Pling backend is running! 💜',
    timestamp: new Date().toISOString()
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: '💜 Welcome to Pling API',
    version: '1.0.0',
    features: [
      'AI Video Generation',
      'Mood-Based Content',
      'Social Creativity',
      'Wellness Tracking'
    ]
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: err.message,
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    path: req.originalUrl,
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Pling backend server running on port ${PORT}`);
  console.log(`💜 Health check: http://localhost:${PORT}/health`);
  console.log(`🎬 Video API: http://localhost:${PORT}/api/video`);
});