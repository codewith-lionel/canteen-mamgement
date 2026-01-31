#!/bin/bash

# Smart College Canteen Management System - Setup Script

echo "=================================================="
echo "Smart College Canteen Management System - Setup"
echo "=================================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v18 or higher."
    exit 1
fi

echo "✓ Node.js version: $(node --version)"

# Check if MongoDB is installed
if ! command -v mongod &> /dev/null; then
    echo "⚠️  MongoDB is not installed. Please install MongoDB v6 or higher."
    echo "   You can continue, but you'll need to install MongoDB later."
else
    echo "✓ MongoDB is installed"
fi

echo ""
echo "Installing dependencies..."
echo ""

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install backend dependencies"
    exit 1
fi

echo "✓ Backend dependencies installed"
echo ""

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd ../frontend
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install frontend dependencies"
    exit 1
fi

echo "✓ Frontend dependencies installed"
echo ""

# Seed database
echo "🌱 Seeding database with sample data..."
cd ../backend

# Check if MongoDB is running
if command -v mongod &> /dev/null; then
    # Try to seed the database
    npm run seed
    
    if [ $? -eq 0 ]; then
        echo "✓ Database seeded successfully"
    else
        echo "⚠️  Database seeding failed. Please make sure MongoDB is running."
        echo "   You can run 'cd backend && npm run seed' manually later."
    fi
else
    echo "⚠️  Skipping database seeding (MongoDB not found)"
fi

echo ""
echo "=================================================="
echo "✅ Setup Complete!"
echo "=================================================="
echo ""
echo "Default Credentials:"
echo "  Admin    - Username: admin    Password: admin123"
echo "  Kitchen  - Username: kitchen  Password: kitchen123"
echo ""
echo "To start the application:"
echo ""
echo "1. Start Backend Server:"
echo "   cd backend"
echo "   npm start"
echo "   (Server will run on http://localhost:5000)"
echo ""
echo "2. Start Frontend Application (in a new terminal):"
echo "   cd frontend"
echo "   npm run dev"
echo "   (App will run on http://localhost:5173)"
echo ""
echo "3. Open http://localhost:5173 in your browser"
echo ""
echo "=================================================="
