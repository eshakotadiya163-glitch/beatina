const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  await page.goto('https://beautina-cosmetic.myshopify.com/password', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1000));
  await page.type('input[type="password"]', '1');
  await page.click('button[type="submit"]');
  await new Promise(r => setTimeout(r, 3000));

  await page.goto('https://beautina-cosmetic.myshopify.com/', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 2000));

  const offset = await page.evaluate(() => {
    const el = Array.from(document.querySelectorAll('*')).find(e => e.innerText && e.innerText.includes('Make you feel') && e.children.length === 0);
    if (!el) return -1;
    let curr = el;
    while(curr.tagName !== 'SECTION' && curr.tagName !== 'DIV' && curr.parentElement) curr = curr.parentElement;
    return curr.getBoundingClientRect().top + window.scrollY;
  });
  console.log('Offset:', offset);
  
  await browser.close();
})();
