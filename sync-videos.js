#!/usr/bin/env node

const https = require('https');
const fs = require('fs');
const path = require('path');

// Configuration
const SOURCE_REPO = 'Danie-GLR/Videoswigtube-EEEEEE';
const SOURCE_BRANCH = 'main';
const SOURCE_PATH = 'videos';
const LOCAL_VIDEOS_DIR = path.join(__dirname, 'videos');

// GitHub API endpoint
const GITHUB_API = `https://api.github.com/repos/${SOURCE_REPO}/contents/${SOURCE_PATH}?ref=${SOURCE_BRANCH}`;

console.log('🔄 Video Sync Service Starting...');
console.log(`📂 Source: github.com/${SOURCE_REPO}/${SOURCE_PATH}`);
console.log(`📁 Destination: ${LOCAL_VIDEOS_DIR}\n`);

/**
 * Fetch JSON from URL
 */
function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: {
        'User-Agent': 'Video-Sync-Service'
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

/**
 * Download file from URL
 */
function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (res) => {
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

/**
 * Get list of video files from GitHub repository
 */
async function getRemoteVideos() {
  try {
    const contents = await fetchJSON(GITHUB_API);
    
    if (!Array.isArray(contents)) {
      console.log('⚠️  No videos folder found in source repository');
      return [];
    }
    
    // Filter for video files
    const videoExtensions = ['.mp4', '.avi', '.mov', '.wmv', '.flv', '.mkv', '.webm'];
    const videos = contents.filter(item => 
      item.type === 'file' && 
      videoExtensions.some(ext => item.name.toLowerCase().endsWith(ext))
    );
    
    return videos;
  } catch (error) {
    console.error('❌ Error fetching remote videos:', error.message);
    return [];
  }
}

/**
 * Get list of local video files
 */
function getLocalVideos() {
  try {
    if (!fs.existsSync(LOCAL_VIDEOS_DIR)) {
      fs.mkdirSync(LOCAL_VIDEOS_DIR, { recursive: true });
      return [];
    }
    return fs.readdirSync(LOCAL_VIDEOS_DIR);
  } catch (error) {
    console.error('❌ Error reading local videos:', error.message);
    return [];
  }
}

/**
 * Sync videos from GitHub to local folder
 */
async function syncVideos() {
  console.log('🔍 Checking for new videos...');
  
  const remoteVideos = await getRemoteVideos();
  const localVideos = getLocalVideos();
  
  if (remoteVideos.length === 0) {
    console.log('ℹ️  No videos found in source repository\n');
    return;
  }
  
  console.log(`📊 Found ${remoteVideos.length} video(s) in source repository`);
  console.log(`📊 Found ${localVideos.length} video(s) in local folder\n`);
  
  let newCount = 0;
  
  for (const video of remoteVideos) {
    const localPath = path.join(LOCAL_VIDEOS_DIR, video.name);
    
    if (!localVideos.includes(video.name)) {
      try {
        console.log(`⬇️  Downloading: ${video.name} (${(video.size / (1024 * 1024)).toFixed(2)} MB)`);
        await downloadFile(video.download_url, localPath);
        console.log(`✅ Saved: ${video.name}\n`);
        newCount++;
      } catch (error) {
        console.error(`❌ Failed to download ${video.name}:`, error.message, '\n');
      }
    } else {
      console.log(`⏭️  Skipping: ${video.name} (already exists)`);
    }
  }
  
  if (newCount > 0) {
    console.log(`\n🎉 Downloaded ${newCount} new video(s)!`);
  } else {
    console.log('\n✅ All videos are up to date!');
  }
}

/**
 * Main function
 */
async function main() {
  // Run sync immediately
  await syncVideos();
  
  // Set up periodic sync (every 5 minutes)
  const SYNC_INTERVAL = 5 * 60 * 1000; // 5 minutes
  
  console.log(`\n⏰ Auto-sync enabled: checking every ${SYNC_INTERVAL / 60000} minutes`);
  console.log('Press Ctrl+C to stop\n');
  
  setInterval(async () => {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`⏰ Running scheduled sync - ${new Date().toLocaleString()}`);
    console.log('='.repeat(60));
    await syncVideos();
  }, SYNC_INTERVAL);
}

// Run the sync service
main().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
