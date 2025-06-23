// Load environment variables first - this must happen before importing other modules
// Environment variables contain sensitive configuration like JWT secrets
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

// Import our route modules
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');

// Initialize Express application
// Think of this as creating the foundation for your web server
const app = express();

// Middleware setup - ORDER MATTERS!
// Middleware functions execute in the order they're defined
// Each middleware can modify the request/response or stop the chain

// Security middleware using Helmet
// Helmet sets various HTTP headers to help protect against common vulnerabilities
// It's like putting a security system on your building before opening for business
app.use(helmet({
  // Configure content security policy for web security
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  // Enable additional security headers
  crossOriginEmbedderPolicy: false // Allow embedding if needed
}));

// CORS (Cross-Origin Resource Sharing) middleware
// This allows your frontend (running on a different port) to make requests to your API
// Without CORS, browsers block requests between different origins for security
const corsOptions = {
  origin: function (origin, callback) {
    // Define allowed origins
    const allowedOrigins = [
      'http://localhost:3000',  // Next.js development server
      'http://localhost:3001',  // Alternative development port
      'https://yourdomain.com', // Production frontend domain
    ];
    
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Allow cookies and authentication headers
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

app.use(cors(corsOptions));

// Body parsing middleware
// This allows Express to understand JSON data sent in request bodies
// Without this, req.body would be undefined
app.use(express.json({ 
  limit: '10mb' // Prevent overly large requests that could crash the server
}));

// URL-encoded body parsing (for form submissions)
app.use(express.urlencoded({ 
  extended: true,
  limit: '10mb'
}));

// Request logging middleware (custom)
// This helps with debugging and monitoring your API
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.url;
  const userAgent = req.get('User-Agent') || 'Unknown';
  
  console.log(`[${timestamp}] ${method} ${url} - ${userAgent}`);
  
  // You could extend this to log to files or external services
  // For production, consider using libraries like Winston or Morgan
  next();
});

// API health check endpoint
// This is crucial for monitoring and deployment systems
// It provides a quick way to verify your API is running correctly
app.get('/health', (req, res) => {
  // You could add more sophisticated health checks here:
  // - Database connectivity
  // - External service availability
  // - Memory usage, etc.
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

// API information endpoint
// Provides basic information about your API
app.get('/api', (req, res) => {
  res.status(200).json({
    name: 'Personal Blog Platform API',
    version: '1.0.0',
    description: 'A RESTful API for managing blog posts and user authentication',
    endpoints: {
      auth: '/api/auth',
      posts: '/api/posts',
      health: '/health'
    },
    documentation: 'https://your-api-docs.com' // Link to your API documentation
  });
});

// Mount route modules
// This is where we connect our organized route files to the main application
// The first parameter is the base path, the second is the router module
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);

// Catch-all route for undefined endpoints
// This should come AFTER all your defined routes
// It provides a consistent error response for invalid URLs
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    details: `The requested endpoint ${req.method} ${req.originalUrl} does not exist`,
    availableEndpoints: {
      auth: '/api/auth',
      posts: '/api/posts',
      health: '/health',
      info: '/api'
    }
  });
});

// Global error handling middleware
// This catches any errors that weren't handled elsewhere in your application
// It must be the LAST middleware in your app (after all routes and other middleware)
app.use((error, req, res, next) => {
  console.error('Global error handler:', error);

  // Check if response was already sent to avoid double responses
  if (res.headersSent) {
    return next(error);
  }

  // Handle specific error types
  if (error.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation failed',
      details: error.message
    });
  }

  if (error.name === 'CastError') {
    return res.status(400).json({
      error: 'Invalid data format',
      details: 'The provided data format is incorrect'
    });
  }

  // Handle CORS errors
  if (error.message && error.message.includes('CORS')) {
    return res.status(403).json({
      error: 'CORS policy violation',
      details: 'This origin is not allowed to access this API'
    });
  }

  // Default error response for unexpected errors
  // In production, you might want to log these to an external service
  res.status(500).json({
    error: 'Internal server error',
    details: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
});

// Graceful shutdown handling
// This ensures your application shuts down cleanly when terminated
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  // Close database connections, finish ongoing requests, etc.
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received. Shutting down gracefully...');
  process.exit(0);
});

// Start the server
const PORT = process.env.PORT || 3001;
const server = app.listen(PORT, () => {
  console.log(`
🚀 Blog Platform API Server Running!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📍 Server URL: http://localhost:${PORT}
🌍 Environment: ${process.env.NODE_ENV || 'development'}
📊 Health Check: http://localhost:${PORT}/health
📋 API Info: http://localhost:${PORT}/api
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Available Endpoints:
• POST /api/auth/register - Register new user
• POST /api/auth/login - User login
• GET  /api/auth/me - Get current user
• GET  /api/posts - Get all posts
• POST /api/posts - Create new post (auth required)
• GET  /api/posts/:id - Get specific post
• PUT  /api/posts/:id - Update post (auth required)
• DELETE /api/posts/:id - Delete post (auth required)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Press Ctrl+C to stop the server
  `);
});

// Export the app for testing purposes
module.exports = app;