#!/usr/bin/env node
/**
 * Automatic Video Sync Service
 * Syncs videos from Wigdos-Inc/wigdosXP repository to local videos folder
 * Automatically commits and pushes new videos to this repository
 */

const https = require('https');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const REPO_OWNER = 'Wigdos-Inc';
const REPO_NAME = 'wigdosXP';
const VIDEO_PATHS = ['videos', 'apps/wigtube/videos'];
const LOCAL_VIDEOS_DIR = path.join(__dirname, 'videos');
const SYNC_INTERVAL = 5 * 60 * 1000; // 5 minutes

// Ensure videos directory exists
if (!fs.existsSync(LOCAL_VIDEOS_DIR)) {
  fs.mkdirSync(LOCAL_VIDEOS_DIR, { recursive: true });
}

/**
 * Fetch directory contents from GitHub
 */
function fetchGitHubDirectory(dirPath) {
  return new Promise((resolve, reject) => {
    const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${dirPath}`;
    
    https.get(url, {
      headers: {
        'User-Agent': 'Node.js Video Sync'
      }
    }, (res) => {
      let data = '';
      
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          resolve(JSON.parse(data));
        } else if (res.statusCode === 404) {
          resolve([]); // Directory doesn't exist
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        }
      });
    }).on('error', reject);
  });
}

/**
 * Download a file from URL
 */
function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destPath);
    
    https.get(url, (res) => {
      res.pipe(file);
      
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(destPath, () => {});
      reject(err);
    });
  });
}

/**
 * Check if file is a video
 */
function isVideoFile(filename) {
  return /\.(mp4|avi|mov|wmv|flv|mkv|webm)$/i.test(filename);
}

/**
 * Execute git command
 */
function executeGitCommand(command, description) {
  try {
    console.log(`   🔧 ${description}...`);
    const output = execSync(command, { 
      cwd: __dirname,
      encoding: 'utf-8',
      stdio: 'pipe'
    });
    if (output && output.trim()) {
      console.log(`      ${output.trim()}`);
    }
    return true;
  } catch (error) {
    console.error(`   ❌ Git error: ${error.message}`);
    return false;
  }
}

/**
 * Commit and push new videos to repository
 */
async function commitAndPushVideos(newVideos) {
  if (newVideos.length === 0) {
    return;
  }

  console.log(`\n📤 Auto-committing ${newVideos.length} new video(s)...`);
  
  try {
    // Add all new videos
    for (const video of newVideos) {
      const videoPath = path.join('videos', video);
      executeGitCommand(`git add "${videoPath}"`, `Adding ${video}`);
    }
    
    // Create commit message
    const timestamp = new Date().toISOString();
    const videoList = newVideos.map(v => `  - ${v}`).join('\n');
    const commitMessage = `Auto-sync: Add ${newVideos.length} video(s) from wigdosXP\n\nSynced at: ${timestamp}\n\nVideos added:\n${videoList}`;
    
    // Commit
    const commitSuccess = executeGitCommand(
      `git commit -m "${commitMessage.replace(/"/g, '\\"')}"`,
      'Creating commit'
    );
    
    if (commitSuccess) {
      // Push to remote
      const pushSuccess = executeGitCommand(
        'git push origin main',
        'Pushing to remote repository'
      );
      
      if (pushSuccess) {
        console.log(`   ✅ Successfully pushed ${newVideos.length} video(s) to repository!`);
      }
    }
  } catch (error) {
    console.error(`   ❌ Error during git operations:`, error.message);
  }
}

/**
 * Sync videos from GitHub repository
 */
async function syncVideos() {
  console.log(`\n🔄 [${new Date().toLocaleTimeString()}] Starting sync from ${REPO_OWNER}/${REPO_NAME}...`);
  
  let totalDownloaded = 0;
  let totalSkipped = 0;
  const newVideos = []; // Track newly downloaded videos
  
  for (const videoPath of VIDEO_PATHS) {
    try {
      console.log(`📂 Checking ${videoPath}...`);
      const files = await fetchGitHubDirectory(videoPath);
      
      if (!Array.isArray(files)) {
        console.log(`   ⚠️  Not a valid directory`);
        continue;
      }
      
      const videoFiles = files.filter(file => file.type === 'file' && isVideoFile(file.name));
      
      if (videoFiles.length === 0) {
        console.log(`   ℹ️  No videos found`);
        continue;
      }
      
      console.log(`   Found ${videoFiles.length} video(s)`);
      
      for (const file of videoFiles) {
        const localPath = path.join(LOCAL_VIDEOS_DIR, file.name);
        
        // Check if file already exists
        if (fs.existsSync(localPath)) {
          const stats = fs.statSync(localPath);
          if (stats.size === file.size) {
            console.log(`   ⏭️  Skipped: ${file.name} (already exists)`);
            totalSkipped++;
            continue;
          }
        }
        
        try {
          console.log(`   📥 Downloading: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`);
          await downloadFile(file.download_url, localPath);
          console.log(`   ✅ Downloaded: ${file.name}`);
          totalDownloaded++;
          newVideos.push(file.name); // Track for git commit
        } catch (err) {
          console.error(`   ❌ Failed to download ${file.name}:`, err.message);
        }
      }
    } catch (err) {
      console.error(`   ❌ Error checking ${videoPath}:`, err.message);
    }
  }
  
  console.log(`\n📊 Sync complete: ${totalDownloaded} downloaded, ${totalSkipped} skipped`);
  console.log(`📁 Videos location: ${LOCAL_VIDEOS_DIR}`);
  
  // Automatically commit and push new videos
  if (newVideos.length > 0) {
    await commitAndPushVideos(newVideos);
  }
}

/**
 * Start sync service
 */
async function startSyncService() {
  console.log('🚀 Video Sync Service Started');
  console.log(`📡 Syncing from: ${REPO_OWNER}/${REPO_NAME}`);
  console.log(`📁 Local directory: ${LOCAL_VIDEOS_DIR}`);
  console.log(`⏱️  Sync interval: ${SYNC_INTERVAL / 1000 / 60} minutes`);
  console.log(`🔄 Auto-commit: ENABLED - Videos will be automatically committed and pushed\n`);
  
  // Initial sync
  await syncVideos();
  
  // Schedule periodic sync
  setInterval(syncVideos, SYNC_INTERVAL);
}

// Handle errors
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled error:', err);
});

// Start the service
startSyncService();
