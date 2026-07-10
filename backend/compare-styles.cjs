const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: "new" });

  async function getStyles(url, selector, isBeautina = false) {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(url, { waitUntil: 'networkidle2' });

    if (isBeautina) {
      if (await page.$('input[type="password"]')) {
        await page.type('input[type="password"]', '1');
        await page.keyboard.press('Enter');
        await page.waitForNavigation({ waitUntil: 'networkidle2' });
      }
    }

    const styles = await page.evaluate((sel) => {
      const el = document.querySelector(sel);
      if (!el) return null;
      
      const comp = window.getComputedStyle(el);
      return {
        width: comp.width,
        padding: comp.padding,
        margin: comp.margin,
        backgroundColor: comp.backgroundColor,
        borderRadius: comp.borderRadius,
        boxShadow: comp.boxShadow,
      };
    }, selector);
    
    // Also get the title styles
    const titleStyles = await page.evaluate((sel) => {
      // Trying to find a title element
      const el = document.querySelector(sel);
      if (!el) return null;
      const title = el.querySelector('h3, .product-card__name');
      if (!title) return null;
      
      const comp = window.getComputedStyle(title);
      return {
        fontFamily: comp.fontFamily,
        fontSize: comp.fontSize,
        fontWeight: comp.fontWeight,
        color: comp.color,
        letterSpacing: comp.letterSpacing,
        lineHeight: comp.lineHeight,
        textTransform: comp.textTransform
      };
    }, selector);

    await page.close();
    return { styles, titleStyles };
  }

  const beautina = await getStyles('https://beautina-cosmetic.myshopify.com/', '.product-card', true);
  const local = await getStyles('http://localhost:5173', 'section:nth-of-type(4) .swiper-slide'); // New Arrivals tab first card

  console.log('--- Beautina ---');
  console.log(beautina);
  console.log('--- Local ---');
  console.log(local);

  await browser.close();
})();
