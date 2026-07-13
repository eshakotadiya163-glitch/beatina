const fs = require('fs');
const path = require('path');

const sourceDir = 'C:\\Users\\eshak\\OneDrive\\Pictures\\Screenshots\\products';
const destDirBase = 'E:\\aura collection\\frontend\\public\\assets\\products';
const productsJsPath = 'E:\\aura collection\\backend\\data\\products.js';

// Get current products
let productsContent = fs.readFileSync(productsJsPath, 'utf8');
// It starts with 'const products = [' and ends with '];\n\nexport default products;'
const jsonStr = productsContent.substring(
  productsContent.indexOf('['),
  productsContent.lastIndexOf('];') + 1
);
let products = [];
try {
  // Use eval to safely parse the JS array (since it has unquoted keys, etc.)
  products = eval(jsonStr);
} catch (e) {
  console.error("Failed to parse products.js", e);
  process.exit(1);
}

const numMap = {
  1: 'main.png',
  2: 'hover.png',
  3: 'gallery1.png',
  4: 'gallery2.png',
  5: 'gallery3.png',
  6: 'gallery4.png',
  7: 'gallery5.png'
};

const processed = new Set(products.map(p => p.slug));

let addedCount = 0;
let imageCount = 0;

for (let i = 28; i <= 45; i++) {
  const slug = `product-${i}`;
  const name = `Madara Product ${i}`;
  
  if (processed.has(slug)) continue;

  const productDestDir = path.join(destDirBase, slug);
  if (!fs.existsSync(productDestDir)) {
    fs.mkdirSync(productDestDir, { recursive: true });
  }

  const imagesArr = [];
  let mainUrl = '';

  for (let j = 1; j <= 7; j++) {
    const srcFile = path.join(sourceDir, `${i}.${j}.png`);
    const srcFile2 = path.join(sourceDir, `${i}.${j}.1.png`); // Some have .1
    
    let actualSrc = null;
    if (fs.existsSync(srcFile)) actualSrc = srcFile;
    else if (fs.existsSync(srcFile2)) actualSrc = srcFile2;
    // Some might just be named 2.png
    if (j === 1 && !actualSrc && fs.existsSync(path.join(sourceDir, `${i}.png`))) {
        actualSrc = path.join(sourceDir, `${i}.png`);
    }

    if (actualSrc) {
      const destName = numMap[j] || `gallery${j-2}.png`;
      const destFile = path.join(productDestDir, destName);
      fs.copyFileSync(actualSrc, destFile);
      
      const url = `/assets/products/${slug}/${destName}`;
      imagesArr.push({
        url,
        altText: `${name} image ${j}`
      });
      if (j === 1) mainUrl = url;
      imageCount++;
    }
  }

  if (imagesArr.length > 0) {
    products.push({
      name,
      slug,
      images: imagesArr,
      image: mainUrl,
      brand: "Madara",
      description: `Experience the luxury of our premium ${name}. Formulated with the finest ingredients to give you the ultimate skincare experience.`,
      ingredients: "Aqua, Premium Extracts, Essential Oils.",
      howToUse: "Apply as directed.",
      benefits: ["Premium Quality"],
      price: Math.floor(Math.random() * 50) + 30,
      countInStock: Math.floor(Math.random() * 100) + 10,
      rating: 4.8,
      numReviews: Math.floor(Math.random() * 200) + 10,
      isFeatured: false,
      category: "Skincare",
      tabCategory: "Trending"
    });
    addedCount++;
  }
}

const newContent = `const products = ${JSON.stringify(products, null, 2)};\n\nexport default products;\n`;
fs.writeFileSync(productsJsPath, newContent, 'utf8');

console.log('Successfully mapped ' + addedCount + ' new products and copied ' + imageCount + ' images.');
