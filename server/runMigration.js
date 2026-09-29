require('dotenv').config();
const fs = require('fs');
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function runMigration() {
  try {
    console.log('Running migration: add_username_column.sql');
    
    const sql = fs.readFileSync('./migrations/add_username_column.sql', 'utf8');
    await pool.query(sql);
    
    console.log('✅ Migration completed successfully!');
    
    // Verify the column exists
    const { rows } = await pool.query(`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'users' AND column_name = 'username'
    `);
    
    if (rows.length > 0) {
      console.log('✅ Username column verified:', rows[0]);
    } else {
      console.log('❌ Username column not found');
    }
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    throw error;
  } finally {
    await pool.end();
  }
}

runMigration();
