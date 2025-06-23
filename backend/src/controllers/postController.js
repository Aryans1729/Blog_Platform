const Post = require('../models/Post');
const User = require('../models/User');

// Post Controller - handles all blog post operations
// This controller demonstrates RESTful API design principles:
// - GET requests retrieve data
// - POST requests create new data
// - PUT/PATCH requests update existing data
// - DELETE requests remove data

// Notice how each method follows a consistent pattern:
// 1. Validate input and check permissions
// 2. Perform the database operation using our models
// 3. Return a consistent response format
// 4. Handle errors gracefully

const postController = {
  // Create a new blog post
  // This endpoint requires authentication - only logged-in users can create posts
  createPost: async (req, res) => {
    try {
      // Extract title and content from request body
      const { title, content } = req.body;

      // The authenticateToken middleware has already verified the user
      // and attached their ID to req.userId
      if (!req.userId) {
        return res.status(401).json({
          error: 'Authentication required',
          details: 'You must be logged in to create a post'
        });
      }

      // Input validation - ensure we have the required data
      if (!title || !content) {
        return res.status(400).json({
          error: 'Missing required fields',
          details: 'Both title and content are required'
        });
      }

      // Additional validation for content quality
      if (title.trim().length < 3) {
        return res.status(400).json({
          error: 'Title too short',
          details: 'Title must be at least 3 characters long'
        });
      }

      if (content.trim().length < 10) {
        return res.status(400).json({
          error: 'Content too short',
          details: 'Content must be at least 10 characters long'
        });
      }

      // Create the post using our Post model
      // The model handles validation and database insertion
      const post = await Post.create(title, content, req.userId);

      // Return the created post with HTTP 201 (Created) status
      res.status(201).json({
        message: 'Post created successfully',
        post: post.toObject()
      });

    } catch (error) {
      console.error('Create post error:', error);
      
      res.status(500).json({
        error: 'Failed to create post',
        details: 'An unexpected error occurred. Please try again later.'
      });
    }
  },

  // Get all posts or posts filtered by author
  // This endpoint is public - anyone can view posts
  // The optional author filter demonstrates flexible API design
  getAllPosts: async (req, res) => {
    try {
      // Extract optional author filter from query parameters
      // Query parameters come after the ? in a URL: /posts?author=123
      const { author } = req.query;

      // Convert author to number if provided (query params are always strings)
      const authorId = author ? parseInt(author, 10) : null;

      // Validate author ID if provided
      if (author && (isNaN(authorId) || authorId <= 0)) {
        return res.status(400).json({
          error: 'Invalid author ID',
          details: 'Author ID must be a positive number'
        });
      }

      // If author filter is provided, verify the author exists
      if (authorId) {
        const authorUser = await User.findById(authorId);
        if (!authorUser) {
          return res.status(404).json({
            error: 'Author not found',
            details: `No user found with ID ${authorId}`
          });
        }
      }

      // Fetch posts (filtered by author if specified)
      const posts = await Post.findAll(authorId);

      // Convert posts to summary format for list views
      // This is more efficient and provides better user experience
      const postSummaries = posts.map(post => post.toSummary());

      // Return posts with metadata about the request
      res.status(200).json({
        message: authorId ? 
          `Posts by author ${authorId} retrieved successfully` : 
          'All posts retrieved successfully',
        posts: postSummaries,
        count: postSummaries.length,
        ...(authorId && { authorId }) // Include author ID in response if filtered
      });

    } catch (error) {
      console.error('Get all posts error:', error);
      
      res.status(500).json({
        error: 'Failed to retrieve posts',
        details: 'An unexpected error occurred. Please try again later.'
      });
    }
  },

  // Get a specific post by ID
  // This returns the full post content, not just a summary
  getPostById: async (req, res) => {
    try {
      // Extract post ID from URL parameters
      // URL parameters come from the route definition: /posts/:id
      const { id } = req.params;

      // Validate the ID
      const postId = parseInt(id, 10);
      if (isNaN(postId) || postId <= 0) {
        return res.status(400).json({
          error: 'Invalid post ID',
          details: 'Post ID must be a positive number'
        });
      }

      // Find the post
      const post = await Post.findById(postId);

      if (!post) {
        return res.status(404).json({
          error: 'Post not found',
          details: `No post found with ID ${postId}`
        });
      }

      // Return the full post object
      res.status(200).json({
        message: 'Post retrieved successfully',
        post: post.toObject()
      });

    } catch (error) {
      console.error('Get post by ID error:', error);
      
      res.status(500).json({
        error: 'Failed to retrieve post',
        details: 'An unexpected error occurred. Please try again later.'
      });
    }
  },

  // Update an existing post
  // Only the author can update their own posts
  updatePost: async (req, res) => {
    try {
      const { id } = req.params;
      const { title, content } = req.body;

      // Authentication check
      if (!req.userId) {
        return res.status(401).json({
          error: 'Authentication required',
          details: 'You must be logged in to update a post'
        });
      }

      // Validate post ID
      const postId = parseInt(id, 10);
      if (isNaN(postId) || postId <= 0) {
        return res.status(400).json({
          error: 'Invalid post ID',
          details: 'Post ID must be a positive number'
        });
      }

      // Input validation
      if (!title || !content) {
        return res.status(400).json({
          error: 'Missing required fields',
          details: 'Both title and content are required'
        });
      }

      // Find the existing post
      const post = await Post.findById(postId);

      if (!post) {
        return res.status(404).json({
          error: 'Post not found',
          details: `No post found with ID ${postId}`
        });
      }

      // Update the post (the model handles authorization)
      // This is a great example of how models can encapsulate business logic
      const updatedPost = await post.update(title, content, req.userId);

      res.status(200).json({
        message: 'Post updated successfully',
        post: updatedPost.toObject()
      });

    } catch (error) {
      console.error('Update post error:', error);

      // Handle authorization errors specifically
      if (error.message.includes('only edit your own posts')) {
        return res.status(403).json({
          error: 'Permission denied',
          details: 'You can only edit your own posts'
        });
      }
      
      res.status(500).json({
        error: 'Failed to update post',
        details: 'An unexpected error occurred. Please try again later.'
      });
    }
  },

  // Delete a post
  // Only the author can delete their own posts
  deletePost: async (req, res) => {
    try {
      const { id } = req.params;

      // Authentication check
      if (!req.userId) {
        return res.status(401).json({
          error: 'Authentication required',
          details: 'You must be logged in to delete a post'
        });
      }

      // Validate post ID
      const postId = parseInt(id, 10);
      if (isNaN(postId) || postId <= 0) {
        return res.status(400).json({
          error: 'Invalid post ID',
          details: 'Post ID must be a positive number'
        });
      }

      // Find the post
      const post = await Post.findById(postId);

      if (!post) {
        return res.status(404).json({
          error: 'Post not found',
          details: `No post found with ID ${postId}`
        });
      }

      // Delete the post (the model handles authorization)
      await post.delete(req.userId);

      // HTTP 204 (No Content) is perfect for successful deletions
      // It indicates success but no response body is needed
      res.status(204).send();

    } catch (error) {
      console.error('Delete post error:', error);

      // Handle authorization errors
      if (error.message.includes('only delete your own posts')) {
        return res.status(403).json({
          error: 'Permission denied',
          details: 'You can only delete your own posts'
        });
      }
      
      res.status(500).json({
        error: 'Failed to delete post',
        details: 'An unexpected error occurred. Please try again later.'
      });
    }
  },

  // Get posts by the currently authenticated user
  // This is useful for dashboard views where users see only their content
  getMyPosts: async (req, res) => {
    try {
      // Authentication check
      if (!req.userId) {
        return res.status(401).json({
          error: 'Authentication required',
          details: 'You must be logged in to view your posts'
        });
      }

      // Get posts by the current user
      const posts = await Post.findByAuthor(req.userId);

      // Convert to summary format
      const postSummaries = posts.map(post => post.toSummary());

      res.status(200).json({
        message: 'Your posts retrieved successfully',
        posts: postSummaries,
        count: postSummaries.length
      });

    } catch (error) {
      console.error('Get my posts error:', error);
      
      res.status(500).json({
        error: 'Failed to retrieve your posts',
        details: 'An unexpected error occurred. Please try again later.'
      });
    }
  },

  // Get statistics about posts (example of aggregation endpoint)
  // This demonstrates how to create useful analytical endpoints
  getPostStats: async (req, res) => {
    try {
      // Get all posts to calculate statistics
      const allPosts = await Post.findAll();

      // Calculate basic statistics
      const totalPosts = allPosts.length;
      
      // Group posts by author to find most active authors
      const authorStats = {};
      allPosts.forEach(post => {
        const authorId = post.authorId;
        if (!authorStats[authorId]) {
          authorStats[authorId] = {
            authorId,
            authorEmail: post.authorEmail,
            postCount: 0
          };
        }
        authorStats[authorId].postCount++;
      });

      // Convert to array and sort by post count
      const topAuthors = Object.values(authorStats)
        .sort((a, b) => b.postCount - a.postCount)
        .slice(0, 5); // Top 5 authors

      // Calculate posts per day (simple version)
      const now = new Date();
      const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      const recentPosts = allPosts.filter(post => 
        new Date(post.createdAt) > oneDayAgo
      ).length;

      res.status(200).json({
        message: 'Post statistics retrieved successfully',
        stats: {
          totalPosts,
          postsLast24Hours: recentPosts,
          topAuthors,
          totalAuthors: Object.keys(authorStats).length
        }
      });

    } catch (error) {
      console.error('Get post stats error:', error);
      
      res.status(500).json({
        error: 'Failed to retrieve post statistics',
        details: 'An unexpected error occurred. Please try again later.'
      });
    }
  }
};

module.exports = postController;