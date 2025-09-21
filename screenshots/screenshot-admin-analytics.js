// Usage: node screenshots/screenshot-admin-analytics.js
// Make sure you have puppeteer installed: npm install puppeteer
// This script will only screenshot the admin analytics page

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:8080';
const SCREENSHOTS_DIR = path.join(__dirname);
const route = '/admin/analytics';

(async () => {
  if (!fs.existsSync(SCREENSHOTS_DIR)) {
    fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
  }
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  page.setViewport({ width: 1440, height: 900 });

  const url = BASE_URL + route;
  try {
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 20000 });
    await new Promise(res => setTimeout(res, 1500));
    const filePath = path.join(SCREENSHOTS_DIR, 'admin_analytics.png');
    await page.screenshot({ path: filePath, fullPage: true });
    console.log(`✅ Screenshot saved: ${filePath}`);
  } catch (err) {
    console.error(`❌ Failed to screenshot ${url}:`, err.message);
  }
  await browser.close();
})();
