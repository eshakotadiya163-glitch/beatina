import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const STORE_URL = 'https://the woman company-cosmetic.myshopify.com';
const PASSWORD = '1';

async function deepScrape() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36');

  try {
    // Login
    await page.goto(STORE_URL + '/password', { waitUntil: 'domcontentloaded', timeout: 30000 });
    const pwInput = await page.$('input[name="password"], input[type="password"]');
    if (pwInput) {
      await pwInput.type(PASSWORD);
      await Promise.all([page.waitForNavigation({ waitUntil: 'domcontentloaded' }), page.keyboard.press('Enter')]);
    }

    // Navigate to homepage
    console.log('Navigating to homepage...');
    await page.goto(STORE_URL, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await new Promise(r => setTimeout(r, 5000));

    // Get the entire page HTML for offline analysis
    const html = await page.content();
    fs.writeFileSync(path.join(__dirname, 'homepage.html'), html);
    console.log('HTML saved. Length:', html.length);

    // Extract detailed section data
    const data = await page.evaluate(() => {
      const result = {
        // Header
        logoText: '',
        logoImgSrc: '',
        navItems: [],
        megaMenu: {},

        // All sections in order
        sections: [],

        // All images with context
        images: [],

        // Text content
        allHeadings: [],
        allButtons: [],

        // Specific sections
        announcementText: '',
        beforeAfterImages: [],
        collectionsSection: [],
        bestSellersSection: [],
        recentPurchasePopup: {},
        faqItems: [],
        testimonialItems: [],
        instagramImages: [],
        blogPosts: [],
        footerContent: {},

        // CSS colors extracted
        cssColors: [],
        bodyBg: '',
        bodyColor: '',
      };

      // Logo
      const logoImg = document.querySelector('header img.logo-dark, header img[class*="logo"]');
      const logoText = document.querySelector('header [class*="logo-text"], .header__heading-link, header .logo');
      if (logoImg) result.logoImgSrc = logoImg.src;
      if (logoText) result.logoText = logoText.innerText.trim();

      // Try to get logo text from site title or header
      const siteNameEl = document.querySelector('[class*="site-name"], [class*="logo-name"], header h1, .header .logo');
      if (siteNameEl) result.logoText = siteNameEl.innerText.trim();

      // Announcement bar
      const annBar = document.querySelector('[class*="announcement"], .marquee__content, .ticker-tape');
      if (annBar) result.announcementText = annBar.innerText.trim().substring(0, 500);

      // Navigation items
      document.querySelectorAll('header nav > ul > li > a, .site-nav > li > a, .header__menu-item > a').forEach(el => {
        const text = el.innerText.trim();
        const href = el.href;
        if (text && text.length < 30) {
          result.navItems.push({ text, href });
        }
      });

      // Mega menu - categories column
      const catColumn = {};
      document.querySelectorAll('[class*="category"] a, [class*="mega"] [class*="category"] a').forEach(el => {
        const img = el.querySelector('img');
        catColumn[el.innerText.trim()] = {
          href: el.href,
          img: img?.src || '',
        };
      });
      result.megaMenu.categories = catColumn;

      // All sections in DOM order
      document.querySelectorAll('[data-section-type], .shopify-section, section').forEach((sec, i) => {
        const type = sec.dataset?.sectionType || sec.className?.split(' ')[0] || `section-${i}`;
        const heading = sec.querySelector('h1, h2, h3')?.innerText.trim();
        const imgs = Array.from(sec.querySelectorAll('img[src]')).map(img => ({
          src: img.src,
          alt: img.alt,
          width: img.naturalWidth || img.width,
          height: img.naturalHeight || img.height,
        }));
        const links = Array.from(sec.querySelectorAll('a')).map(a => ({
          text: a.innerText.trim(),
          href: a.href,
        })).filter(l => l.text);

        if (heading || imgs.length) {
          result.sections.push({
            type,
            heading,
            imgCount: imgs.length,
            firstImg: imgs[0]?.src || '',
            links: links.slice(0, 10),
          });
        }
      });

      // Before/After images
      document.querySelectorAll('[class*="before"], [class*="after"], [class*="compare"]').forEach(el => {
        const imgs = Array.from(el.querySelectorAll('img')).map(i => i.src);
        if (imgs.length) result.beforeAfterImages.push(...imgs);
      });

      // Collection images (sidebar)
      document.querySelectorAll('[class*="collection"] img, [class*="sidebar"] img').forEach(img => {
        result.collectionsSection.push({ src: img.src, alt: img.alt });
      });

      // Best sellers - extract product data from DOM
      document.querySelectorAll('[class*="product-card"], [class*="product-item"], .product-card').forEach(card => {
        const img = card.querySelector('img');
        const name = card.querySelector('[class*="title"], [class*="name"], h3, h2');
        const price = card.querySelector('[class*="price"]');
        const vendor = card.querySelector('[class*="vendor"]');
        if (name) {
          result.bestSellersSection.push({
            name: name.innerText.trim(),
            price: price?.innerText.trim(),
            vendor: vendor?.innerText.trim(),
            img: img?.src,
            img2: card.querySelector('img:nth-child(2)')?.src,
          });
        }
      });

      // All headings
      document.querySelectorAll('h1, h2, h3').forEach(h => {
        const text = h.innerText.trim();
        if (text && text.length < 200) result.allHeadings.push(text);
      });

      // All CTA buttons
      document.querySelectorAll('a[class*="btn"], button[class*="btn"], .button, a.btn').forEach(b => {
        const text = b.innerText.trim();
        if (text && text.length < 50) result.allButtons.push({ text, href: b.href });
      });

      // FAQ items
      document.querySelectorAll('[class*="accordion"] [class*="item"], details, [class*="faq"]').forEach(el => {
        const q = el.querySelector('summary, [class*="question"], [class*="title"]');
        const a = el.querySelector('[class*="content"], [class*="answer"], p');
        if (q) result.faqItems.push({ q: q.innerText.trim(), a: a?.innerText.trim() });
      });

      // Instagram/gallery images (square ones)
      document.querySelectorAll('[class*="instagram"] img, [class*="gallery"] img').forEach(img => {
        result.instagramImages.push({ src: img.src, alt: img.alt });
      });

      // Body bg/color
      result.bodyBg = getComputedStyle(document.body).backgroundColor;
      result.bodyColor = getComputedStyle(document.body).color;

      return result;
    });

    fs.writeFileSync(path.join(__dirname, 'homepage_detail.json'), JSON.stringify(data, null, 2));
    console.log('\n=== Scrape Results ===');
    console.log('Logo text:', data.logoText);
    console.log('Logo img:', data.logoImgSrc?.substring(0, 80));
    console.log('Nav items:', data.navItems.map(n => n.text).join(', '));
    console.log('Announcement:', data.announcementText?.substring(0, 100));
    console.log('Sections count:', data.sections.length);
    console.log('Headings:', data.allHeadings.slice(0, 10));
    console.log('Buttons:', data.allButtons.slice(0, 10).map(b => b.text));
    console.log('Before/After images:', data.beforeAfterImages.length);
    console.log('Best sellers from DOM:', data.bestSellersSection.length);
    console.log('FAQ items:', data.faqItems.length);
    console.log('Instagram images:', data.instagramImages.length);

    // Take a full-page screenshot for reference
    await page.setViewport({ width: 1440, height: 900 });
    await page.screenshot({
      path: path.join(__dirname, 'the woman company_screenshot.png'),
      fullPage: false,
    });
    console.log('Screenshot saved.');

  } catch(err) {
    console.error('Error:', err.message);
  } finally {
    await browser.close();
  }
}

deepScrape();
