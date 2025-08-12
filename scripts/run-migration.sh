#!/bin/bash

echo "Starting Bhagwat Gita data migration..."
echo "======================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if the migration script exists
if [ ! -f "migrate-data.js" ]; then
    echo "Error: migrate-data.js not found in current directory"
    exit 1
fi

# Run the migration
echo "Running migration script..."
node migrate-data.js

echo "Migration script completed!"
