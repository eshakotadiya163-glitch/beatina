const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({
    headless: "new"
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 4000 });
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });
  
  // Wait for 2 seconds to let any images load
  await new Promise(r => setTimeout(r, 2000));
  
  const dest = path.join('C:', 'Users', 'eshak', '.gemini', 'antigravity', 'brain', '6187fdb0-666e-413f-9ccc-7086efe5ab29', 'scratch', 'localhost_screenshot.png');
  await page.screenshot({ path: dest, fullPage: true });
  console.log('Saved to ' + dest);
  await browser.close();
})();
