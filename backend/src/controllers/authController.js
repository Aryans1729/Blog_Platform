const User = require('../models/User');
const { generateToken } = require('../middleware/auth');

// Authentication Controller - handles user registration and login
// Controllers contain the business logic for handling specific types of requests
// They coordinate between the request/response and your models (database operations)

// Think of controllers as the "managers" in a restaurant:
// - Routes are like waiters who take orders (requests)
// - Controllers are managers who decide how to fulfill those orders
// - Models are the kitchen staff who prepare the food (database operations)

const authController = {
  // User Registration Endpoint
  // This creates a new user account and immediately logs them in
  register: async (req, res) => {
    try {
      // Extract email and password from the request body
      // req.body contains data sent by the client (usually JSON)
      const { email, password } = req.body;

      // Input validation - always validate user input!
      // This prevents errors and provides clear feedback to users
      if (!email || !password) {
        return res.status(400).json({
          error: 'Missing required fields',
          details: 'Both email and password are required'
        });
      }

      // Basic email format validation
      // In a production app, you might use a more sophisticated email validation library
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          error: 'Invalid email format',
          details: 'Please provide a valid email address'
        });
      }

      // Password strength validation
      // Strong passwords are crucial for security
      if (password.length < 6) {
        return res.status(400).json({
          error: 'Password too weak',
          details: 'Password must be at least 6 characters long'
        });
      }

      // Normalize email (convert to lowercase)
      // This prevents issues with case-sensitive email comparisons
      const normalizedEmail = email.toLowerCase().trim();

      // Create the user using our User model
      // The model handles password hashing and database insertion
      const user = await User.create(normalizedEmail, password);

      // Generate a JWT token for immediate login after registration
      // This provides a smooth user experience - no need to login after registering
      const token = generateToken(user.id);

      // Return success response with user data and token
      // HTTP 201 = "Created" - perfect for successful resource creation
      res.status(201).json({
        message: 'User registered successfully',
        user: user.toSafeObject(), // Never send password hashes to the client!
        token: token
      });

    } catch (error) {
      // Handle different types of errors appropriately
      console.error('Registration error:', error);

      // Check if it's a duplicate email error
      if (error.message.includes('already exists')) {
        return res.status(409).json({
          error: 'Email already registered',
          details: 'An account with this email already exists. Try logging in instead.'
        });
      }

      // Generic error response for unexpected errors
      // We don't want to leak internal error details to potential attackers
      res.status(500).json({
        error: 'Registration failed',
        details: 'An unexpected error occurred. Please try again later.'
      });
    }
  },

  // User Login Endpoint
  // This verifies credentials and returns a token for authenticated requests
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Input validation
      if (!email || !password) {
        return res.status(400).json({
          error: 'Missing credentials',
          details: 'Both email and password are required'
        });
      }

      // Normalize email
      const normalizedEmail = email.toLowerCase().trim();

      // Find the user by email
      const user = await User.findByEmail(normalizedEmail);
      
      // Security note: We use the same error message whether the user doesn't exist
      // or the password is wrong. This prevents attackers from discovering valid email addresses
      if (!user) {
        return res.status(401).json({
          error: 'Invalid credentials',
          details: 'Email or password is incorrect'
        });
      }

      // Verify the password using the User model's method
      // This compares the provided password against the stored hash
      const isValidPassword = await user.verifyPassword(password);
      
      if (!isValidPassword) {
        return res.status(401).json({
          error: 'Invalid credentials',
          details: 'Email or password is incorrect'
        });
      }

      // Generate JWT token for successful login
      const token = generateToken(user.id);

      // Return success response
      // HTTP 200 = "OK" - perfect for successful operations
      res.status(200).json({
        message: 'Login successful',
        user: user.toSafeObject(),
        token: token
      });

    } catch (error) {
      console.error('Login error:', error);
      
      res.status(500).json({
        error: 'Login failed',
        details: 'An unexpected error occurred. Please try again later.'
      });
    }
  },

  // Get Current User Endpoint
  // This allows the frontend to get current user info using their token
  // Useful for displaying user profiles or maintaining login state
  getCurrentUser: async (req, res) => {
    try {
      // The authenticateToken middleware has already verified the token
      // and attached the user information to req.user
      // This is why middleware is so powerful - it does the heavy lifting!

      if (!req.user) {
        return res.status(401).json({
          error: 'Not authenticated',
          details: 'No valid authentication token provided'
        });
      }

      // Return the current user's information
      res.status(200).json({
        message: 'User retrieved successfully',
        user: req.user
      });

    } catch (error) {
      console.error('Get current user error:', error);
      
      res.status(500).json({
        error: 'Failed to retrieve user information',
        details: 'An unexpected error occurred. Please try again later.'
      });
    }
  },

  // Logout Endpoint (Optional)
  // In JWT-based authentication, logout is typically handled on the client side
  // by simply discarding the token. However, we can provide a logout endpoint
  // for consistency and potential future enhancements (like token blacklisting)
  logout: async (req, res) => {
    try {
      // In a JWT system, we can't actually "invalidate" a token server-side
      // without maintaining a blacklist (which defeats the purpose of stateless tokens)
      
      // For now, we just return a success message
      // The client should discard the token upon receiving this response
      res.status(200).json({
        message: 'Logout successful',
        details: 'Please discard your authentication token'
      });

      // In a more advanced system, you might:
      // 1. Add the token to a blacklist stored in Redis
      // 2. Log the logout event for security auditing
      // 3. Clear any server-side sessions (if using hybrid auth)

    } catch (error) {
      console.error('Logout error:', error);
      
      res.status(500).json({
        error: 'Logout failed',
        details: 'An unexpected error occurred during logout'
      });
    }
  },

  // Token Refresh Endpoint (Advanced Feature)
  // This allows users to get a new token without re-entering credentials
  // Useful for maintaining long-term login sessions securely
  refreshToken: async (req, res) => {
    try {
      // This endpoint requires authentication (existing valid token)
      if (!req.userId) {
        return res.status(401).json({
          error: 'Authentication required',
          details: 'Valid token required for refresh'
        });
      }

      // Generate a new token with fresh expiration time
      const newToken = generateToken(req.userId);

      res.status(200).json({
        message: 'Token refreshed successfully',
        token: newToken
      });

    } catch (error) {
      console.error('Token refresh error:', error);
      
      res.status(500).json({
        error: 'Token refresh failed',
        details: 'Unable to refresh authentication token'
      });
    }
  }
};

module.exports = authController;