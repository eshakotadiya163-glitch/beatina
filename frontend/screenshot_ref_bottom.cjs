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

  const btns = await page.$$('button');
  for (const b of btns) { 
    const t = await b.evaluate(e => e.innerText); 
    if (t && t.includes('ACCEPT')) { 
      await b.click(); 
      break; 
    } 
  }
  await new Promise(r => setTimeout(r, 1000));

  await page.evaluate(() => window.scrollTo(0, 5400));
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: 'ref_scroll_5400.png' });

  await page.evaluate(() => window.scrollTo(0, 6300));
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: 'ref_scroll_6300.png' });

  await browser.close();
})();
