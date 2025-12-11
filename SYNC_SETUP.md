# Automatic Video Sync Setup

## How It Works

This repository automatically syncs videos from the **Videoswigtube-EEEEEE** repository.

### Current Status

✅ **Auto-sync service is running**  
✅ **Checking every 5 minutes for new videos**  
✅ **Server is ready to receive uploads**

---

## To Add Videos Automatically

### Method 1: Upload to Videoswigtube-EEEEEE Repository

1. Go to your [Videoswigtube-EEEEEE repository](https://github.com/Danie-GLR/Videoswigtube-EEEEEE)
2. Create a `videos/` folder
3. Upload video files to that folder
4. **Within 5 minutes**, the videos will automatically appear in this repository's `videos/` folder!

### Method 2: Use the Upload Interface (This Repository)

1. Open the web interface: http://localhost:3000 (or your Codespace URL)
2. Upload videos via the web form
3. Videos are saved directly to the `videos/` folder here

### Method 3: Use API Upload (From External Apps)

Send videos programmatically from any application:

```javascript
const formData = new FormData();
formData.append('video', videoFile);

fetch('https://your-codespace-url/api/upload', {
    method: 'POST',
    body: formData
});
```

---

## Setting Up Videoswigtube-EEEEEE to Push Videos Here

If you want videos uploaded to **Videoswigtube-EEEEEE** to automatically forward to **this** repository:

### Option A: GitHub Actions (Recommended)

Add this workflow to Videoswigtube-EEEEEE repository:

Create `.github/workflows/sync-videos.yml`:

```yaml
name: Sync Videos to Toets-Interface

on:
  push:
    paths:
      - 'videos/**'
  workflow_dispatch:

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Sync videos to Toets-Interface
        run: |
          for video in videos/*; do
            if [ -f "$video" ]; then
              echo "Uploading $(basename $video)..."
              curl -X POST "https://your-codespace-url/api/upload" \
                -F "video=@$video"
            fi
          done
```

### Option B: Run Auto-Sync Service

The sync service is already running! Just:

1. Add videos to Videoswigtube-EEEEEE/videos/ folder
2. Commit and push
3. Wait 5 minutes (or restart sync service for immediate sync)

---

## Running the Services

### Start Everything:
```bash
./start-all.sh
```

### Start Individual Services:

**Upload Server:**
```bash
npm start
```

**Auto-Sync Service:**
```bash
npm run sync
```

**Manual Sync (Run Once):**
```bash
node sync-videos.js
# or
./sync-videos.sh
```

---

## Architecture

```
┌─────────────────────────────────────┐
│  Videoswigtube-EEEEEE Repository   │
│         (Source Videos)              │
│     github.com/.../videos/           │
└──────────────┬──────────────────────┘
               │
               │ Auto-Sync (Every 5 min)
               ↓
┌──────────────────────────────────────┐
│   Toets-Interface Repository         │
│    (This Repository)                  │
│                                       │
│  ┌────────────────────────────────┐  │
│  │  Upload Server (Port 3000)     │  │
│  │  - Web Interface               │  │
│  │  - API Endpoints               │  │
│  └────────────────────────────────┘  │
│              ↓                        │
│  ┌────────────────────────────────┐  │
│  │     videos/ folder             │  │
│  │  (All videos stored here)      │  │
│  └────────────────────────────────┘  │
└──────────────────────────────────────┘
```

---

## Troubleshooting

### Videos not syncing?

1. Check if videos exist in Videoswigtube-EEEEEE/videos/ folder
2. Restart sync service: `npm run sync`
3. Check sync service logs
4. Manually trigger sync: `node sync-videos.js`

### Can't upload?

1. Check if server is running: `npm start`
2. Check file size (max 500MB)
3. Check file format (must be video)
4. Check CORS settings in server.js

### Want immediate sync?

Restart the sync service to trigger immediate check:
```bash
pkill -f "node sync-videos"
npm run sync
```
