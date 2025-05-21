#!/bin/bash

echo "Testing Kord Kraft application..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "Docker is not running. Please start Docker and try again."
    exit 1
fi

# Build and start services
echo "Building and starting services..."
docker-compose up --build -d

# Wait for services to start
echo "Waiting for services to start..."
sleep 10

# Test backend API
echo "Testing backend API..."
curl -s http://localhost:8000/docs > /dev/null
if [ $? -eq 0 ]; then
    echo "✅ Backend API is running"
else
    echo "❌ Backend API is not responding"
fi

# Test frontend
echo "Testing frontend..."
curl -s http://localhost:3000 > /dev/null
if [ $? -eq 0 ]; then
    echo "✅ Frontend is running"
else
    echo "❌ Frontend is not responding"
fi

# Test API endpoint
echo "Testing MIDI generation API..."
curl -X POST http://localhost:8000/generate-midi \
    -H "Content-Type: application/json" \
    -d '{"mood": "Dreamy", "chords": ["Cmaj7", "Am9", "Fmaj7", "G13"]}' \
    -o test.mid

if [ -f "test.mid" ]; then
    echo "✅ MIDI generation API is working"
    rm test.mid
else
    echo "❌ MIDI generation API failed"
fi

# Stop services
echo "Stopping services..."
docker-compose down

echo "Test complete!" 