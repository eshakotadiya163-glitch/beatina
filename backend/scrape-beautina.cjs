const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({
    headless: "new"
  });
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36');
  await page.setViewport({ width: 1440, height: 4000 });
  console.log('Navigating to Beautina...');
  await page.goto('https://beautina-cosmetic.myshopify.com/', { waitUntil: 'networkidle2' });
  
  // Check if we are on the password page
  if (await page.$('input[type="password"]')) {
      console.log('Entering password...');
      await page.type('input[type="password"]', '1');
      await page.keyboard.press('Enter');
      await page.waitForNavigation({ waitUntil: 'networkidle2' });
  }

  // Wait for 3 seconds to let any lazy images load
  await new Promise(r => setTimeout(r, 3000));
  
  const html = await page.content();
  fs.writeFileSync('beautina_real_unlocked.html', html);
  console.log('Saved beautina_real_unlocked.html');

  await browser.close();
})();
