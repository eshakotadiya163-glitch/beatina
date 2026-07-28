const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  await page.goto('https://beautina-cosmetic.myshopify.com/password', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1000));
  await page.type('input[type="password"]', '1');
  await page.click('button[type="submit"]');
  await new Promise(r => setTimeout(r, 3000));

  await page.goto('https://beautina-cosmetic.myshopify.com/', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 2000));

  const text = await page.evaluate(() => document.body.innerText);
  if (text.toLowerCase().includes('make you feel')) {
    console.log('Found "Make you feel"');
  } else {
    console.log('Did NOT find "Make you feel"');
  }
  
  await browser.close();
})();
