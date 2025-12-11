#!/bin/bash

# Video Sync Service - Bash version
# Automatically syncs videos from Videoswigtube-EEEEEE repository

SOURCE_REPO="Danie-GLR/Videoswigtube-EEEEEE"
SOURCE_BRANCH="main"
SOURCE_PATH="videos"
LOCAL_DIR="/workspaces/Toets-Interface/videos"

echo "🔄 Video Sync Service Starting..."
echo "📂 Source: github.com/${SOURCE_REPO}/${SOURCE_PATH}"
echo "📁 Destination: ${LOCAL_DIR}"
echo ""

# Ensure videos directory exists
mkdir -p "$LOCAL_DIR"

# Function to sync videos
sync_videos() {
    echo "🔍 Checking for new videos..."
    
    # Get list of files from GitHub API
    API_URL="https://api.github.com/repos/${SOURCE_REPO}/contents/${SOURCE_PATH}?ref=${SOURCE_BRANCH}"
    
    # Fetch file list
    FILES=$(curl -s "$API_URL" | grep -o '"download_url": "[^"]*"' | cut -d'"' -f4)
    
    if [ -z "$FILES" ]; then
        echo "ℹ️  No videos found in source repository"
        return
    fi
    
    NEW_COUNT=0
    
    # Download each file
    while IFS= read -r URL; do
        if [ -n "$URL" ]; then
            FILENAME=$(basename "$URL")
            LOCAL_FILE="$LOCAL_DIR/$FILENAME"
            
            # Check if file already exists
            if [ -f "$LOCAL_FILE" ]; then
                echo "⏭️  Skipping: $FILENAME (already exists)"
            else
                echo "⬇️  Downloading: $FILENAME"
                if curl -sL "$URL" -o "$LOCAL_FILE"; then
                    echo "✅ Saved: $FILENAME"
                    ((NEW_COUNT++))
                else
                    echo "❌ Failed to download: $FILENAME"
                fi
            fi
        fi
    done <<< "$FILES"
    
    if [ $NEW_COUNT -gt 0 ]; then
        echo ""
        echo "🎉 Downloaded $NEW_COUNT new video(s)!"
    else
        echo ""
        echo "✅ All videos are up to date!"
    fi
}

# Run sync once
sync_videos

# If running in watch mode
if [ "$1" = "--watch" ]; then
    echo ""
    echo "⏰ Watch mode enabled: checking every 5 minutes"
    echo "Press Ctrl+C to stop"
    echo ""
    
    while true; do
        sleep 300  # 5 minutes
        echo ""
        echo "============================================================"
        echo "⏰ Running scheduled sync - $(date)"
        echo "============================================================"
        sync_videos
    done
fi
