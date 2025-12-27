#!/bin/bash
# Memory-optimized build script for Render

# Set Node.js memory limit
export NODE_OPTIONS="--max-old-space-size=1024"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build Angular app (client-only, no SSR)
echo "🔨 Building Angular application..."
ng build --configuration=client

echo "✅ Build complete!"
echo "📁 Output directory: dist/todo/browser"

