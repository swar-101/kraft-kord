#!/bin/bash

# Create frontend directory structure
mkdir -p frontend/src
mkdir -p frontend/public

# Move frontend files
mv src/* frontend/src/
mv public/* frontend/public/
mv package.json frontend/
mv package-lock.json frontend/

# Clean up old directories
rm -rf src
rm -rf public
rm -rf node_modules

echo "Files moved successfully!"
echo "New structure:"
echo "├── frontend/"
echo "│   ├── src/"
echo "│   ├── public/"
echo "│   ├── Dockerfile"
echo "│   └── nginx.conf"
echo "├── backend/"
echo "│   ├── main.py"
echo "│   ├── requirements.txt"
echo "│   └── Dockerfile"
echo "└── docker-compose.yml" 