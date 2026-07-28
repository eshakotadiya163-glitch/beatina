const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  await page.setViewport({ width: 1280, height: 800 });
  await page.goto('https://beautina-cosmetic.myshopify.com/collections/serum-cream/products/sos-hydra-intense-rose-jelly', { waitUntil: 'networkidle2' });

  const html = await page.content();
  if (html.includes('password') || await page.$('input[type="password"]')) {
    const enterPasswordLink = await page.$('a[href="#LoginModal"], summary');
    if (enterPasswordLink) {
      try { await enterPasswordLink.click(); await page.waitForTimeout(500); } catch(e) {}
    }
    const passwordInput = await page.$('input[type="password"]');
    if (passwordInput) {
      await passwordInput.type('1');
      await passwordInput.press('Enter');
      await page.waitForNavigation({ waitUntil: 'networkidle2' });
    }
  }

  const mainHtml = await page.evaluate(() => {
    return document.body.innerHTML;
  });
  
  fs.writeFileSync('beautina_full.html', mainHtml);
  console.log('Saved beautina_full.html');

  await browser.close();
})();
