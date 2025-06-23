const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Database connection setup
// SQLite is perfect for development - it's a file-based database that doesn't require a separate server
// In production, you'd typically upgrade to PostgreSQL or MySQL for better concurrency and features
const dbPath = path.join(__dirname, '../../blog.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database');
  }
});

// Initialize database schema
// This function creates our tables if they don't exist
// Think of tables as spreadsheets - each row is a record, each column is a field
const initializeDatabase = () => {
  // Users table - stores account information
  // Notice how we store passwordHash, never the actual password for security
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      passwordHash TEXT NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error('Error creating users table:', err.message);
    } else {
      console.log('Users table ready');
    }
  });

  // Posts table - stores blog articles
  // The authorId creates a relationship between posts and users
  // This is called a "foreign key" - it links records across tables
  db.run(`
    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      authorId INTEGER NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (authorId) REFERENCES users (id)
    )
  `, (err) => {
    if (err) {
      console.error('Error creating posts table:', err.message);
    } else {
      console.log('Posts table ready');
    }
  });
};

// Helper function to run database queries with promises
// This converts SQLite's callback-based API to modern async/await style
// It's much easier to handle errors and write clean code this way
const runQuery = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) {
        reject(err);
      } else {
        // 'this' refers to the SQLite statement context
        // this.lastID gives us the ID of newly inserted records
        // this.changes tells us how many rows were affected
        resolve({ id: this.lastID, changes: this.changes });
      }
    });
  });
};

// Helper function to get single record
const getQuery = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
};

// Helper function to get multiple records
const allQuery = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

// Initialize the database when this module is loaded
initializeDatabase();

module.exports = {
  db,
  runQuery,
  getQuery,
  allQuery
};