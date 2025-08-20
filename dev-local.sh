#!/bin/bash

echo "🚀 Iniciando JITS Timer em modo desenvolvimento local..."

# Set environment variables for local development
export NODE_ENV=development
export PORT=3000

# Clear any existing Firebase config for local dev
unset VITE_FIREBASE_API_KEY
unset VITE_FIREBASE_PROJECT_ID
unset VITE_FIREBASE_APP_ID

echo "📱 Modo: Desenvolvimento Local (sem Firebase)"
echo "🌐 URL: http://localhost:3000"
echo "📱 Controle Mobile: http://localhost:3000/mobile"
echo "📺 Display TV: http://localhost:3000/tv"

# Start the development server
npm run dev
