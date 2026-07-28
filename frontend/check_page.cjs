const puppeteer = require('puppeteer'); 
(async () => { 
  const browser = await puppeteer.launch(); 
  const page = await browser.newPage(); 
  page.on('console', msg => console.log('PAGE LOG:', msg.text())); 
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message)); 
  await page.goto('http://[::1]:5173/product/sos-plus-sensitive-night-cream', {waitUntil: 'networkidle2'}); 
  
  const rootContent = await page.evaluate(() => {
    return document.querySelector('#root').innerHTML.substring(0, 500);
  });
  console.log('Root Content snippet:', rootContent);
  
  await browser.close(); 
})();
