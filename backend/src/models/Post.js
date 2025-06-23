const { runQuery, getQuery, allQuery } = require('./database');

// The Post model handles all blog post operations
// Notice how this model focuses purely on post-related logic
// This separation of concerns makes our code easier to maintain and test

class Post {
  constructor(id, title, content, authorId, createdAt, authorEmail = null) {
    this.id = id;
    this.title = title;
    this.content = content;
    this.authorId = authorId;
    this.createdAt = createdAt;
    this.authorEmail = authorEmail; // This gets populated when we join with users table
  }

  // Create a new blog post
  // Notice the validation - we check that required fields exist
  // This prevents database errors and provides clear feedback to users
  static async create(title, content, authorId) {
    try {
      // Basic validation - in a larger app, you might use a validation library
      if (!title || title.trim().length === 0) {
        throw new Error('Title is required');
      }
      if (!content || content.trim().length === 0) {
        throw new Error('Content is required');
      }
      if (!authorId) {
        throw new Error('Author ID is required');
      }

      // Trim whitespace from title and content
      // This prevents issues with accidental spacing
      const trimmedTitle = title.trim();
      const trimmedContent = content.trim();

      // Insert the new post
      const result = await runQuery(
        'INSERT INTO posts (title, content, authorId) VALUES (?, ?, ?)',
        [trimmedTitle, trimmedContent, authorId]
      );

      // Return the created post with author information
      const newPost = await Post.findById(result.id);
      return newPost;
    } catch (error) {
      throw new Error(`Failed to create post: ${error.message}`);
    }
  }

  // Find a specific post by ID
  // We use a JOIN here to get author information along with the post
  // This is more efficient than making separate queries
  static async findById(id) {
    try {
      const query = `
        SELECT 
          posts.id,
          posts.title,
          posts.content,
          posts.authorId,
          posts.createdAt,
          users.email as authorEmail
        FROM posts
        LEFT JOIN users ON posts.authorId = users.id
        WHERE posts.id = ?
      `;
      
      const row = await getQuery(query, [id]);
      if (!row) {
        return null;
      }
      
      return new Post(
        row.id,
        row.title,
        row.content,
        row.authorId,
        row.createdAt,
        row.authorEmail
      );
    } catch (error) {
      throw new Error(`Failed to find post: ${error.message}`);
    }
  }

  // Get all posts, optionally filtered by author
  // This supports both "show all posts" and "show posts by specific author" functionality
  // The ORDER BY ensures newest posts appear first
  static async findAll(authorId = null) {
    try {
      let query = `
        SELECT 
          posts.id,
          posts.title,
          posts.content,
          posts.authorId,
          posts.createdAt,
          users.email as authorEmail
        FROM posts
        LEFT JOIN users ON posts.authorId = users.id
      `;
      
      let params = [];
      
      // If authorId is provided, filter by that author
      // This shows how we can make our methods flexible
      if (authorId) {
        query += ' WHERE posts.authorId = ?';
        params.push(authorId);
      }
      
      // Always order by creation date, newest first
      // This gives users the most recent content first
      query += ' ORDER BY posts.createdAt DESC';
      
      const rows = await allQuery(query, params);
      
      // Convert database rows to Post objects
      // This gives us consistent data structures throughout our app
      return rows.map(row => new Post(
        row.id,
        row.title,
        row.content,
        row.authorId,
        row.createdAt,
        row.authorEmail
      ));
    } catch (error) {
      throw new Error(`Failed to fetch posts: ${error.message}`);
    }
  }

  // Get posts by a specific author (convenience method)
  // This is essentially a wrapper around findAll() with a filter
  // Having explicit methods like this makes the API more intuitive
  static async findByAuthor(authorId) {
    return await Post.findAll(authorId);
  }

  // Update an existing post
  // Notice the authorization check - only the author can edit their posts
  // This is a crucial security feature that prevents unauthorized edits
  async update(title, content, requestingUserId) {
    try {
      // Authorization check - very important for security!
      // We verify that the person making the request is the author of the post
      if (this.authorId !== requestingUserId) {
        throw new Error('You can only edit your own posts');
      }

      // Validation
      if (!title || title.trim().length === 0) {
        throw new Error('Title is required');
      }
      if (!content || content.trim().length === 0) {
        throw new Error('Content is required');
      }

      const trimmedTitle = title.trim();
      const trimmedContent = content.trim();

      // Update the post in the database
      await runQuery(
        'UPDATE posts SET title = ?, content = ? WHERE id = ?',
        [trimmedTitle, trimmedContent, this.id]
      );

      // Update the current object's properties
      // This keeps our in-memory object in sync with the database
      this.title = trimmedTitle;
      this.content = trimmedContent;

      return this;
    } catch (error) {
      throw new Error(`Failed to update post: ${error.message}`);
    }
  }

  // Delete a post
  // Again, we include authorization to ensure only authors can delete their posts
  async delete(requestingUserId) {
    try {
      // Authorization check
      if (this.authorId !== requestingUserId) {
        throw new Error('You can only delete your own posts');
      }

      // Delete from database
      const result = await runQuery('DELETE FROM posts WHERE id = ?', [this.id]);
      
      // Check if the deletion actually happened
      // This helps us provide accurate feedback to users
      if (result.changes === 0) {
        throw new Error('Post not found or already deleted');
      }

      return true;
    } catch (error) {
      throw new Error(`Failed to delete post: ${error.message}`);
    }
  }

  // Convert post to a clean object for sending to client
  // This method ensures we send consistent, clean data to the frontend
  toObject() {
    return {
      id: this.id,
      title: this.title,
      content: this.content,
      authorId: this.authorId,
      authorEmail: this.authorEmail,
      createdAt: this.createdAt
    };
  }

  // Get a summary version of the post (useful for post lists)
  // This truncates long content to create preview snippets
  // It's more efficient and provides better user experience
  toSummary(maxContentLength = 200) {
    let summary = this.content;
    if (summary.length > maxContentLength) {
      // Find the last complete word within the limit
      // This prevents cutting words in half
      const truncated = summary.substring(0, maxContentLength);
      const lastSpace = truncated.lastIndexOf(' ');
      summary = truncated.substring(0, lastSpace) + '...';
    }

    return {
      id: this.id,
      title: this.title,
      content: summary,
      authorId: this.authorId,
      authorEmail: this.authorEmail,
      createdAt: this.createdAt
    };
  }
}

module.exports = Post;