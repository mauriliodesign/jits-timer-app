#!/bin/bash

# Build script for production
echo "🚀 Building for production..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ Error: .env file not found!"
    echo "Please create a .env file with your Firebase configuration."
    echo "You can copy from env.production.example and fill in your actual values."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the client
echo "🔨 Building client..."
cd client
npm run build
cd ..

# Build the server
echo "🔨 Building server..."
npm run build

echo "✅ Build completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Deploy the dist/ folder to your hosting platform"
echo "2. Set up environment variables in your hosting platform"
echo "3. Configure Firebase Authentication in your Firebase Console"
echo "4. Set up authorized domains in Firebase Console"
echo ""
echo "🌐 Your app will be available at your hosting URL"
