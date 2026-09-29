#!/bin/bash
# Setup local PostgreSQL database for StudySync

echo "🏠 Setting up local PostgreSQL database for StudySync..."

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL is not installed. Please install it first:"
    echo "   macOS: brew install postgresql"
    echo "   Then run: brew services start postgresql"
    exit 1
fi

# Create database
echo "📦 Creating 'studysync' database..."
createdb studysync 2>/dev/null || echo "Database already exists"

# Run schema
echo "⚙️  Running schema migrations..."
psql -d studysync -f config/schema.sql

echo "✅ Local database setup complete!"
echo ""
echo "Update your .env file to use:"
echo "DATABASE_URL=postgresql://localhost:5432/studysync"
echo ""
echo "Then restart your server with: npm run dev"
