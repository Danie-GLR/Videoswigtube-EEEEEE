# Auto-Commit & Push Setup

## Overview

This repository is configured to **automatically commit and push videos** whenever they are:

1. 🔄 **Synced from Wigdos-Inc/wigdosXP** - via `sync-from-wigdosxp.js`
2. 📤 **Uploaded via API** - via `/upload` or `/api/upload` endpoints
3. 🌐 **Uploaded via web interface** - via the browser UI

---

## How It Works

### 1. Automatic Sync from wigdosXP Repository

The `sync-from-wigdosxp.js` service:
- ✅ Checks `Wigdos-Inc/wigdosXP` repository every **5 minutes**
- ✅ Downloads new videos from:
  - `videos/` directory
  - `apps/wigtube/videos/` directory
- ✅ **Automatically commits and pushes** each batch of new videos

**Commit Message Format:**
```
Auto-sync: Add X video(s) from wigdosXP

Synced at: 2026-01-13T10:30:00.000Z

Videos added:
  - video1.mp4
  - video2.mp4
```

### 2. Automatic Upload Commits

When videos are uploaded via the web interface or API:
- ✅ Video is saved to `videos/` directory
- ✅ **Automatically committed** with descriptive message
- ✅ **Automatically pushed** to remote repository

**Commit Message Format:**
```
Auto-upload: my-video.mp4

Uploaded at: 2026-01-13T10:30:00.000Z
Saved as: my-video-1736762400000-123456789.mp4
```

---

## Running the Services

### Start Everything at Once

```bash
./start-all.sh
```

This starts:
- 🌐 Web server (port 3000)
- 🔄 Auto-sync service from wigdosXP

### Start Services Individually

**Web Server with Auto-Commit:**
```bash
node server.js
```

**Auto-Sync Service from wigdosXP:**
```bash
node sync-from-wigdosxp.js
```

---

## Git Configuration

### First Time Setup

Ensure git is configured with your identity:

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### Authentication

For GitHub authentication, you may need to:

**Option 1: Personal Access Token (Recommended for Codespaces)**
```bash
git config --global credential.helper store
git push  # Enter your GitHub username and Personal Access Token
```

**Option 2: SSH Keys**
```bash
ssh-keygen -t ed25519 -C "your.email@example.com"
# Add the public key to your GitHub account
```

---

## Monitoring

### Watch Sync Service Logs

```bash
node sync-from-wigdosxp.js
```

You'll see output like:
```
🚀 Video Sync Service Started
📡 Syncing from: Wigdos-Inc/wigdosXP
📁 Local directory: /workspaces/Videoswigtube-EEEEEE/videos
⏱️  Sync interval: 5 minutes
🔄 Auto-commit: ENABLED - Videos will be automatically committed and pushed

🔄 [10:30:00 AM] Starting sync from Wigdos-Inc/wigdosXP...
📂 Checking videos...
   Found 2 video(s)
   📥 Downloading: video1.mp4 (15.32 MB)
   ✅ Downloaded: video1.mp4
   
📊 Sync complete: 1 downloaded, 1 skipped
📁 Videos location: /workspaces/Videoswigtube-EEEEEE/videos

📤 Auto-committing 1 new video(s)...
   🔧 Adding video1.mp4...
   🔧 Creating commit...
   🔧 Pushing to remote repository...
   ✅ Successfully pushed 1 video(s) to repository!
```

### Watch Server Logs

```bash
node server.js
```

You'll see:
```
✨ Video Upload Server Running
📍 Local: http://localhost:3000

✅ Video uploaded: my-video-1736762400000.mp4 (25.50 MB)
   🚀 Pushed to repository: my-video-1736762400000.mp4
```

---

## Disabling Auto-Commit (Optional)

If you want to disable automatic commits:

### For Sync Service

Edit `sync-from-wigdosxp.js` and comment out:

```javascript
// Automatically commit and push new videos
// if (newVideos.length > 0) {
//   await commitAndPushVideos(newVideos);
// }
```

### For Upload Server

Edit `server.js` and comment out:

```javascript
// Auto-commit and push to repository
// const pushed = commitAndPushVideo(req.file.filename, req.file.originalname);
```

---

## Troubleshooting

### Git Push Fails

**Error:** `Permission denied` or `Authentication failed`

**Solution:** Configure git credentials (see Git Configuration section above)

### Divergent Branches

**Error:** `fatal: Need to specify how to reconcile divergent branches`

**Solution:**
```bash
git config pull.rebase false  # Use merge strategy
git pull origin main
```

### Service Not Running

Check if the service is running:
```bash
ps aux | grep node
```

Kill existing processes:
```bash
pkill -f "node.*sync-from-wigdosxp"
pkill -f "node.*server"
```

Restart:
```bash
./start-all.sh
```

---

## API Usage

### Upload Video with Auto-Commit

```bash
curl -X POST http://localhost:3000/upload \
  -F "video=@/path/to/video.mp4"
```

Response:
```json
{
  "message": "Video uploaded successfully!",
  "filename": "video-1736762400000-123456789.mp4",
  "originalName": "video.mp4",
  "size": 26738900,
  "savedTo": "videos/video-1736762400000-123456789.mp4",
  "pushedToGit": true
}
```

---

## Features Summary

✅ **Automatic sync** from Wigdos-Inc/wigdosXP every 5 minutes  
✅ **Automatic commit** when new videos are synced  
✅ **Automatic push** to GitHub repository  
✅ **Automatic commit** when videos are uploaded via API/web  
✅ **Descriptive commit messages** with timestamps and file info  
✅ **Multi-video batch commits** (syncs multiple videos in one commit)  
✅ **Individual commits** for uploads (one commit per upload)  
✅ **Error handling** with fallback if git push fails  

---

## Configuration

### Change Sync Interval

Edit `sync-from-wigdosxp.js`:

```javascript
const SYNC_INTERVAL = 5 * 60 * 1000; // 5 minutes
// Change to:
const SYNC_INTERVAL = 10 * 60 * 1000; // 10 minutes
```

### Change Source Repository

Edit `sync-from-wigdosxp.js`:

```javascript
const REPO_OWNER = 'Wigdos-Inc';
const REPO_NAME = 'wigdosXP';
const VIDEO_PATHS = ['videos', 'apps/wigtube/videos'];
```

---

## Questions?

- 📖 See [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for API details
- 🔧 See [SYNC_SETUP.md](SYNC_SETUP.md) for general sync setup
- 📝 See [README.md](README.md) for project overview
