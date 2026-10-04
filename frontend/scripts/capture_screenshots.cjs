const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const OUTPUT_DIR = path.resolve(__dirname, '../../screenshots');
const BASE_URL = 'http://localhost:5173';

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function capture() {
  console.log('🚀 Launching Chrome from:', CHROME_PATH);
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--window-size=1600,1050',
    ],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 920, deviceScaleFactor: 2 });

  try {
    // Set theme to dark by default for rich visuals
    await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle0' });
    await page.evaluate(() => {
      localStorage.setItem('homelyhub_theme', 'dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    });

    // 1. Homepage Hero & Filter Bar
    console.log('[1/11] Capturing 01_homepage_hero.png...');
    await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle0', timeout: 30000 });
    await sleep(2000);
    await page.screenshot({
      path: path.join(OUTPUT_DIR, '01_homepage_hero.png'),
    });

    // 2. Stay Listings Grid
    console.log('[2/11] Capturing 02_stay_listings_grid.png...');
    await page.evaluate(() => {
      window.scrollTo(0, 680);
    });
    await sleep(2000);
    await page.screenshot({
      path: path.join(OUTPUT_DIR, '02_stay_listings_grid.png'),
    });

    // 3. Interactive Leaflet Map
    console.log('[3/11] Capturing 03_interactive_map.png...');
    await page.evaluate(() => {
      window.scrollTo(0, 520);
      const btns = Array.from(document.querySelectorAll('button'));
      const mapBtn = btns.find(b => b.innerText.includes('Map'));
      if (mapBtn) mapBtn.click();
    });
    await sleep(3500); // Allow Leaflet tiles and pins to load
    await page.screenshot({
      path: path.join(OUTPUT_DIR, '03_interactive_map.png'),
    });

    // 4. Property Detail Page
    console.log('[4/11] Capturing 04_property_details.png...');
    await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle0' });
    await sleep(1500);
    const targetUrl = await page.evaluate(() => {
      const link = document.querySelector('a[href*="/properties/"]');
      return link ? link.getAttribute('href') : null;
    });
    const propUrl = targetUrl ? `${BASE_URL}${targetUrl}` : `${BASE_URL}/properties/6ac294a23b977c0b4b407a34`;
    await page.goto(propUrl, { waitUntil: 'networkidle0', timeout: 30000 });
    await sleep(3000);
    await page.screenshot({
      path: path.join(OUTPUT_DIR, '04_property_details.png'),
    });

    // 5. AI Trip Planner Page
    console.log('[5/11] Capturing 05_ai_trip_planner.png...');
    await page.goto(`${BASE_URL}/ai-trip-planner`, { waitUntil: 'networkidle0', timeout: 30000 });
    await sleep(2000);
    // Click Generate Trip Plan
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const generateBtn = btns.find(b => b.innerText.includes('Generate') || b.innerText.includes('Plan'));
      if (generateBtn) generateBtn.click();
    });
    await sleep(4000);
    await page.screenshot({
      path: path.join(OUTPUT_DIR, '05_ai_trip_planner.png'),
    });

    // 6. Login Sanctuary Portal
    console.log('[6/11] Capturing 06_login_sanctuary.png...');
    const client = await page.target().createCDPSession();
    await client.send('Network.clearBrowserCookies');
    await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle0', timeout: 30000 });
    await sleep(2000);
    await page.screenshot({
      path: path.join(OUTPUT_DIR, '06_login_sanctuary.png'),
    });

    // 7. Host Dashboard (Log in as Host Aarav Sharma)
    console.log('[7/11] Logging in as Host & Capturing 07_host_dashboard.png...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const hostBtn = btns.find(b => b.innerText.includes('Host: Aarav') || b.innerText.includes('Aarav'));
      if (hostBtn) hostBtn.click();
    });
    await sleep(4000);
    // Verify on host dashboard
    if (!page.url().includes('/host/dashboard')) {
      await page.goto(`${BASE_URL}/host/dashboard`, { waitUntil: 'networkidle0' });
      await sleep(2500);
    }
    await page.screenshot({
      path: path.join(OUTPUT_DIR, '07_host_dashboard.png'),
    });

    // 8. Host Properties & Bookings Table (Scroll down)
    console.log('[8/11] Capturing 08_host_properties_and_bookings.png...');
    await page.evaluate(() => {
      window.scrollTo(0, 480);
    });
    await sleep(2000);
    await page.screenshot({
      path: path.join(OUTPUT_DIR, '08_host_properties_and_bookings.png'),
    });

    // 9. Add Property Page with Groq AI
    console.log('[9/11] Capturing 09_add_property_ai.png...');
    await page.goto(`${BASE_URL}/add-property`, { waitUntil: 'networkidle0', timeout: 30000 });
    await sleep(2500);
    await page.screenshot({
      path: path.join(OUTPUT_DIR, '09_add_property_ai.png'),
    });

    // 10. Guest Dashboard (Log in as Guest Aditya Rao)
    console.log('[10/11] Logging in as Guest & Capturing 10_guest_dashboard.png...');
    await client.send('Network.clearBrowserCookies');
    await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle0' });
    await sleep(1500);
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const guestBtn = btns.find(b => b.innerText.includes('Aditya') || b.innerText.includes('Meera'));
      if (guestBtn) guestBtn.click();
    });
    await sleep(4000);
    if (!page.url().includes('/guest/dashboard')) {
      await page.goto(`${BASE_URL}/guest/dashboard`, { waitUntil: 'networkidle0' });
      await sleep(2500);
    }
    await page.screenshot({
      path: path.join(OUTPUT_DIR, '10_guest_dashboard.png'),
    });

    // 11. Light Theme Showcase
    console.log('[11/11] Capturing 11_light_mode_showcase.png...');
    await client.send('Network.clearBrowserCookies');
    await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle0' });
    await page.evaluate(() => {
      localStorage.setItem('homelyhub_theme', 'light');
      document.documentElement.setAttribute('data-theme', 'light');
    });
    await sleep(2000);
    await page.screenshot({
      path: path.join(OUTPUT_DIR, '11_light_mode_showcase.png'),
    });

    console.log('🎉 All 11 screenshots captured successfully into:', OUTPUT_DIR);
  } catch (err) {
    console.error('❌ Error during capture:', err);
  } finally {
    await browser.close();
  }
}

capture();
