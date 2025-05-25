#!/bin/bash

echo "🚀 Setting up SplitKar Frontend..."

# Navigate to frontend directory
cd frontend

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create .env.local if it doesn't exist
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local..."
    cat > .env.local << EOF
NEXT_PUBLIC_API_URL=http://localhost:5001/api
NEXT_PUBLIC_MOCK_DATA_FOR_FRONTEND=true
EOF
fi

echo "✅ Frontend setup complete!"
echo ""
echo "🎯 Next steps:"
echo "1. cd frontend"
echo "2. npm run dev"
echo "3. Open http://localhost:3000"
