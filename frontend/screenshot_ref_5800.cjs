const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  
  await page.goto('https://beautina-cosmetic.myshopify.com/password', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1000));
  await page.type('input[type="password"]', '1');
  await page.click('button[type="submit"]');
  await new Promise(r => setTimeout(r, 4000));

  await page.goto('https://beautina-cosmetic.myshopify.com/', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 3000));

  await page.evaluate(() => window.scrollTo(0, 5800));
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: 'ref_scroll_5800.png' });

  await browser.close();
})();
