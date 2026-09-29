const { Pool } = require('pg');
const fs = require('fs');

// Use DATABASE_URL or default to local socket connection
const connectionString = process.env.DATABASE_URL || `postgresql://${process.env.USER}@localhost:5432/postgres`;

console.log('Connecting with:', connectionString.replace(/:[^:@]+@/, ':****@'));

const adminPool = new Pool({
  connectionString,
});

async function setupDatabase() {
  let client;
  try {
    client = await adminPool.connect();
    console.log('✅ Connected to PostgreSQL');

    // Check if database exists
    const dbCheck = await client.query(
      "SELECT datname FROM pg_database WHERE datname = 'studysync'"
    );

    if (dbCheck.rows.length === 0) {
      console.log('📦 Creating studysync database...');
      await client.query('CREATE DATABASE studysync');
      console.log('✅ Database created');
    } else {
      console.log('✅ Database already exists');
    }

    client.release();
    await adminPool.end();

    // Connect to studysync database and run schema
    const dbConnectionString = process.env.DATABASE_URL || `postgresql://${process.env.USER}@localhost:5432/studysync`;
    const dbPool = new Pool({
      connectionString: dbConnectionString.replace('/postgres', '/studysync'),
    });

    client = await dbPool.connect();
    console.log('✅ Connected to studysync database');

    // Run schema
    const schema = fs.readFileSync('./config/schema.sql', 'utf8');
    await client.query(schema);
    console.log('✅ Schema applied successfully');

    // Check if username column exists
    const colCheck = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'users' AND column_name = 'username'
    `);

    if (colCheck.rows.length === 0) {
      console.log('⚙️  Adding username column...');
      await client.query(`
        ALTER TABLE users ADD COLUMN IF NOT EXISTS username VARCHAR(255) UNIQUE;
        UPDATE users SET username = SPLIT_PART(email, '@', 1) || '_' || SUBSTRING(id::text, 1, 8) WHERE username IS NULL;
        ALTER TABLE users ALTER COLUMN username SET NOT NULL;
        CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
      `);
      console.log('✅ Username column added');
    } else {
      console.log('✅ Username column exists');
    }

    client.release();
    await dbPool.end();

    console.log('\n🎉 Local database setup complete!');
    console.log('\nYour .env should have:');
    console.log(`DATABASE_URL=postgresql://${process.env.USER}@localhost:5432/studysync`);

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    console.error('\nFull error:', error);
    if (client) client.release();
    process.exit(1);
  }
}

setupDatabase();
