# Auto-Commit Flow Diagram

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    Wigdos-Inc/wigdosXP                          │
│                  (Source Repository)                            │
│                                                                 │
│  ├── videos/                                                    │
│  └── apps/wigtube/videos/                                       │
└─────────────────────────────────────────────────────────────────┘
                            │
                            │ Every 5 minutes
                            │ (GitHub API)
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│           sync-from-wigdosxp.js (Sync Service)                  │
│                                                                 │
│  1. Fetch video list from GitHub                               │
│  2. Compare with local videos/                                  │
│  3. Download new videos                                         │
│  4. Track downloaded files                                      │
│  5. Git add videos/*.mp4                                        │
│  6. Git commit -m "Auto-sync: Add X videos"                    │
│  7. Git push origin main                                        │
└─────────────────────────────────────────────────────────────────┘
                            │
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│                  videos/ Directory                              │
│              (Local Storage)                                    │
│                                                                 │
│  video1.mp4                                                     │
│  video2.mp4                                                     │
│  video3.mp4                                                     │
│  ...                                                            │
└─────────────────────────────────────────────────────────────────┘
                            │
                            │ Auto-commit triggered
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│              Danie-GLR/Videoswigtube-EEEEEE                     │
│                (This Repository)                                │
│                                                                 │
│  ✅ Committed                                                   │
│  ✅ Pushed                                                      │
│  ✅ Backed up on GitHub                                         │
└─────────────────────────────────────────────────────────────────┘


## Upload Flow (Alternative Path)

```
┌─────────────────────────────────────────────────────────────────┐
│              User / External Application                        │
│                                                                 │
│  - Web Browser (http://localhost:3000)                          │
│  - API Client (curl, fetch, etc)                               │
│  - Mobile App                                                   │
└─────────────────────────────────────────────────────────────────┘
                            │
                            │ POST /upload or /api/upload
                            │ (multipart/form-data)
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│              server.js (Upload Server)                          │
│                                                                 │
│  1. Receive video file                                          │
│  2. Validate file type and size                                 │
│  3. Save to videos/ directory                                   │
│  4. Git add videos/{filename}                                   │
│  5. Git commit -m "Auto-upload: filename"                       │
│  6. Git push origin main                                        │
│  7. Return success response                                     │
└─────────────────────────────────────────────────────────────────┘
                            │
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│                  videos/ Directory                              │
│              (Local Storage)                                    │
└─────────────────────────────────────────────────────────────────┘
                            │
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│              Danie-GLR/Videoswigtube-EEEEEE                     │
│                (This Repository)                                │
│                                                                 │
│  ✅ Committed                                                   │
│  ✅ Pushed                                                      │
│  ✅ Backed up on GitHub                                         │
└─────────────────────────────────────────────────────────────────┘


## Git Operations Detail

### Sync Operation (Batch Commit)
```bash
# Multiple videos downloaded
git add videos/video1.mp4 videos/video2.mp4 videos/video3.mp4

# Single commit for batch
git commit -m "Auto-sync: Add 3 video(s) from wigdosXP

Synced at: 2026-01-13T10:30:00.000Z

Videos added:
  - video1.mp4
  - video2.mp4  
  - video3.mp4"

# Push to GitHub
git push origin main
```

### Upload Operation (Individual Commit)
```bash
# Single video uploaded
git add videos/my-video-1736762400000.mp4

# Individual commit
git commit -m "Auto-upload: my-video.mp4

Uploaded at: 2026-01-13T10:30:00.000Z
Saved as: my-video-1736762400000.mp4"

# Push to GitHub
git push origin main
```

## Process Flow Chart

```
START
  │
  ├─→ [Sync Timer] ──→ Every 5 minutes
  │         │
  │         ↓
  │   Fetch wigdosXP repo
  │         │
  │         ↓
  │   New videos? ──→ NO ──→ Wait 5 min
  │         │
  │         YES
  │         ↓
  │   Download videos
  │         │
  │         ↓
  │   Git add + commit + push
  │         │
  │         ↓
  │   Success! ✅
  │
  ├─→ [Upload Request] ──→ User uploads video
  │         │
  │         ↓
  │   Validate file
  │         │
  │         ↓
  │   Save to videos/
  │         │
  │         ↓
  │   Git add + commit + push
  │         │
  │         ↓
  │   Return response ✅
  │
  └─→ [Continue monitoring...]
```

## Error Handling

```
Operation Start
     │
     ↓
Try: Git Operations
     │
     ├─→ SUCCESS ──→ Log success ✅
     │                 Continue
     │
     └─→ FAILURE ──→ Log error ⚠️
                      Video still saved locally
                      Continue (don't crash)
```

## Benefits of This Architecture

1. **🔄 Redundancy**: Videos stored both locally and on GitHub
2. **📝 History**: Full audit trail of all changes
3. **🔙 Rollback**: Easy to revert if needed
4. **🌐 Accessibility**: Videos accessible via GitHub
5. **🤝 Collaboration**: Team can track changes
6. **🛡️ Backup**: Automatic cloud backup
7. **⚡ Automatic**: No manual intervention
8. **📊 Monitoring**: Clear logs and feedback

## Monitoring Commands

### Watch sync service logs
```bash
node sync-from-wigdosxp.js
```

### Watch server logs
```bash
node server.js
```

### Check git status
```bash
git status
git log --oneline -10
```

### View recent commits
```bash
git log --graph --oneline --all -10
```

## Configuration Files

| File | Purpose |
|------|---------|
| `sync-from-wigdosxp.js` | Sync service with auto-commit |
| `server.js` | Upload server with auto-commit |
| `start-all.sh` | Start both services |
| `test-setup.sh` | Verify configuration |
| `AUTO_COMMIT_SETUP.md` | Detailed documentation |
| `IMPLEMENTATION_SUMMARY.md` | What was implemented |

---

**Last Updated**: January 2026  
**Status**: ✅ Active and Working
