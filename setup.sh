#!/bin/bash

echo "🚀 Setting up Retail All-in-One Monorepo..."

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Install dependencies for all workspaces
echo "📦 Installing workspace dependencies..."
npm install --workspaces

# Build shared packages
echo "🔨 Building shared packages..."
cd packages/shared && npm run build && cd ../..
cd packages/ui && npm run build && cd ../..

echo "✅ Setup complete! You can now run:"
echo "   docker compose up --build"
echo ""
echo "🌐 Access your applications at:"
echo "   Main Dashboard: http://localhost:3000"
echo "   Garment App:    http://localhost:3001" 
echo "   Pharmacy App:   http://localhost:3002"
