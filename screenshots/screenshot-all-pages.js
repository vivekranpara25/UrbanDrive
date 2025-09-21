// Usage: node screenshots/screenshot-all-pages.js
// Make sure you have puppeteer installed: npm install puppeteer
// Update BASE_URL if your app runs on a different port

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:8080';
const SCREENSHOTS_DIR = path.join(__dirname);

// List of routes/pages to screenshot (add/remove as needed)
const routes = [
  '/',
  '/login',
  '/register',
  '/dashboard',
  '/cars',
  '/bookcar',
  '/contact',
  '/about',
  '/admin',
  '/admin/cars',
  '/admin/bookings',
  '/admin/users',
  '/admin/analytics',
  // Add more routes if needed
];

(async () => {
  if (!fs.existsSync(SCREENSHOTS_DIR)) {
    fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
  }
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  page.setViewport({ width: 1440, height: 900 });

  for (const route of routes) {
    const url = BASE_URL + route;
    try {
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 20000 });
      // Wait for main content to load (customize selector if needed)
      await new Promise(res => setTimeout(res, 1500));
      const safeRoute = route === '/' ? 'home' : route.replace(/\//g, '_').replace(/^_/, '');
      const filePath = path.join(SCREENSHOTS_DIR, `${safeRoute}.png`);
      await page.screenshot({ path: filePath, fullPage: true });
      console.log(`✅ Screenshot saved: ${filePath}`);
    } catch (err) {
      console.error(`❌ Failed to screenshot ${url}:`, err.message);
    }
  }
  await browser.close();
})();
