const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true });

  // ---- LOCAL ----
  const local = await browser.newPage();
  await local.setViewport({ width: 1440, height: 900 });
  await local.goto('http://localhost:5173/', { waitUntil: 'networkidle0', timeout: 30000 });
  await new Promise(r => setTimeout(r, 3000));
  await local.screenshot({ path: 'home_local_full.png', fullPage: true });
  await local.screenshot({ path: 'home_local_vp.png', fullPage: false });
  console.log('Local done');

  // ---- BEAUTINA ----
  const ref = await browser.newPage();
  await ref.setViewport({ width: 1440, height: 900 });
  await ref.goto('https://beautina-cosmetic.myshopify.com/password', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await new Promise(r => setTimeout(r, 1500));
  const pass = await ref.$('input[type="password"]');
  if (pass) { await pass.type('1'); await ref.click('button[type="submit"]'); await new Promise(r => setTimeout(r, 4000)); }
  await ref.goto('https://beautina-cosmetic.myshopify.com/', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await new Promise(r => setTimeout(r, 5000));
  // dismiss cookie
  const btns = await ref.$$('button');
  for (const b of btns) { const t = await b.evaluate(e => e.innerText); if (t && t.includes('ACCEPT')) { await b.click(); break; } }
  await new Promise(r => setTimeout(r, 1000));
  await ref.screenshot({ path: 'home_ref_full.png', fullPage: true });
  await ref.screenshot({ path: 'home_ref_vp.png', fullPage: false });
  console.log('Reference done');

  await browser.close();
  console.log('All done');
})();
