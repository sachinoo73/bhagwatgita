#!/bin/bash

echo "🚀 Starting Bhagwat Gita Backend Application..."
echo "================================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if MongoDB is running
echo "🔍 Checking MongoDB connection..."
if ! curl -s http://localhost:27017 > /dev/null 2>&1; then
    echo "⚠️  MongoDB doesn't seem to be running on localhost:27017"
    echo "   Please start MongoDB first:"
    echo "   - On macOS: brew services start mongodb-community"
    echo "   - On Ubuntu: sudo systemctl start mongod"
    echo "   - On Windows: net start MongoDB"
    echo ""
    echo "   Or start manually: mongod"
    echo ""
    read -p "Press Enter to continue anyway, or Ctrl+C to exit..."
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Check if database needs seeding
echo "🌱 Checking if database needs seeding..."
if curl -s http://localhost:3000/api/verses > /dev/null 2>&1; then
    echo "✅ Database already has data"
else
    echo "📚 Seeding database with sample verses..."
    npm run seed
fi

# Start the application
echo "🚀 Starting the server..."
echo "   Health check: http://localhost:3000/health"
echo "   API base: http://localhost:3000/api"
echo "   Press Ctrl+C to stop the server"
echo ""

npm run dev
