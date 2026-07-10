import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const STORE_URL = 'https://beautina-cosmetic.myshopify.com';
const PASSWORD = '1';

async function scrape() {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  });

  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36');
  await page.setViewport({ width: 1440, height: 900 });

  const output = {
    scrapedAt: new Date().toISOString(),
    products: [],
    collections: [],
    homepage: {},
  };

  try {
    // Step 1: Visit the password page
    console.log('Navigating to storefront...');
    await page.goto(STORE_URL + '/password', { waitUntil: 'domcontentloaded', timeout: 30000 });
    console.log('Page title:', await page.title());

    // Step 2: Enter password
    const passwordInput = await page.$('input[type="password"], input[name="password"]');
    if (passwordInput) {
      console.log('Password form found, submitting...');
      await passwordInput.type(PASSWORD);
      await Promise.all([
        page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 20000 }),
        page.keyboard.press('Enter'),
      ]);
      console.log('After login URL:', page.url());
    } else {
      console.log('No password form, trying submit button...');
      const submitBtn = await page.$('button[type="submit"], input[type="submit"]');
      if (submitBtn) await submitBtn.click();
      await page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 20000 });
    }

    // Step 3: Fetch products.json using page context (inherits cookies)
    console.log('Fetching products.json...');
    const productsText = await page.evaluate(async (url) => {
      const r = await fetch(url + '/products.json?limit=250');
      return r.text();
    }, STORE_URL);

    try {
      const parsed = JSON.parse(productsText);
      output.products = parsed.products || [];
      console.log(`Found ${output.products.length} products`);
    } catch {
      console.log('Could not parse products.json. First 300 chars:', productsText.substring(0, 300));
    }

    // Save products immediately
    fs.writeFileSync(path.join(__dirname, 'shopify_data.json'), JSON.stringify(output, null, 2));
    console.log('Products saved.');

    // Step 4: Fetch collections.json
    console.log('Fetching collections.json...');
    const collectionsText = await page.evaluate(async (url) => {
      const r = await fetch(url + '/collections.json?limit=250');
      return r.text();
    }, STORE_URL);

    try {
      const parsed = JSON.parse(collectionsText);
      output.collections = parsed.collections || [];
      console.log(`Found ${output.collections.length} collections`);
    } catch {
      console.log('Could not parse collections.json');
    }

    // Save after collections
    fs.writeFileSync(path.join(__dirname, 'shopify_data.json'), JSON.stringify(output, null, 2));

    // Step 5: Extract full product details per product (images, etc.)
    console.log('Fetching individual product details...');
    const enriched = [];
    for (const p of output.products.slice(0, 60)) {
      try {
        const txt = await page.evaluate(async (url, handle) => {
          const r = await fetch(`${url}/products/${handle}.json`);
          return r.text();
        }, STORE_URL, p.handle);
        const parsed = JSON.parse(txt);
        enriched.push(parsed.product || p);
        process.stdout.write('.');
      } catch {
        enriched.push(p);
      }
    }
    console.log(`\nEnriched ${enriched.length} products`);
    output.products = enriched;

    // Save enriched products
    fs.writeFileSync(path.join(__dirname, 'shopify_data.json'), JSON.stringify(output, null, 2));

    // Step 6: Navigate to homepage and scrape visual data
    console.log('Navigating to homepage for visual scraping...');
    try {
      await page.goto(STORE_URL, { waitUntil: 'domcontentloaded', timeout: 45000 });
      await new Promise(r => setTimeout(r, 3000)); // let JS run

      const homepageData = await page.evaluate(() => {
        const data = {
          title: document.title,
          announcement: '',
          navLinks: [],
          heroImages: [],
          sectionHeadings: [],
          allImages: [],
          faqs: [],
          testimonials: [],
          footerLinks: [],
          colors: {},
          fonts: [],
        };

        // Announcement bar
        const announceSelectors = [
          '.announcement-bar',
          '[class*="announcement"]',
          '.marquee',
          '[class*="marquee"]',
          '[data-section-type="announcement-bar"]',
        ];
        for (const sel of announceSelectors) {
          const el = document.querySelector(sel);
          if (el && el.innerText.trim()) { data.announcement = el.innerText.trim(); break; }
        }

        // Navigation links
        document.querySelectorAll('nav a, header nav a, .site-nav a').forEach(a => {
          const text = a.innerText.trim();
          if (text && text.length < 50) data.navLinks.push({ text, href: a.href });
        });

        // All CDN images (hero banners, promotional banners, etc.)
        document.querySelectorAll('img').forEach(img => {
          const src = img.src || img.dataset.src || img.dataset.lazySrc || '';
          if (src && (src.includes('cdn.shopify') || src.includes('shopify'))) {
            data.allImages.push({
              src,
              alt: img.alt || '',
              width: img.naturalWidth || img.width,
              height: img.naturalHeight || img.height,
              classList: img.className,
              parentSection: img.closest('[data-section-type], section, .shopify-section')?.dataset?.sectionType || '',
            });
          }
        });

        // Background images from CSS
        document.querySelectorAll('[style*="background-image"]').forEach(el => {
          const match = el.style.backgroundImage.match(/url\(['"](.*?)['"]\)/);
          if (match && match[1].includes('shopify')) {
            data.allImages.push({ src: match[1], alt: '', isBackground: true });
          }
        });

        // Section headings
        document.querySelectorAll('h1, h2, h3, h4').forEach(h => {
          const text = h.innerText.trim();
          if (text && text.length < 200) data.sectionHeadings.push({ tag: h.tagName, text });
        });

        // FAQs
        document.querySelectorAll('[class*="faq"], [data-section*="faq"]').forEach(el => {
          const q = el.querySelector('summary, [class*="question"], h3, h4');
          const a = el.querySelector('[class*="answer"], [class*="content"], p');
          if (q) data.faqs.push({ question: q.innerText.trim(), answer: a?.innerText.trim() || '' });
        });

        // Testimonials
        document.querySelectorAll('[class*="testimonial"], [class*="review"], [class*="quote"]').forEach(el => {
          const text = el.innerText.trim();
          if (text && text.length > 20) data.testimonials.push(text);
        });

        // Footer links
        document.querySelectorAll('footer a').forEach(a => {
          const text = a.innerText.trim();
          if (text) data.footerLinks.push({ text, href: a.href });
        });

        // Extract CSS colors
        const style = getComputedStyle(document.body);
        data.colors = {
          background: style.backgroundColor,
          color: style.color,
        };

        // Fonts
        document.querySelectorAll('link[href*="fonts.googleapis"]').forEach(l => {
          data.fonts.push(l.href);
        });

        return data;
      });

      output.homepage = homepageData;
      console.log(`Homepage images: ${homepageData.allImages.length}`);
      console.log(`Nav links: ${homepageData.navLinks.length}`);
      console.log(`Section headings: ${homepageData.sectionHeadings.length}`);
      console.log(`FAQs: ${homepageData.faqs.length}`);

    } catch (err) {
      console.log('Homepage scraping error (non-fatal):', err.message);
    }

    // Final save
    fs.writeFileSync(path.join(__dirname, 'shopify_data.json'), JSON.stringify(output, null, 2));
    console.log('\n✅ Data saved to shopify_data.json');
    console.log(`Products: ${output.products.length}`);
    console.log(`Collections: ${output.collections.length}`);

    // Print first product sample
    if (output.products[0]) {
      const p = output.products[0];
      console.log('\nFirst product:');
      console.log('  Title:', p.title);
      console.log('  Handle:', p.handle);
      console.log('  Price:', p.variants?.[0]?.price);
      console.log('  Images:', p.images?.length);
      console.log('  First image URL:', p.images?.[0]?.src?.substring(0, 80));
    }

    if (output.homepage.sectionHeadings) {
      console.log('\nHomepage headings:', output.homepage.sectionHeadings.slice(0, 10).map(h => h.text));
    }

  } catch (err) {
    console.error('Fatal error:', err.message);
    // Save whatever we have
    fs.writeFileSync(path.join(__dirname, 'shopify_data.json'), JSON.stringify(output, null, 2));
    console.log('Partial data saved to shopify_data.json');
  } finally {
    await browser.close();
  }
}

scrape();
