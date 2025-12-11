# Setup Instructions for wigdosXP Repository

Follow these steps to enable automatic video uploads from the Wigdos-Inc/wigdosXP repository to this server:

## Step 1: Add the GitHub Action to wigdosXP

1. Go to your [wigdosXP repository](https://github.com/Wigdos-Inc/wigdosXP)

2. Create this file: `.github/workflows/auto-upload-videos.yml`

3. Copy the contents from: `/workspaces/Toets-Interface/.github/workflows/auto-upload-videos.yml`

4. Commit and push the file

## Step 2: Configure the Upload Server URL (Optional)

If you want to customize the server URL:

1. Go to your [wigdosXP repository settings](https://github.com/Wigdos-Inc/wigdosXP/settings/secrets/actions)

2. Click "New repository secret"

3. Name: `UPLOAD_SERVER_URL`

4. Value: Your server URL (e.g., `https://cuddly-dollop-pjpjr7x7j9qxf9p7q.github.dev/api/upload`)

5. Click "Add secret"

**Note:** If you don't set this secret, it will use the default URL in the workflow file.

## Step 3: How It Works

Once set up, whenever you:

1. Add a video file to the `videos/` or `apps/wigtube/videos/` folder in wigdosXP
2. Commit and push the changes
3. **GitHub Actions automatically triggers**
4. The workflow uploads the video to this server
5. Video appears in the `videos/` folder here **automatically**!

## Supported Video Formats

- MP4, AVI, MOV, WMV, FLV, MKV, WEBM

## Testing

1. Add a video file to wigdosXP: `videos/test.mp4` or `apps/wigtube/videos/test.mp4`
2. Commit: `git add videos/test.mp4`
3. Push: `git push`
4. Check the "Actions" tab in GitHub to see the workflow running
5. The video will automatically appear in this repository's `videos/` folder!  

## Monitoring

- View workflow runs: [wigdosXP Actions](https://github.com/Wigdos-Inc/wigdosXP/actions)
- Check upload logs in the workflow output
- Videos appear in this server's `videos/` folder within seconds!

## Troubleshooting

If videos don't upload automatically:

1. Check the Actions tab for error messages
2. Verify the server URL is correct
3. Ensure the server is running
4. Check that the video file is in the correct format
5. Verify GitHub Actions is enabled in your repository settings
