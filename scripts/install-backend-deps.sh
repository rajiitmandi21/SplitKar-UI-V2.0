#!/bin/bash

echo "Installing backend dependencies..."
cd backend

# Install dependencies
npm install

echo "✅ Dependencies installed successfully!"
echo "Now run: npm run build && npm start"
