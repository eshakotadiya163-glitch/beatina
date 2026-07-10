import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const STORE_URL = 'https://beautina-cosmetic.myshopify.com';
const PASSWORD = '1';

async function scrapeMainContent() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();
  
  try {
    // Login
    await page.goto(STORE_URL + '/password', { waitUntil: 'domcontentloaded' });
    const pwInput = await page.$('input[name="password"]');
    if (pwInput) {
      await pwInput.type(PASSWORD);
      await Promise.all([page.waitForNavigation(), page.keyboard.press('Enter')]);
    }

    const pagesToScrape = [
      { url: '/pages/contact', name: 'contact_main.html' },
      { url: '/pages/about-us', name: 'about_main.html' }
    ];

    for (const p of pagesToScrape) {
      await page.goto(STORE_URL + p.url, { waitUntil: 'domcontentloaded' });
      
      const mainHtml = await page.evaluate(() => {
        const main = document.querySelector('main');
        // Clean up some noisy elements
        main.querySelectorAll('script, style, svg').forEach(el => el.remove());
        return main ? main.innerHTML : 'No main found';
      });
      
      fs.writeFileSync(path.join(__dirname, p.name), mainHtml);
    }
  } catch(err) {
    console.error('Error:', err.message);
  } finally {
    await browser.close();
  }
}

scrapeMainContent();
