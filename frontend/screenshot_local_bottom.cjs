const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true });

  const local = await browser.newPage();
  await local.setViewport({ width: 1440, height: 900 });
  await local.goto('http://localhost:5173', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2000));

  await local.evaluate(() => window.scrollTo(0, 5400));
  await new Promise(r => setTimeout(r, 1000));
  await local.screenshot({ path: 'local_scroll_5400.png' });

  await local.evaluate(() => window.scrollTo(0, 6300));
  await new Promise(r => setTimeout(r, 1000));
  await local.screenshot({ path: 'local_scroll_6300.png' });

  await browser.close();
})();
