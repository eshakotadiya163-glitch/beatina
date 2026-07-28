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

  await page.evaluate(() => window.scrollTo(0, 0));
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: 'ref_scroll_0.png' });

  await page.evaluate(() => window.scrollTo(0, 900));
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: 'ref_scroll_900.png' });

  await page.evaluate(() => window.scrollTo(0, 1800));
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: 'ref_scroll_1800.png' });

  await page.evaluate(() => window.scrollTo(0, 2700));
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: 'ref_scroll_2700.png' });

  await page.evaluate(() => window.scrollTo(0, 3600));
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: 'ref_scroll_3600.png' });

  await page.evaluate(() => window.scrollTo(0, 4500));
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: 'ref_scroll_4500.png' });
  
  await browser.close();
})();
