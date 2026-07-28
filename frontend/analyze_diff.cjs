const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch();
  
  // Scrape reference
  const page1 = await browser.newPage();
  await page1.setViewport({ width: 1440, height: 900 });
  await page1.goto('file:///E:/aura%20collection/frontend/collections.html', { waitUntil: 'load', timeout: 15000 }).catch(()=>console.log('timeout ref'));
  
  const refData = await page1.evaluate(() => {
    try {
      const getStyles = (el) => {
        if (!el) return null;
        const s = window.getComputedStyle(el);
        const rect = el.getBoundingClientRect();
        return {
          width: rect.width, height: rect.height, padding: s.padding, margin: s.margin,
          fontFamily: s.fontFamily, fontSize: s.fontSize, fontWeight: s.fontWeight,
          lineHeight: s.lineHeight, color: s.color, backgroundColor: s.backgroundColor
        };
      };
      
      const container = document.querySelector('.page-width') || document.querySelector('.container');
      const firstRow = document.querySelector('.row.collection.collection-1');
      if (!firstRow) return { error: 'No row' };
      
      const catCardWrapper = firstRow.children[0];
      const productCardWrapper = firstRow.children[1];
      
      const catCard = catCardWrapper.querySelector('.collection-card');
      const catTitle = catCardWrapper.querySelector('.collection-card__title');
      
      return {
        container: getStyles(container),
        catCardWrapper: getStyles(catCardWrapper),
        catCard: getStyles(catCard),
        catTitle: getStyles(catTitle),
        productCardWrapper: getStyles(productCardWrapper)
      };
    } catch (e) { return { error: e.toString() }; }
  });

  // Scrape local
  const page2 = await browser.newPage();
  await page2.setViewport({ width: 1440, height: 900 });
  await page2.goto('http://localhost:5173/shop', { waitUntil: 'load', timeout: 15000 }).catch(()=>console.log('timeout loc'));
  await new Promise(r => setTimeout(r, 4000));
  
  const localData = await page2.evaluate(() => {
    try {
      const getStyles = (el) => {
        if (!el) return null;
        const s = window.getComputedStyle(el);
        const rect = el.getBoundingClientRect();
        return {
          width: rect.width, height: rect.height, padding: s.padding, margin: s.margin,
          fontFamily: s.fontFamily, fontSize: s.fontSize, fontWeight: s.fontWeight,
          lineHeight: s.lineHeight, color: s.color, backgroundColor: s.backgroundColor
        };
      };
      
      const container = document.querySelector('.max-w-\\[1400px\\]');
      const rows = document.querySelectorAll('.flex.flex-wrap');
      let firstRow = null;
      for (const r of rows) {
        if (r.children.length >= 4) { firstRow = r; break; }
      }
      if (!firstRow) return { error: 'No row' };
      
      const catCardWrapper = firstRow.children[0];
      const productCardWrapper = firstRow.children[1];
      const catCard = catCardWrapper.querySelector('a');
      const catTitle = catCardWrapper.querySelector('h2');
      
      return {
        container: getStyles(container),
        catCardWrapper: getStyles(catCardWrapper),
        catCard: getStyles(catCard),
        catTitle: getStyles(catTitle),
        productCardWrapper: getStyles(productCardWrapper)
      };
    } catch(e) { return { error: e.toString() }; }
  });

  console.log("----- REF -----"); console.log(JSON.stringify(refData, null, 2));
  console.log("\n----- LOCAL -----"); console.log(JSON.stringify(localData, null, 2));

  await browser.close();
})();
