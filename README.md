# Video Upload Application

A simple web application for uploading and managing video files.

## Features

- 📤 Drag & drop or click to upload videos
- 📊 Real-time upload progress tracking
- 📁 Automatic storage in the `videos/` folder
- 📋 List of all uploaded videos
- 🎨 Beautiful, responsive UI

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. **Option A - Start everything (recommended):**
   ```bash
   chmod +x start-all.sh
   ./start-all.sh
   ```
   This starts both the upload server AND automatic video sync service.

3. **Option B - Start services separately:**
   
   Start upload server:
   ```bash
   npm start
   ```
   
   Start auto-sync service (in another terminal):
   ```bash
   npm run sync
   ```
   
   Or run sync once manually:
   ```bash
   node sync-videos.js
   # OR
   ./sync-videos.sh
   ```

4. Open your browser and navigate to `http://localhost:3000`

## Automatic Video Sync

The system automatically syncs videos from the [Videoswigtube-EEEEEE](https://github.com/Danie-GLR/Videoswigtube-EEEEEE) repository:

- **Source**: `github.com/Danie-GLR/Videoswigtube-EEEEEE/videos/`
- **Destination**: Local `videos/` folder
- **Frequency**: Checks every 5 minutes for new videos
- **Automatic**: Downloads only new videos (skips existing ones)

## Supported Video Formats

- MP4
- AVI
- MOV
- WMV
- FLV
- MKV
- WEBM

## Configuration

- **Max file size**: 500MB (configurable in `server.js`)
- **Upload directory**: `videos/` (created automatically)
- **Port**: 3000 (or set via `PORT` environment variable)
