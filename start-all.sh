#!/bin/bash

# Start both the upload server and video sync service

echo "🚀 Starting Video Upload System..."
echo ""

# Make scripts executable
chmod +x sync-videos.sh

# Start the upload server in background
echo "📤 Starting upload server..."
npm start &
SERVER_PID=$!

# Wait a moment for server to start
sleep 2

# Start the video sync service
echo "🔄 Starting video sync service..."
node sync-videos.js &
SYNC_PID=$!

echo ""
echo "✅ Both services are running!"
echo "   - Upload Server PID: $SERVER_PID"
echo "   - Sync Service PID: $SYNC_PID"
echo ""
echo "Press Ctrl+C to stop both services"

# Wait for both processes
wait
