#!/usr/bin/env bash
# Render build script for NestJS backend

set -e

echo "📦 Installing dependencies..."
npm install

echo "🔨 Building application..."
npm run build

echo "🗄️  Generating Prisma Client..."
npx prisma generate

echo "✅ Build completed successfully!"
