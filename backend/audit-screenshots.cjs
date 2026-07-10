const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  
  // Localhost
  const pageLocal = await browser.newPage();
  await pageLocal.setViewport({ width: 1440, height: 4000 });
  await pageLocal.goto('http://localhost:5173', { waitUntil: 'networkidle2' });
  
  // Beautina
  const pageBeautina = await browser.newPage();
  await pageBeautina.setViewport({ width: 1440, height: 4000 });
  await pageBeautina.goto('https://beautina-cosmetic.myshopify.com/', { waitUntil: 'networkidle2' });
  if (await pageBeautina.$('input[type="password"]')) {
      await pageBeautina.type('input[type="password"]', '1');
      await pageBeautina.keyboard.press('Enter');
      await pageBeautina.waitForNavigation({ waitUntil: 'networkidle2' });
  }

  // Hide animations for accurate screenshots
  await pageLocal.evaluate(() => {
    document.querySelectorAll('.animate-marquee, .scale-in, .aos-animate').forEach(el => {
      el.style.animation = 'none';
      el.style.transform = 'none';
      el.style.transition = 'none';
    });
  });
  await pageBeautina.evaluate(() => {
    document.querySelectorAll('.animate-marquee, .scale-in, .aos-animate, .lazyload').forEach(el => {
      el.style.animation = 'none';
      el.style.transform = 'none';
      el.style.transition = 'none';
    });
  });

  const outDir = path.join('C:', 'Users', 'eshak', '.gemini', 'antigravity', 'brain', '6187fdb0-666e-413f-9ccc-7086efe5ab29');

  async function capture(page, selector, name) {
    try {
      const el = await page.$(selector);
      if (el) {
        await el.screenshot({ path: path.join(outDir, `${name}.png`) });
        console.log(`Captured ${name}.png`);
      } else {
        console.log(`Selector not found for ${name}`);
      }
    } catch(e) {
      console.log(`Error capturing ${name}: ${e.message}`);
    }
  }

  // Wait for 3 seconds for images to load
  await new Promise(r => setTimeout(r, 3000));

  // Capture Hero
  await capture(pageLocal, 'main > section:nth-child(1)', 'hero-local');
  await capture(pageBeautina, '.slideshow', 'hero-beautina');

  // Capture New Arrivals
  await capture(pageLocal, 'main > section:nth-child(4)', 'new-arrivals-local');
  await capture(pageBeautina, '.shopify-section.template--21198444855396__product-tab', 'new-arrivals-beautina');

  await browser.close();
})();
