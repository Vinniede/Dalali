#!/bin/bash
set -e

echo "Installing frontend dependencies..."
cd frontend
npm install --production=false
npm run build
cd ..

echo "Build complete!"
