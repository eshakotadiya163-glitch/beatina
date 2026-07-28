const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  await page.goto('https://beautina-cosmetic.myshopify.com/collections', { waitUntil: 'networkidle2' });
  
  const isPasswordPage = await page.$('input[type="password"]');
  if (isPasswordPage) {
    await page.type('input[type="password"]', '1');
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle2' }),
      page.keyboard.press('Enter'),
    ]);
    
    // Now go back to collections
    await page.goto('https://beautina-cosmetic.myshopify.com/collections', { waitUntil: 'networkidle2' });
  }
  
  const html = await page.content();
  fs.writeFileSync('collections.html', html);
  await page.screenshot({ path: 'collections.png', fullPage: true });

  await browser.close();
})();
