const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  
  console.log('Capturing local page...');
  await page.goto('http://localhost:5173/shop/category/skincare', { 
    waitUntil: 'networkidle0',
    timeout: 30000
  });
  await new Promise(r => setTimeout(r, 3000));
  
  await page.screenshot({ path: 'local_cat_v2.png', fullPage: false });
  console.log('Saved: local_cat_v2.png (viewport)');
  
  // Scroll to see the product grid
  await page.evaluate(() => window.scrollTo(0, 600));
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: 'local_cat_grid_v2.png', fullPage: false });
  console.log('Saved: local_cat_grid_v2.png (grid)');

  await browser.close();
  console.log('Done!');
})();
