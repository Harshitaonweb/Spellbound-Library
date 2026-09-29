-- Add username column to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS username VARCHAR(255) UNIQUE;

-- Update existing users to have a temporary username based on their email
UPDATE users SET username = SPLIT_PART(email, '@', 1) || '_' || SUBSTRING(id::text, 1, 8) WHERE username IS NULL;

-- Make username NOT NULL after populating
ALTER TABLE users ALTER COLUMN username SET NOT NULL;

-- Add index on username for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
