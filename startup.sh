#!/bin/bash

# AI Travel Planner Startup Script
echo "🚀 Starting AI Travel Planner..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Create .env.local if it doesn't exist
if [ ! -f ".env.local" ]; then
    echo "🔧 Creating .env.local file..."
    cp .env.local.example .env.local
    echo "⚠️  Please update .env.local with your actual API keys and database URL"
fi

# Function to kill background processes on exit
cleanup() {
    echo "🛑 Stopping servers..."
    kill $SOCKET_PID 2>/dev/null
    kill $NEXT_PID 2>/dev/null
    exit 0
}

# Set up trap to call cleanup function on script exit
trap cleanup SIGINT SIGTERM

# Start Socket.IO server in background
echo "🔌 Starting Socket.IO server on port 3001..."
node server.js &
SOCKET_PID=$!

# Wait a moment for Socket.IO server to start
sleep 2

# Start Next.js development server
echo "🌐 Starting Next.js app on port 3000..."
npm run dev &
NEXT_PID=$!

# Display startup information
echo ""
echo "✅ AI Travel Planner is now running!"
echo ""
echo "🌐 Frontend: http://localhost:3000"
echo "🔌 Socket.IO: http://localhost:3001"
echo ""
echo "📋 Make sure to:"
echo "   1. Update your .env.local file with API keys"
echo "   2. Start your MongoDB instance"
echo "   3. Configure Clerk authentication"
echo ""
echo "Press Ctrl+C to stop all servers"
echo ""

# Wait for both processes
wait $SOCKET_PID $NEXT_PID