const { Pool } = require('pg');

let pool;

const createPool = () => {
  const config = process.env.DATABASE_URL ? {
    connectionString: process.env.DATABASE_URL,
    ssl: false,
    max: 5,
    min: 1,
    idleTimeoutMillis: 10000,
    connectionTimeoutMillis: 30000,
  } : {
    host: 'localhost',
    port: 5432,
    database: 'studysync',
    user: process.env.USER || 'harshita',
    password: null,
    max: 10,
  };

  return new Pool(config);
};

pool = createPool();

// Wrapper to handle connection issues gracefully
const originalQuery = pool.query.bind(pool);
pool.query = async (...args) => {
  try {
    return await originalQuery(...args);
  } catch (error) {
    // Log the error for debugging
    console.error('Database query error:', error.message);
    throw error;
  }
};

module.exports = pool;
