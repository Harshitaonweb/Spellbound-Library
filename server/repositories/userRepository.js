const db = require('../config/db');

const findByEmail = async (email) => {
  try {
    const { rows } = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    return rows[0];
  } catch (error) {
    console.error('Error in findByEmail:', error);
    throw error;
  }
};

const findByUsername = async (username) => {
  try {
    const { rows } = await db.query('SELECT * FROM users WHERE username = $1', [username]);
    return rows[0];
  } catch (error) {
    // If username column doesn't exist yet, return null
    if (error.code === '42703') { // column does not exist
      console.warn('Username column does not exist yet');
      return null;
    }
    throw error;
  }
};

const findById = async (id) => {
  try {
    const { rows } = await db.query(
      'SELECT id, username, name, email, created_at FROM users WHERE id = $1',
      [id]
    );
    return rows[0];
  } catch (error) {
    // Fallback without username if column doesn't exist
    if (error.code === '42703') {
      const { rows } = await db.query(
        'SELECT id, name, email, created_at FROM users WHERE id = $1',
        [id]
      );
      return rows[0];
    }
    throw error;
  }
};

const create = async ({ username, name, email, password_hash }) => {
  try {
    const { rows } = await db.query(
      'INSERT INTO users (username, name, email, password_hash) VALUES ($1, $2, $3, $4) RETURNING id, username, name, email, created_at',
      [username, name, email, password_hash]
    );
    return rows[0];
  } catch (error) {
    // If username column doesn't exist, create without it
    if (error.code === '42703') {
      console.warn('Username column does not exist, creating user without username');
      const { rows } = await db.query(
        'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email, created_at',
        [name, email, password_hash]
      );
      return { ...rows[0], username: null };
    }
    throw error;
  }
};

module.exports = { findByEmail, findByUsername, findById, create };
