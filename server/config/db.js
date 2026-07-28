const { Pool } = require('pg');

let pool;

if (process.env.DATABASE_URL) {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
    keepAlive: true,
    keepAliveInitialDelayMillis: 10000,
  });
} else {
  pool = new Pool({
    host: 'localhost',
    port: 5432,
    database: 'studysync',
    user: process.env.USER || 'harshita',
    password: null,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  });
}

pool.on('error', (err) => {
  console.error('Unexpected DB error', err.message);
});

module.exports = pool;
