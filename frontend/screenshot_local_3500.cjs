const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true });

  const local = await browser.newPage();
  await local.setViewport({ width: 1440, height: 900 });
  await local.goto('http://localhost:5173/', { waitUntil: 'networkidle0', timeout: 30000 });
  
  await local.evaluate(() => window.scrollTo(0, 3500));
  await new Promise(r => setTimeout(r, 1000));
  await local.screenshot({ path: 'local_scroll_3500.png' });

  await browser.close();
  console.log('All done');
})();
