const express = require('express');
const postController = require('../controllers/postController');
const { authenticateToken, optionalAuth } = require('../middleware/auth');

// Create router for post-related endpoints
const router = express.Router();

// Post Routes - demonstrating RESTful API design
// REST (Representational State Transfer) uses HTTP methods to indicate operation type:
// - GET: Retrieve data (safe, no side effects)
// - POST: Create new data
// - PUT/PATCH: Update existing data
// - DELETE: Remove data

// The URL structure also follows REST conventions:
// - /posts - Collection of all posts
// - /posts/:id - Specific post by ID
// - /posts/my - Current user's posts (special collection)

// GET /posts - Retrieve all posts (with optional author filter)
// This is a public endpoint - anyone can view blog posts
// Query parameters: ?author=123 to filter by specific author
// Example URLs:
//   GET /posts - all posts
//   GET /posts?author=5 - posts by user ID 5
router.get('/', postController.getAllPosts);

// GET /posts/stats - Get post statistics
// This endpoint comes BEFORE /posts/:id because Express matches routes in order
// If we put this after /:id, Express would think "stats" is a post ID
// This demonstrates the importance of route ordering in Express
router.get('/stats', postController.getPostStats);

// GET /posts/my - Get current user's posts
// This requires authentication since it's user-specific
// Having this as a separate endpoint makes the API more intuitive
router.get('/my', authenticateToken, postController.getMyPosts);

// POST /posts - Create a new post
// This requires authentication - only logged-in users can create posts
// The request body should contain: { title, content }
router.post('/', authenticateToken, postController.createPost);

// GET /posts/:id - Get a specific post by ID
// This is public - anyone can read individual posts
// The :id is a route parameter that gets passed to req.params.id
// Example: GET /posts/123 - get post with ID 123
router.get('/:id', postController.getPostById);

// PUT /posts/:id - Update a specific post
// This requires authentication AND authorization
// Only the author of the post can update it (enforced in the controller)
// The request body should contain the updated: { title, content }
router.put('/:id', authenticateToken, postController.updatePost);

// DELETE /posts/:id - Delete a specific post
// This requires authentication AND authorization
// Only the author can delete their own post
// Returns 204 No Content on successful deletion
router.delete('/:id', authenticateToken, postController.deletePost);

// Advanced route example: GET /posts/:id/comments
// In a more complex blog, you might have nested resources like comments
// This would retrieve all comments for a specific post
// router.get('/:id/comments', commentController.getCommentsByPost);

// Advanced route example: POST /posts/:id/like
// This could handle "liking" a post
// Notice how the URL structure makes the relationship clear
// router.post('/:id/like', authenticateToken, postController.likePost);

// Route parameter validation middleware (advanced concept)
// You can add middleware to validate route parameters before they reach controllers
// This catches invalid IDs early and provides consistent error responses
router.param('id', (req, res, next, id) => {
  // Validate that ID is a positive integer
  const postId = parseInt(id, 10);
  if (isNaN(postId) || postId <= 0) {
    return res.status(400).json({
      error: 'Invalid post ID',
      details: 'Post ID must be a positive number'
    });
  }
  
  // Add the validated ID to the request for use in controllers
  req.postId = postId;
  next();
});

// Error handling middleware specific to post routes
// This catches any errors that weren't handled by the controllers
// It's a good practice to have route-specific error handling
router.use((error, req, res, next) => {
  console.error('Post routes error:', error);
  
  // Check if response was already sent
  if (res.headersSent) {
    return next(error);
  }
  
  res.status(500).json({
    error: 'Post operation failed',
    details: 'An unexpected error occurred while processing your post request'
  });
});

module.exports = router;