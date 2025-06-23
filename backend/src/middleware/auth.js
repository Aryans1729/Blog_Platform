const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Authentication middleware - this is the "security guard" of our API
// Middleware functions sit between the incoming request and your route handlers
// They can modify the request, check permissions, or stop the request entirely

// Think of this flow: Request → Middleware → Route Handler → Response
// The middleware runs BEFORE your actual route code, giving you a chance
// to verify the user is authenticated and authorized

const authenticateToken = async (req, res, next) => {
  try {
    // Extract the Authorization header from the request
    // Standard format is: "Bearer <token>"
    // The "Bearer" part is a convention that indicates the token type
    const authHeader = req.headers['authorization'];
    
    // Check if the Authorization header exists and starts with "Bearer "
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        error: 'Access denied. No valid token provided.',
        details: 'Please include a valid JWT token in the Authorization header'
      });
    }

    // Extract the actual token (everything after "Bearer ")
    // We split on space and take the second part
    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ 
        error: 'Access denied. Token format is invalid.',
        details: 'Token should be provided as: Bearer <your-token>'
      });
    }

    // Verify the JWT token using our secret key
    // This checks three things:
    // 1. The token was signed with our secret (authenticity)
    // 2. The token hasn't been tampered with (integrity)
    // 3. The token hasn't expired (validity)
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (jwtError) {
      // Handle specific JWT errors with helpful messages
      if (jwtError.name === 'TokenExpiredError') {
        return res.status(401).json({
          error: 'Token has expired',
          details: 'Please log in again to get a new token'
        });
      } else if (jwtError.name === 'JsonWebTokenError') {
        return res.status(401).json({
          error: 'Invalid token',
          details: 'The provided token is malformed or invalid'
        });
      } else {
        return res.status(401).json({
          error: 'Token verification failed',
          details: jwtError.message
        });
      }
    }

    // The decoded token contains the payload we included when creating it
    // Typically this includes the user ID and possibly other basic info
    // Let's verify the user still exists in our database
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      // This handles the case where a user was deleted but their token is still valid
      // It's a security measure to prevent access with orphaned tokens
      return res.status(401).json({
        error: 'User no longer exists',
        details: 'The account associated with this token has been removed'
      });
    }

    // Add the user information to the request object
    // This makes the user data available to all subsequent route handlers
    // It's like adding a visitor badge that route handlers can check
    req.user = user.toSafeObject(); // Use the safe object method to avoid exposing sensitive data
    req.userId = user.id; // Convenience property for quick access to user ID
    
    // Call next() to pass control to the next middleware or route handler
    // This is crucial - without calling next(), the request will hang forever!
    next();
    
  } catch (error) {
    // Catch any unexpected errors and return a generic error message
    // We don't want to leak internal error details to potential attackers
    console.error('Authentication middleware error:', error);
    return res.status(500).json({
      error: 'Internal server error during authentication',
      details: 'Please try again later'
    });
  }
};

// Optional authentication middleware
// This is useful for routes that show different content based on whether user is logged in
// For example, a public homepage that shows "Login" button to guests but "Dashboard" to users
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    
    // If no auth header is provided, just continue without user info
    // This allows the route to handle both authenticated and non-authenticated requests
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      req.user = null;
      req.userId = null;
      return next();
    }

    const token = authHeader.split(' ')[1];
    
    if (!token) {
      req.user = null;
      req.userId = null;
      return next();
    }

    // Try to verify the token, but don't fail if it's invalid
    // Instead, just treat the user as not authenticated
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId);
      
      if (user) {
        req.user = user.toSafeObject();
        req.userId = user.id;
      } else {
        req.user = null;
        req.userId = null;
      }
    } catch (jwtError) {
      // Token is invalid, but that's okay for optional auth
      req.user = null;
      req.userId = null;
    }
    
    next();
    
  } catch (error) {
    // Even if there's an error, we don't fail the request for optional auth
    console.error('Optional authentication middleware error:', error);
    req.user = null;
    req.userId = null;
    next();
  }
};

// Helper function to generate JWT tokens
// This encapsulates the token creation logic so we can reuse it
// in multiple places (login, registration, token refresh, etc.)
const generateToken = (userId, expiresIn = '7d') => {
  try {
    // The payload contains the data we want to store in the token
    // Keep this minimal - tokens are sent with every request
    const payload = {
      userId: userId,
      // Add issued at time for better token management
      iat: Math.floor(Date.now() / 1000),
    };

    // Sign the token with our secret key
    // The expiresIn option automatically adds an 'exp' claim
    const token = jwt.sign(payload, process.env.JWT_SECRET, { 
      expiresIn,
      // Add issuer and audience for additional security
      issuer: 'blog-platform',
      audience: 'blog-platform-users'
    });
    
    return token;
  } catch (error) {
    throw new Error(`Failed to generate token: ${error.message}`);
  }
};

// Helper function to extract user ID from token without full authentication
// This is useful for less sensitive operations where you just need to know who the user is
const getUserIdFromToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.userId;
  } catch (error) {
    return null;
  }
};

module.exports = {
  authenticateToken,
  optionalAuth,
  generateToken,
  getUserIdFromToken
};