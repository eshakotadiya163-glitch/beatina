import { chromium } from 'playwright';

async function extract() {
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 }
  });
  
  await page.goto('file://E:/aura collection/backend/beautina_real_unlocked.html');
  
  const h3Style = await page.$eval('.section-title-1 span', el => {
    const style = window.getComputedStyle(el);
    return {
      fontSize: style.fontSize,
      fontWeight: style.fontWeight,
      fontFamily: style.fontFamily,
      lineHeight: style.lineHeight,
      color: style.color
    };
  });
  
  const pStyle = await page.$eval('.txt-body-70', el => {
    const style = window.getComputedStyle(el);
    return {
      fontSize: style.fontSize,
      fontWeight: style.fontWeight,
      fontFamily: style.fontFamily,
      lineHeight: style.lineHeight,
      color: style.color,
      marginBottom: style.marginBottom
    };
  });
  
  const tabStyle = await page.$eval('.nav-link-collection_1', el => {
    const style = window.getComputedStyle(el);
    return {
      fontSize: style.fontSize,
      fontWeight: style.fontWeight,
      fontFamily: style.fontFamily,
      padding: style.padding,
      color: style.color
    };
  });

  const productTabContainer = await page.$eval('.customstyletemplate--21198444855396__product-tab', el => {
    const style = window.getComputedStyle(el);
    return {
      padding: style.padding,
      margin: style.margin
    };
  });

  console.log("H3 Span:", h3Style);
  console.log("P text:", pStyle);
  console.log("Tab link:", tabStyle);
  console.log("Container:", productTabContainer);

  await browser.close();
}

extract().catch(console.error);
