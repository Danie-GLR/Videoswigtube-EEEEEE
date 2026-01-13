#!/bin/bash

# Start the upload server and wigdosXP sync service with auto-commit

echo "🚀 Starting Video Upload System with Auto-Commit..."
echo ""

# Start the upload server in background
echo "📤 Starting upload server (with auto-commit on upload)..."
node server.js &
SERVER_PID=$!

# Wait a moment for server to start
sleep 2

# Start the wigdosXP sync service
echo "🔄 Starting wigdosXP sync service (with auto-commit on sync)..."
node sync-from-wigdosxp.js &
SYNC_PID=$!

echo ""
echo "✅ Both services are running!"
echo "   - Upload Server PID: $SERVER_PID (http://localhost:3000)"
echo "   - wigdosXP Sync PID: $SYNC_PID (syncs every 5 min)"
echo ""
echo "🔄 Auto-commit is ENABLED for both services"
echo "   - New videos will be automatically committed and pushed to GitHub"
echo ""
echo "Press Ctrl+C to stop both services"

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping services..."
    kill $SERVER_PID $SYNC_PID 2>/dev/null
    echo "✅ Services stopped"
    exit 0
}

trap cleanup INT TERM

# Wait for both processes
wait
