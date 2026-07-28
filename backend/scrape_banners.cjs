const puppeteer = require('puppeteer');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const categorySchema = new mongoose.Schema({
  name: String,
  slug: String,
  image: String
}, { strict: false });

const Category = mongoose.models.Category || mongoose.model('Category', categorySchema);

const categories = ['serum-cream', 'moisture-cream', 'hair-care', 'accessories'];

(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to DB');

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  // Login
  await page.goto('https://beautina-cosmetic.myshopify.com/password', { waitUntil: 'networkidle2' });
  try {
    const pwdInput = await page.$('input[type="password"]');
    if (pwdInput) {
      await page.type('input[type="password"]', '1');
      await page.click('button[type="submit"]');
      await page.waitForNavigation({ waitUntil: 'networkidle2' });
    }
  } catch(e) {}

  for (const cat of categories) {
    const url = `https://beautina-cosmetic.myshopify.com/collections/${cat}`;
    console.log(`Scraping ${url}...`);
    await page.goto(url, { waitUntil: 'networkidle2' });
    
    const imageSrc = await page.evaluate(() => {
      const img = document.querySelector('.collection-hero img');
      return img ? img.getAttribute('src') : null;
    });

    if (imageSrc) {
      let finalSrc = imageSrc;
      if (finalSrc.startsWith('//')) {
        finalSrc = 'https:' + finalSrc;
      }
      // Remove responsive ?width= parameters if they exist, or keep original
      console.log(`Found image for ${cat}:`, finalSrc);
      await Category.updateOne({ slug: cat }, { $set: { image: finalSrc } });
      console.log(`Updated DB for ${cat}`);
    } else {
      console.log(`No hero image found for ${cat}`);
    }
  }

  await browser.close();
  process.exit(0);
})();
