const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  await page.setViewport({ width: 1440, height: 900 });
  
  console.log('Capturing local page...');
  try {
    await page.goto('http://localhost:5173/shop/category/skincare', { 
      waitUntil: 'networkidle0',
      timeout: 20000
    });
    await new Promise(r => setTimeout(r, 2000));
    await page.screenshot({ path: 'local_category.png', fullPage: false });
    console.log('Local screenshot saved: local_category.png');
  } catch(e) {
    console.log('Local page error:', e.message);
  }

  console.log('Capturing Beautina reference...');
  try {
    const page2 = await browser.newPage();
    await page2.setViewport({ width: 1440, height: 900 });
    await page2.goto('https://beautina-cosmetic.myshopify.com/collections/skincare', { 
      waitUntil: 'networkidle0',
      timeout: 30000
    });
    await new Promise(r => setTimeout(r, 3000));
    await page2.screenshot({ path: 'beautina_category.png', fullPage: false });
    console.log('Beautina screenshot saved: beautina_category.png');
    await page2.close();
  } catch(e) {
    console.log('Beautina page error:', e.message);
  }

  await browser.close();
  console.log('Done!');
})();
