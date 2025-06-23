const express = require('express');
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');

// Create a router instance
// Express routers are like mini-applications that handle a specific set of routes
// This allows us to organize our routes logically and apply middleware selectively
const router = express.Router();

// Routes for authentication endpoints
// Notice the RESTful design pattern:
// - POST for creating/modifying data (register, login)
// - GET for retrieving data (current user info)

// POST /auth/register - Create a new user account
// This route is public - anyone can register
// The controller handles all the validation and business logic
router.post('/register', authController.register);

// POST /auth/login - Authenticate user credentials
// This route is also public - anyone can attempt to login
// The controller verifies credentials and returns a token if successful
router.post('/login', authController.login);

// GET /auth/me - Get current user information
// This route requires authentication - notice the middleware
// The authenticateToken middleware runs BEFORE the controller
// If authentication fails, the request never reaches the controller
router.get('/me', authenticateToken, authController.getCurrentUser);

// POST /auth/logout - End user session
// While JWT tokens are stateless, providing a logout endpoint is good UX
// Some systems might use this to blacklist tokens or log security events
router.post('/logout', authenticateToken, authController.logout);

// POST /auth/refresh - Get a new token with fresh expiration
// This allows users to stay logged in without re-entering credentials
// Useful for long-term sessions while maintaining security
router.post('/refresh', authenticateToken, authController.refreshToken);

// Export the router so it can be used in our main application
module.exports = router;