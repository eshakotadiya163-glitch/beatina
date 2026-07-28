const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  
  // Scrape reference
  const page1 = await browser.newPage();
  await page1.setViewport({ width: 1200, height: 900 });
  await page1.goto('file:///E:/aura%20collection/frontend/collections.html', { waitUntil: 'load', timeout: 15000 }).catch(() => {});
  await page1.screenshot({ path: 'C:\\Users\\eshak\\.gemini\\antigravity\\brain\\6187fdb0-666e-413f-9ccc-7086efe5ab29\\scratch\\beautina.png' });
  
  // Scrape local
  const page2 = await browser.newPage();
  await page2.setViewport({ width: 1200, height: 900 });
  await page2.goto('http://localhost:5173/shop', { waitUntil: 'load', timeout: 15000 }).catch(() => {});
  
  // Wait for products to load
  await new Promise(r => setTimeout(r, 4000));
  
  await page2.screenshot({ path: 'C:\\Users\\eshak\\.gemini\\antigravity\\brain\\6187fdb0-666e-413f-9ccc-7086efe5ab29\\scratch\\local.png' });
  
  await browser.close();
  console.log("Screenshots captured!");
})();
