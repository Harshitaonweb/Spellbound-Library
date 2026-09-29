require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 10000,
  query_timeout: 10000,
  statement_timeout: 10000,
});

async function testConnection() {
  let client;
  try {
    console.log('Testing database connection...');
    console.log('Database URL:', process.env.DATABASE_URL ? 'Set (hidden for security)' : 'NOT SET');
    
    client = await pool.connect();
    console.log('✅ Connected to database successfully');
    
    // Check current table structure
    const { rows } = await client.query(`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'users'
      ORDER BY ordinal_position
    `);
    
    console.log('\nCurrent users table columns:');
    rows.forEach(col => {
      console.log(`  - ${col.column_name}: ${col.data_type} (${col.is_nullable === 'YES' ? 'nullable' : 'NOT NULL'})`);
    });
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.error('Full error:', error);
  } finally {
    if (client) client.release();
    await pool.end();
  }
}

testConnection();
