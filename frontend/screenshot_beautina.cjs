const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  
  // Go to password page
  await page.goto('https://beautina-cosmetic.myshopify.com/password', { 
    waitUntil: 'domcontentloaded', timeout: 60000 
  });
  await new Promise(r => setTimeout(r, 1000));
  
  // Fill password
  const passInput = await page.$('input[type="password"]');
  if (passInput) {
    await passInput.type('1');
    await page.click('button[type="submit"]');
    await new Promise(r => setTimeout(r, 4000));
  }
  
  // Navigate to skincare collection
  await page.goto('https://beautina-cosmetic.myshopify.com/collections/skincare', { 
    waitUntil: 'domcontentloaded', timeout: 60000 
  });
  await new Promise(r => setTimeout(r, 4000));
  
  // Dismiss cookie banner if it exists
  try {
    const declineBtn = await page.$('button');
    const buttons = await page.$$('button');
    for (const btn of buttons) {
      const text = await btn.evaluate(el => el.innerText);
      if (text && (text.includes('DECLINE') || text.includes('ACCEPT') || text.includes('Accept'))) {
        await btn.click();
        console.log('Clicked:', text);
        await new Promise(r => setTimeout(r, 1000));
        break;
      }
    }
  } catch(e) { console.log('No cookie banner:', e.message); }
  
  await new Promise(r => setTimeout(r, 2000));
  
  // Full page viewport screenshot
  await page.screenshot({ path: 'beautina_skincare_viewport2.png', fullPage: false });
  console.log('Viewport screenshot saved');
  
  // Full scroll screenshot
  await page.evaluate(() => window.scrollTo(0, 600));
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: 'beautina_skincare_grid.png', fullPage: false });
  console.log('Grid screenshot saved');
  
  // Product card close-up 
  await page.evaluate(() => window.scrollTo(0, 900));
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: 'beautina_skincare_products.png', fullPage: false });
  console.log('Products screenshot saved');

  await browser.close();
  console.log('Done!');
})();
