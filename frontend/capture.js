import { chromium } from 'playwright';

async function capture() {
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 }
  });
  
  await page.goto('http://localhost:5173');
  // Wait for images to load
  await page.waitForTimeout(3000);
  
  await page.screenshot({ path: 'localhost_full_final4.png', fullPage: true });
  await browser.close();
  console.log('Screenshot captured.');
}

capture().catch(console.error);
