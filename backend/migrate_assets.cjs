const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const dirsToSearch = [
  'E:\\aura collection',
  'C:\\Users\\eshak\\.gemini\\antigravity',
  'C:\\Users\\eshak\\Downloads',
  'C:\\Users\\eshak\\Desktop'
];
const ignoreDirs = ['node_modules', '.git', 'dist', 'build', '.tempmediaStorage']; 
const allowedExts = ['.jpg', '.jpeg', '.png', '.webp', '.avif', '.mp4'];
const destBase = 'E:\\aura collection\\frontend\\public\\assets';

const subDirs = ['hero', 'products', 'collections', 'banners', 'before-after', 'blog', 'videos', 'instagram', 'testimonials', 'icons'];
subDirs.forEach(d => {
  const p = path.join(destBase, d);
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
});

let foundImages = [];
let duplicatesCount = 0;
let renamedCount = 0;
let copiedCount = 0;
let mappedProducts = 0;

const productsFile = 'E:\\aura collection\\backend\\data\\products.js';
let productsRaw = fs.readFileSync(productsFile, 'utf8');
let products = [];
try {
  const match = productsRaw.match(/const products = (\[[\s\S]*?\]);/);
  if (match) {
    products = eval(match[1]); 
  } else {
    const match2 = productsRaw.match(/export default (\[[\s\S]*?\]);/);
    if (match2) products = eval(match2[1]);
  }
} catch (e) {
  console.log("Error parsing products.js", e);
}

// 1. Search Files
function searchDir(dir) {
  try {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      if (ignoreDirs.includes(file)) continue;
      const fullPath = path.join(dir, file);
      try {
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
          searchDir(fullPath);
        } else {
          const ext = path.extname(file).toLowerCase();
          if (allowedExts.includes(ext)) {
            if (fullPath.replace(/\\/g, '/').includes('/frontend/public/assets/')) continue;
            foundImages.push({ name: file, path: fullPath, size: stat.size, ext: ext });
          }
        }
      } catch (e) {}
    }
  } catch (e) {}
}

dirsToSearch.forEach(searchDir);

// 2. Deduplicate
const uniqueImages = new Map();
foundImages.forEach(img => {
  const hash = `${img.size}_${img.name}`;
  if (uniqueImages.has(hash)) {
    duplicatesCount++;
  } else {
    uniqueImages.set(hash, img);
  }
});
const processedImages = Array.from(uniqueImages.values());

// 3. Categorize & Map
function slugify(text) {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-') 
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-') 
    .replace(/^-+/, '') 
    .replace(/-+$/, '');
}

function isGarbageName(name) {
  return name.startsWith('media__') || name.startsWith('Screenshot') || name.startsWith('diff_') || name.startsWith('crop');
}

let modifiedProducts = 0;
const missingImagesList = [];

for (let p of products) {
  const keywords = p.name.toLowerCase().split(' ').filter(w => w.length > 2);
  const slug = p.slug || slugify(p.name);
  
  let primaryMatch = null;
  let hoverMatch = null;
  let galleryMatches = [];
  
  for (const img of processedImages) {
    if (isGarbageName(img.name)) continue;
    
    const imgName = img.name.toLowerCase();
    const isMatch = imgName.includes(slug) || keywords.some(k => imgName.includes(k));
    
    if (isMatch) {
      if (!primaryMatch && (imgName.includes('front') || imgName.includes('main'))) {
        primaryMatch = img;
      } else if (!hoverMatch && (imgName.includes('hover') || imgName.includes('hand') || imgName.includes('back'))) {
        hoverMatch = img;
      } else {
        galleryMatches.push(img);
      }
    }
  }
  
  if (!primaryMatch && galleryMatches.length > 0) primaryMatch = galleryMatches.shift();
  if (!hoverMatch && galleryMatches.length > 0) hoverMatch = galleryMatches.shift();
  
  const processMatch = (matchObj, suffix) => {
    if (!matchObj) return null;
    const newName = `${slug}-${suffix}${matchObj.ext}`;
    const destPath = path.join(destBase, 'products', newName);
    const webPath = `/assets/products/${newName}`;
    fs.copyFileSync(matchObj.path, destPath);
    copiedCount++;
    renamedCount++;
    return webPath;
  };

  const primaryUrl = processMatch(primaryMatch, 'main');
  const hoverUrl = processMatch(hoverMatch, 'hover');
  const galUrls = galleryMatches.slice(0,4).map((m, i) => processMatch(m, `gallery-${i+1}`));

  let hasUpdates = false;
  
  let newImagesArr = [];
  if (primaryUrl) newImagesArr.push({ url: primaryUrl, altText: p.name });
  if (hoverUrl) newImagesArr.push({ url: hoverUrl, altText: `${p.name} Hover` });
  galUrls.forEach((u, i) => newImagesArr.push({ url: u, altText: `${p.name} Gallery ${i+1}` }));
  
  if (newImagesArr.length > 0) {
    p.images = newImagesArr;
    hasUpdates = true;
  }
  
  if (primaryUrl || p.image) {
    p.image = primaryUrl || (typeof p.image === 'string' ? p.image : p.image.url || '');
  }

  // Fallback map fixing for existing arrays of strings if no update was made
  if (p.images && p.images.length > 0 && typeof p.images[0] === 'string') {
    p.images = p.images.map(url => ({ url, altText: p.name }));
    hasUpdates = true;
  }

  if (hasUpdates) {
    modifiedProducts++;
  }
  
  let currentImg = Array.isArray(p.images) && p.images[0] ? p.images[0].url : (p.image || '');
  if (!currentImg || currentImg.includes('shopify') || currentImg.includes('http') || (Array.isArray(p.images) && p.images.length < 2)) {
    missingImagesList.push(p.name);
  }
}

// 4. Update products.js
const updatedProductsString = `const products = ${JSON.stringify(products, null, 2)};\n\nexport default products;`;
fs.writeFileSync(productsFile, updatedProductsString, 'utf8');

console.log("--- FINAL REPORT ---");
console.log(`Images found: ${foundImages.length}`);
console.log(`Duplicates removed: ${duplicatesCount}`);
console.log(`Images copied: ${copiedCount}`);
console.log(`Images renamed: ${renamedCount}`);
console.log(`Products mapped: ${modifiedProducts}`);
console.log(`Products missing full assets: ${missingImagesList.length}`);
if (missingImagesList.length > 0) {
  console.log("Missing/Incomplete Products:");
  missingImagesList.forEach(m => console.log(` - ${m}`));
}
