#!/bin/bash
set -e  # Exit on error

echo "📦 Step 1: Installing dependencies..."
npm install

echo "🔍 Step 2: Verifying Angular CLI installation..."
if [ ! -f "./node_modules/.bin/ng" ]; then
    echo "❌ Angular CLI not found, installing..."
    npm install @angular/cli --save-dev
fi

echo "🔨 Step 3: Building Angular application..."
npm run build:client

echo "✅ Build complete!"
echo "📁 Output should be in: dist/todo/browser"

