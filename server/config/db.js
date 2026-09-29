const { Pool } = require('pg');

let pool;

// Enhanced connection configuration with retry logic
const createPool = () => {
  const config = process.env.DATABASE_URL ? {
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { 
      rejectUnauthorized: false,
      secureOptions: 0x4 // SSL_OP_LEGACY_SERVER_CONNECT
    } : false,
    max: 5,
    min: 1,
    idleTimeoutMillis: 10000,
    connectionTimeoutMillis: 30000,
    keepAlive: true,
    keepAliveInitialDelayMillis: 5000,
  } : {
    host: 'localhost',
    port: 5432,
    database: 'studysync',
    user: process.env.USER || 'harshita',
    password: null,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  };

  const newPool = new Pool(config);
  
  newPool.on('error', (err) => {
    console.error('Unexpected DB error', err.message);
  });
  
  return newPool;
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
