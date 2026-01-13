# Video Upload Application

A simple web application for uploading and managing video files with **automatic Git commit and push** functionality.

## Features

- 📤 Drag & drop or click to upload videos
- 📊 Real-time upload progress tracking
- 📁 Automatic storage in the `videos/` folder
- 📋 List of all uploaded videos
- 🎨 Beautiful, responsive UI
- 🔄 **Auto-sync from Wigdos-Inc/wigdosXP repository**
- 🚀 **Automatic Git commit & push on new videos**

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. **Configure Git (First Time Only):**
   ```bash
   git config --global user.name "Your Name"
   git config --global user.email "your.email@example.com"
   ```

3. **Start everything:**
   ```bash
   chmod +x start-all.sh
   ./start-all.sh
   ```
   This starts:
   - 🌐 Upload server (http://localhost:3000)
   - 🔄 Auto-sync from wigdosXP (every 5 minutes)
   - 🚀 Auto-commit & push (enabled for both)

4. Open your browser and navigate to `http://localhost:3000`

## Automatic Video Sync & Commit

### 🔄 Sync from wigdosXP Repository

The system automatically syncs videos from [Wigdos-Inc/wigdosXP](https://github.com/Wigdos-Inc/wigdosXP):

- **Source**: `Wigdos-Inc/wigdosXP` → `videos/` and `apps/wigtube/videos/`
- **Destination**: Local `videos/` folder
- **Frequency**: Checks every 5 minutes for new videos
- **Automatic**: Downloads only new videos (skips existing ones)
- **🚀 Auto-Commit**: Automatically commits and pushes new videos to this repository

### 🚀 Auto-Commit Feature

Every time a video is added (via sync or upload):
- ✅ Automatically committed to Git
- ✅ Automatically pushed to GitHub
- ✅ Descriptive commit messages with timestamps
- ✅ Batch commits for synced videos
- ✅ Individual commits for manual uploads

**See [AUTO_COMMIT_SETUP.md](AUTO_COMMIT_SETUP.md) for detailed documentation.**

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
