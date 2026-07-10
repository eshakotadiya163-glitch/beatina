import { chromium } from 'playwright';
import axios from 'axios';

async function checkImages() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
  
  // Wait a bit for lazy-loaded images
  await page.waitForTimeout(2000);
  
  const images = await page.$$eval('img', imgs => imgs.map(img => img.src));
  console.log(`Found ${images.length} images on the homepage.`);
  
  const brokenImages = [];
  
  for (const src of images) {
    if (!src) continue;
    try {
      // Don't check base64 images
      if (src.startsWith('data:')) continue;
      
      const response = await axios.get(src, {
        validateStatus: () => true // Resolve on all statuses
      });
      
      if (response.status >= 400) {
        brokenImages.push({ src, status: response.status });
      }
    } catch (error) {
      brokenImages.push({ src, error: error.message });
    }
  }
  
  if (brokenImages.length > 0) {
    console.log('\nBroken Images Found:');
    brokenImages.forEach(img => console.log(img));
  } else {
    console.log('\nAll images loaded correctly!');
  }
  
  await browser.close();
}

checkImages().catch(console.error);
