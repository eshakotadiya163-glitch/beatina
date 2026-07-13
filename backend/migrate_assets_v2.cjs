const fs = require('fs');
const path = require('path');

const dirsToSearch = [
  'E:\\aura collection',
  'C:\\Users\\eshak\\.gemini\\antigravity',
  'C:\\Users\\eshak\\Downloads',
  'C:\\Users\\eshak\\Desktop'
];
const ignoreDirs = ['node_modules', '.git', 'dist', 'build', '.tempmediaStorage'];
const allowedExts = ['.jpg', '.jpeg', '.png', '.webp', '.avif'];
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
            // Check if it's already in the final dest
            if (fullPath.replace(/\\/g, '/').includes('/frontend/public/assets/')) continue;
            foundImages.push({ name: file, path: fullPath, size: stat.size, ext: ext });
          }
        }
      } catch (e) {}
    }
  } catch (e) {}
}

dirsToSearch.forEach(searchDir);

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

function slugify(text) {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-') 
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-') 
    .replace(/^-+/, '') 
    .replace(/-+$/, '');
}

function isGarbageName(name) {
  return name.startsWith('Screenshot') || name.startsWith('diff_') || name.startsWith('crop') || name.startsWith('localhost');
}

let modifiedProducts = 0;
const missingImagesList = [];
let totalImagesAssigned = 0;

for (let p of products) {
  const keywords = p.name.toLowerCase().split(' ').filter(w => w.length > 2);
  const slug = p.slug || slugify(p.name);
  
  let candidates = [];
  
  for (const img of processedImages) {
    if (isGarbageName(img.name)) continue;
    
    const imgName = img.name.toLowerCase();
    // High confidence matching: must contain exact slug OR >1 keywords, or specific filename matching logic
    // Actually, user says 300+ downloaded original images. Usually they are grouped by folders or named by product.
    const isMatch = imgName.includes(slug) || (keywords.length > 0 && keywords.some(k => imgName.includes(k)));
    
    if (isMatch) {
      candidates.push(img);
    }
  }
  
  // Try fallback logic if no direct match: If a folder name matches the slug
  if (candidates.length === 0) {
     for (const img of processedImages) {
       if (isGarbageName(img.name)) continue;
       const parentDir = path.basename(path.dirname(img.path)).toLowerCase();
       if (parentDir.includes(slug) || (keywords.length > 0 && keywords.some(k => parentDir.includes(k)))) {
         candidates.push(img);
       }
     }
  }
  
  if (candidates.length > 0) {
    const productDestFolder = path.join(destBase, 'products', slug);
    if (!fs.existsSync(productDestFolder)) fs.mkdirSync(productDestFolder, { recursive: true });
    
    let primaryMatch = null;
    let hoverMatch = null;
    let galleryMatches = [];
    
    // Sort candidates logically
    for (const img of candidates) {
      const imgName = img.name.toLowerCase();
      if (!primaryMatch && (imgName.includes('front') || imgName.includes('main') || imgName.includes('hero'))) {
        primaryMatch = img;
      } else if (!hoverMatch && (imgName.includes('hover') || imgName.includes('hand') || imgName.includes('back'))) {
        hoverMatch = img;
      } else {
        galleryMatches.push(img);
      }
    }
    
    if (!primaryMatch && galleryMatches.length > 0) primaryMatch = galleryMatches.shift();
    if (!hoverMatch && galleryMatches.length > 0) hoverMatch = galleryMatches.shift();
    
    let newImagesArr = [];
    
    const processMatch = (matchObj, suffix) => {
      if (!matchObj) return null;
      const newName = `${suffix}${matchObj.ext}`;
      const destPath = path.join(productDestFolder, newName);
      const webPath = `/assets/products/${slug}/${newName}`;
      fs.copyFileSync(matchObj.path, destPath);
      copiedCount++;
      renamedCount++;
      return webPath;
    };
    
    const primaryUrl = processMatch(primaryMatch, 'main');
    const hoverUrl = processMatch(hoverMatch, 'hover');
    
    if (primaryUrl) newImagesArr.push({ url: primaryUrl, altText: p.name });
    if (hoverUrl) newImagesArr.push({ url: hoverUrl, altText: `${p.name} Hover` });
    
    // As many gallery images as possible (gallery1, gallery2, gallery3...)
    galleryMatches.forEach((m, i) => {
       const u = processMatch(m, `gallery${i+1}`);
       if (u) newImagesArr.push({ url: u, altText: `${p.name} Gallery ${i+1}` });
    });
    
    if (newImagesArr.length > 0) {
      p.images = newImagesArr;
      p.image = primaryUrl;
      totalImagesAssigned += newImagesArr.length;
      modifiedProducts++;
    }
  }
  
  // Checking missing images
  if (!p.image || !p.images || p.images.length === 0 || p.image.includes('shopify') || p.image.includes('http')) {
    missingImagesList.push(p.name);
  }
}

// 4. Update products.js
const updatedProductsString = `const products = ${JSON.stringify(products, null, 2)};\n\nexport default products;`;
fs.writeFileSync(productsFile, updatedProductsString, 'utf8');

console.log("--- FINAL REPORT ---");
console.log(`Number of products: ${products.length}`);
console.log(`Number of images found: ${foundImages.length}`);
console.log(`Duplicates removed: ${duplicatesCount}`);
console.log(`Number copied: ${copiedCount}`);
console.log(`Number renamed: ${renamedCount}`);
console.log(`Number of products mapped: ${modifiedProducts}`);
console.log(`Number of products still missing images: ${missingImagesList.length}`);
console.log(`Images per product (average for mapped): ${modifiedProducts > 0 ? (totalImagesAssigned / modifiedProducts).toFixed(1) : 0}`);
if (missingImagesList.length > 0) {
  console.log("Products still missing images:");
  missingImagesList.forEach(m => console.log(` - ${m}`));
}
