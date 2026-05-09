#!/bin/bash
set -e

echo "Installing root dependencies..."
npm install --production=false

echo "Compiling backend TypeScript..."
npm run build:server

echo "Installing frontend dependencies..."
cd frontend
npm install --production=false
npm run build
cd ..

echo "Build complete!"
