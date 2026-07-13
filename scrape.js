const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  await page.goto('https://beautina-cosmetic.myshopify.com/');
  
  // Try to find the password input and login
  const passwordInput = await page.$('input[type="password"]');
  if (passwordInput) {
    await passwordInput.type('1');
    const submitBtn = await page.$('button[type="submit"], input[type="submit"], form button');
    if (submitBtn) {
        await submitBtn.click();
        await page.waitForNavigation({ waitUntil: 'networkidle0' });
    } else {
        await page.keyboard.press('Enter');
        await page.waitForNavigation({ waitUntil: 'networkidle0' });
    }
  }

  // Extract info from Home page
  const homeInfo = await page.evaluate(() => {
    const getStyles = (selector) => {
        const el = document.querySelector(selector);
        if(!el) return null;
        const styles = window.getComputedStyle(el);
        return {
            fontFamily: styles.fontFamily,
            color: styles.color,
            backgroundColor: styles.backgroundColor,
            fontSize: styles.fontSize,
            padding: styles.padding,
            margin: styles.margin,
            borderRadius: styles.borderRadius
        };
    };
    
    // Find generic colors and fonts used in body
    const bodyStyles = getStyles('body');
    const h1Styles = getStyles('h1');
    const h2Styles = getStyles('h2');
    const btnStyles = getStyles('button, .btn, .button, a[role="button"]');
    
    // Get general structure classes/tags
    const header = document.querySelector('header') ? 'exists' : 'missing';
    const footer = document.querySelector('footer') ? 'exists' : 'missing';
    
    // Get all unique fonts
    const allElements = document.querySelectorAll('*');
    const fonts = new Set();
    const bgColors = new Set();
    const textColors = new Set();
    
    let count = 0;
    for(let el of allElements) {
        if(count > 1000) break; // Limit scanning
        const s = window.getComputedStyle(el);
        if(s.fontFamily) fonts.add(s.fontFamily);
        if(s.backgroundColor && s.backgroundColor !== 'rgba(0, 0, 0, 0)' && s.backgroundColor !== 'transparent') bgColors.add(s.backgroundColor);
        if(s.color && s.color !== 'rgba(0, 0, 0, 0)') textColors.add(s.color);
        count++;
    }

    return {
        bodyStyles, h1Styles, h2Styles, btnStyles,
        fonts: Array.from(fonts),
        bgColors: Array.from(bgColors),
        textColors: Array.from(textColors),
        html: document.body.innerHTML.substring(0, 2000) // snippet
    };
  });
  
  fs.writeFileSync('analysis.json', JSON.stringify({ homeInfo }, null, 2));
  console.log("Analysis complete.");
  await browser.close();
})();
