const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  await page.setViewport({ width: 1440, height: 900 });
  
  // Go to password page
  await page.goto('https://beautina-cosmetic.myshopify.com/password', { waitUntil: 'networkidle2' });
  
  // Submit password form if present
  try {
    const pwdInput = await page.$('input[type="password"]');
    if (pwdInput) {
      await page.type('input[type="password"]', '1');
      await page.click('button[type="submit"]');
      await page.waitForNavigation({ waitUntil: 'networkidle2' });
    }
  } catch(e) {
    console.log("No password needed or error: ", e.message);
  }

  // Go to skincare collection
  await page.goto('https://beautina-cosmetic.myshopify.com/collections/skincare', { waitUntil: 'networkidle2' });
  
  // Save HTML and screenshot
  const html = await page.content();
  fs.writeFileSync('skincare.html', html);
  
  await page.screenshot({ path: 'C:\\Users\\eshak\\.gemini\\antigravity\\brain\\6187fdb0-666e-413f-9ccc-7086efe5ab29\\scratch\\skincare_beautina.png' });
  
  await browser.close();
  console.log("Scraped successfully!");
})();
