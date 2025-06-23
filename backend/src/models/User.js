const bcrypt = require('bcryptjs');
const { runQuery, getQuery, allQuery } = require('./database');

// The User model encapsulates all user-related database operations
// This is an example of the "Active Record" pattern - each model represents a table
// and contains all the methods needed to work with that data

class User {
  constructor(id, email, passwordHash, createdAt) {
    this.id = id;
    this.email = email;
    this.passwordHash = passwordHash;
    this.createdAt = createdAt;
  }

  // Static method to create a new user
  // We use bcrypt to hash passwords - this is crucial for security
  // Never store plain text passwords! Even if your database is compromised,
  // attackers won't have the actual passwords
  static async create(email, password) {
    try {
      // Check if user already exists
      // This prevents duplicate accounts and provides clear error messages
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        throw new Error('User with this email already exists');
      }

      // Hash the password with a salt
      // Salt rounds of 12 provides good security without being too slow
      // Higher numbers = more secure but slower
      const saltRounds = 12;
      const passwordHash = await bcrypt.hash(password, saltRounds);

      // Insert the new user into the database
      const result = await runQuery(
        'INSERT INTO users (email, passwordHash) VALUES (?, ?)',
        [email, passwordHash]
      );

      // Return the created user (without the password hash for security)
      const newUser = await User.findById(result.id);
      return newUser;
    } catch (error) {
      // Re-throw with more context for better error handling
      throw new Error(`Failed to create user: ${error.message}`);
    }
  }

  // Find a user by their ID
  // This is used when we need to get user info from a JWT token
  static async findById(id) {
    try {
      const row = await getQuery('SELECT * FROM users WHERE id = ?', [id]);
      if (!row) {
        return null;
      }
      return new User(row.id, row.email, row.passwordHash, row.createdAt);
    } catch (error) {
      throw new Error(`Failed to find user by ID: ${error.message}`);
    }
  }

  // Find a user by their email address
  // This is primarily used during login to verify credentials
  static async findByEmail(email) {
    try {
      const row = await getQuery('SELECT * FROM users WHERE email = ?', [email]);
      if (!row) {
        return null;
      }
      return new User(row.id, row.email, row.passwordHash, row.createdAt);
    } catch (error) {
      throw new Error(`Failed to find user by email: ${error.message}`);
    }
  }

  // Verify a password against the stored hash
  // This is the magic that makes login work securely
  // We never store actual passwords, so we hash the provided password
  // and compare it to the stored hash
  async verifyPassword(password) {
    try {
      return await bcrypt.compare(password, this.passwordHash);
    } catch (error) {
      throw new Error(`Failed to verify password: ${error.message}`);
    }
  }

  // Convert user to a safe object for sending to client
  // This removes sensitive information like the password hash
  // Always be careful about what data you expose to the frontend!
  toSafeObject() {
    return {
      id: this.id,
      email: this.email,
      createdAt: this.createdAt
    };
  }

  // Get all users (useful for admin features or displaying authors)
  // Note: This also excludes password hashes for security
  static async findAll() {
    try {
      const rows = await allQuery('SELECT id, email, createdAt FROM users ORDER BY createdAt DESC');
      return rows.map(row => new User(row.id, row.email, null, row.createdAt));
    } catch (error) {
      throw new Error(`Failed to fetch users: ${error.message}`);
    }
  }
}

module.exports = User;