const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  
  const pageLocal = await browser.newPage();
  await pageLocal.setViewport({ width: 1440, height: 2000 });
  
  // Create artifact directory
  const outDir = path.join('C:', 'Users', 'eshak', '.gemini', 'antigravity', 'brain', '6187fdb0-666e-413f-9ccc-7086efe5ab29');
  
  // We can't easily capture the "before" because the code was already changed, 
  // but we can capture the "after" from the current local host.
  await pageLocal.goto('http://localhost:5173/shop', { waitUntil: 'networkidle2' });
  
  // Hide animations
  await pageLocal.evaluate(() => {
    document.querySelectorAll('.animate-marquee, .scale-in, .aos-animate, .lazyload').forEach(el => {
      el.style.animation = 'none';
      el.style.transform = 'none';
      el.style.transition = 'none';
    });
  });

  async function capture(selector, name) {
    try {
      const el = await pageLocal.$(selector);
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

  await new Promise(r => setTimeout(r, 2000));
  
  await capture('header', 'shop-header-after');
  await capture('main', 'shop-main-after');
  
  await browser.close();
})();
