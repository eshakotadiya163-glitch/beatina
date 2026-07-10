const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  try {
    const browser = await puppeteer.launch({ headless: "new" });
    const pageLocal = await browser.newPage();
    await pageLocal.setViewport({ width: 1440, height: 4000 });
    
    console.log('Navigating to localhost...');
    await pageLocal.goto('http://localhost:5175', { waitUntil: 'networkidle2' });
    
    console.log('Waiting for products to render...');
    await new Promise(r => setTimeout(r, 4000)); // give time for react query and images

    // Hide animations for clean screenshot
    await pageLocal.evaluate(() => {
      document.querySelectorAll('.animate-marquee, .scale-in, .aos-animate').forEach(el => {
        el.style.animation = 'none';
        el.style.transform = 'none';
        el.style.transition = 'none';
      });
    });

    const outDir = path.join('C:', 'Users', 'eshak', '.gemini', 'antigravity', 'brain', '6187fdb0-666e-413f-9ccc-7086efe5ab29');
    
    await pageLocal.screenshot({ path: path.join(outDir, 'localhost_after_typography.png'), fullPage: true });
    console.log('Captured localhost_after_typography.png');

    await browser.close();
  } catch (err) {
    console.error('Error capturing screenshot:', err);
    process.exit(1);
  }
})();
