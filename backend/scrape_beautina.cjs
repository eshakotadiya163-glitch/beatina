const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  // Set a viewport to simulate desktop
  await page.setViewport({ width: 1280, height: 800 });

  console.log('Navigating to Beautina product page...');
  await page.goto('https://beautina-cosmetic.myshopify.com/collections/serum-cream/products/sos-hydra-intense-rose-jelly', { waitUntil: 'networkidle2' });

  // Check if we hit the password page
  const html = await page.content();
  if (html.includes('password') || await page.$('input[type="password"]')) {
    console.log('Password page detected. Entering password...');
    // Sometimes Shopify requires clicking a "Enter using password" link first
    const enterPasswordLink = await page.$('a[href="#LoginModal"], summary');
    if (enterPasswordLink) {
      // Attempt click, ignore error
      try { await enterPasswordLink.click(); await page.waitForTimeout(500); } catch(e) {}
    }
    
    const passwordInput = await page.$('input[type="password"]');
    if (passwordInput) {
      await passwordInput.type('1');
      await passwordInput.press('Enter');
      await page.waitForNavigation({ waitUntil: 'networkidle2' });
      console.log('Successfully bypassed password page.');
    }
  }

  // Extract CSS font families and colors
  console.log('Extracting styles...');
  const styles = await page.evaluate(() => {
    const computedStyles = window.getComputedStyle(document.body);
    const h1Styles = document.querySelector('h1') ? window.getComputedStyle(document.querySelector('h1')) : null;
    const buttonStyles = document.querySelector('button[name="add"], .add-to-cart') ? window.getComputedStyle(document.querySelector('button[name="add"], .add-to-cart')) : null;
    
    return {
      bodyFont: computedStyles.fontFamily,
      bodyColor: computedStyles.color,
      bodyBackground: computedStyles.backgroundColor,
      h1Font: h1Styles ? h1Styles.fontFamily : null,
      h1Color: h1Styles ? h1Styles.color : null,
      h1Transform: h1Styles ? h1Styles.textTransform : null,
      buttonFont: buttonStyles ? buttonStyles.fontFamily : null,
      buttonBg: buttonStyles ? buttonStyles.backgroundColor : null,
      buttonColor: buttonStyles ? buttonStyles.color : null,
      buttonTransform: buttonStyles ? buttonStyles.textTransform : null,
    };
  });
  console.log('Styles:', styles);

  const fs = require('fs');
  fs.writeFileSync('beautina_styles.json', JSON.stringify(styles, null, 2));

  await browser.close();
})();
