#!/bin/bash

# Deployment script for THE APPRENTICE Bingo
# Usage: ./deploy.sh [environment]
# Example: ./deploy.sh production

set -e

# Default to development if no environment is specified
ENVIRONMENT=${1:-development}
echo "Deploying to $ENVIRONMENT environment..."

# Ensure we're in the project root
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Set environment variables based on deployment target
if [ "$ENVIRONMENT" = "production" ]; then
    export NODE_ENV=production
    export PORT=3000
elif [ "$ENVIRONMENT" = "staging" ]; then
    export NODE_ENV=staging
    export PORT=3001
else
    export NODE_ENV=development
    export PORT=3000
fi

# Install dependencies
echo "Installing dependencies..."
npm install

# Build the application
echo "Building the application..."
npm run build

# Start the application based on environment
if [ "$ENVIRONMENT" = "production" ] || [ "$ENVIRONMENT" = "staging" ]; then
    echo "Starting application in $ENVIRONMENT mode on port $PORT..."
    npm start
else
    # For development, use the development server
    echo "Starting application in development mode on port $PORT..."
    npm run dev
fi 