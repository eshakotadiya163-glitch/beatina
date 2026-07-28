const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true });

  // Local
  const local = await browser.newPage();
  await local.setViewport({ width: 1440, height: 900 });
  await local.goto('http://localhost:5173/', { waitUntil: 'networkidle0', timeout: 30000 });
  
  // Scroll down to categories (approx 850px down for HeroBanner height)
  await local.evaluate(() => window.scrollTo(0, 850));
  await new Promise(r => setTimeout(r, 2000));
  await local.screenshot({ path: 'categories_local.png' });
  console.log('Local categories done');

  // Reference
  const ref = await browser.newPage();
  await ref.setViewport({ width: 1440, height: 900 });
  
  // BYPASS PASSWORD
  await ref.goto('https://beautina-cosmetic.myshopify.com/password', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await new Promise(r => setTimeout(r, 1500));
  const pass = await ref.$('input[type="password"]');
  if (pass) { 
    await pass.type('1'); 
    await ref.click('button[type="submit"]'); 
    await new Promise(r => setTimeout(r, 4000)); 
  }
  
  await ref.goto('https://beautina-cosmetic.myshopify.com/', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await new Promise(r => setTimeout(r, 3000));
  
  // dismiss cookie
  const btns = await ref.$$('button');
  for (const b of btns) { 
    const t = await b.evaluate(e => e.innerText); 
    if (t && t.includes('ACCEPT')) { 
      await b.click(); 
      break; 
    } 
  }
  
  await ref.evaluate(() => window.scrollTo(0, 850));
  await new Promise(r => setTimeout(r, 2000));
  await ref.screenshot({ path: 'categories_ref.png' });
  console.log('Reference categories done');

  await browser.close();
  console.log('All done');
})();
