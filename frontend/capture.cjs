
const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
  await page.screenshot({ path: '../brain/6187fdb0-666e-413f-9ccc-7086efe5ab29/scratch/new-arrivals-parity.png', fullPage: true });
  await browser.close();
  console.log('Screenshot saved to new-arrivals-parity.png');
})();
