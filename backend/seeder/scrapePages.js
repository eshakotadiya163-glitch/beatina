import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const STORE_URL = 'https://beautina-cosmetic.myshopify.com';
const PASSWORD = '1';

async function scrapePages() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  try {
    // Login
    await page.goto(STORE_URL + '/password', { waitUntil: 'domcontentloaded', timeout: 30000 });
    const pwInput = await page.$('input[name="password"], input[type="password"]');
    if (pwInput) {
      await pwInput.type(PASSWORD);
      await Promise.all([page.waitForNavigation({ waitUntil: 'domcontentloaded' }), page.keyboard.press('Enter')]);
    }

    const pagesToScrape = [
      { url: '/pages/contact', name: 'contact' },
      { url: '/pages/about-us', name: 'about' },
      { url: '/policies/privacy-policy', name: 'privacy' },
    ];

    const results = {};

    for (const p of pagesToScrape) {
      console.log(`Scraping ${p.url}...`);
      await page.goto(STORE_URL + p.url, { waitUntil: 'domcontentloaded', timeout: 30000 });
      
      const data = await page.evaluate(() => {
        const headings = Array.from(document.querySelectorAll('h1, h2, h3')).map(h => h.innerText.trim()).filter(Boolean);
        const images = Array.from(document.querySelectorAll('main img')).map(img => img.src);
        const formFields = Array.from(document.querySelectorAll('form input, form textarea')).map(el => ({
          type: el.type || el.tagName.toLowerCase(),
          placeholder: el.placeholder,
          name: el.name
        }));
        const textContent = document.querySelector('main')?.innerText.trim().substring(0, 1000) || '';
        
        return { headings, images, formFields, textContent };
      });
      
      results[p.name] = data;
      await page.screenshot({ path: path.join(__dirname, `screenshot_${p.name}.png`), fullPage: true });
    }

    fs.writeFileSync(path.join(__dirname, 'pages_detail.json'), JSON.stringify(results, null, 2));
    console.log('Done!');
  } catch(err) {
    console.error('Error:', err.message);
  } finally {
    await browser.close();
  }
}

scrapePages();
