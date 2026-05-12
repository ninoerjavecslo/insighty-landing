import { chromium } from 'playwright';
import { execFileSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import os from 'os';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root      = path.resolve(__dirname, '..');
const htmlPath  = path.join(root, 'public/brand/pixel-ai-animation.html');
const outDir    = path.join(root, 'public/brand');
const outWebm   = path.join(outDir, 'pixel-ai-animation.webm');
const outMp4    = path.join(outDir, 'pixel-ai-animation.mp4');

const WIDTH   = 600;
const HEIGHT  = 740;
const TOTAL_MS = 5800; // animation ends ~2.1s, hold until 5.8s total

const FFMPEG = path.join(
  os.homedir(),
  'Library/Caches/ms-playwright/ffmpeg-1011/ffmpeg-mac'
);

console.log('Launching browser…');
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: WIDTH, height: HEIGHT },
  deviceScaleFactor: 2,
  recordVideo: {
    dir: path.join(os.tmpdir(), 'pw-video'),
    size: { width: WIDTH, height: HEIGHT },
  },
});

const page = await context.newPage();
await page.goto(`file://${htmlPath}`);

// Wait for full animation sequence + hold
await page.waitForTimeout(TOTAL_MS);

// Close page to finalise the recording (playwright writes on page close)
const video = page.video();
await page.close();
const videoPath = await video?.path();
await context.close();
await browser.close();

if (!videoPath || !fs.existsSync(videoPath)) {
  console.error('Video not written:', videoPath);
  process.exit(1);
}

fs.copyFileSync(videoPath, outWebm);
console.log('WebM saved →', outWebm);

// Convert to MP4 using playwright's bundled ffmpeg
if (fs.existsSync(FFMPEG)) {
  try {
    execFileSync(FFMPEG, [
      '-y', '-i', outWebm,
      '-c:v', 'libx264', '-crf', '18', '-preset', 'slow',
      '-pix_fmt', 'yuv420p',
      outMp4,
    ], { stdio: 'inherit' });
    console.log('MP4  saved →', outMp4);
  } catch {
    console.warn('ffmpeg conversion failed; use the WebM directly.');
  }
} else {
  console.log('Bundled ffmpeg not found at expected path — WebM only.');
}
