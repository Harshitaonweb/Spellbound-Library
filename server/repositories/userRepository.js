const db = require('../config/db');

const findByEmail = async (email) => {
  const { rows } = await db.query('SELECT * FROM users WHERE email = $1', [email]);
  return rows[0];
};

const findByUsername = async (username) => {
  const { rows } = await db.query('SELECT * FROM users WHERE username = $1', [username]);
  return rows[0];
};

const findById = async (id) => {
  const { rows } = await db.query(
    'SELECT id, username, name, email, created_at FROM users WHERE id = $1',
    [id]
  );
  return rows[0];
};

const create = async ({ username, name, email, password_hash }) => {
  const { rows } = await db.query(
    'INSERT INTO users (username, name, email, password_hash) VALUES ($1, $2, $3, $4) RETURNING id, username, name, email, created_at',
    [username, name, email, password_hash]
  );
  return rows[0];
};

module.exports = { findByEmail, findByUsername, findById, create };
