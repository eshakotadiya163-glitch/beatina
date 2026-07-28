const fs = require('fs');

const fullProducts = JSON.parse(fs.readFileSync('full_products.json', 'utf8'));

// Extract current products from products.js (it exports an array, so we can require it if we modify it to CommonJS or just read it with regex/eval)
const productsJsContent = fs.readFileSync('data/products.js', 'utf8');
const productsMatch = productsJsContent.match(/const products = (\[[\s\S]*\]);\s*export default products;/);

if (!productsMatch) {
  console.error("Could not parse products.js");
  process.exit(1);
}

let products = eval(productsMatch[1]);

// Map full products by name
const priceMap = {};
fullProducts.forEach(fp => {
  priceMap[fp.name.toLowerCase().trim()] = {
    price: fp.price,
    compareAtPrice: fp.compareAtPrice
  };
});

let updatedCount = 0;
products = products.map(p => {
  const match = priceMap[p.name.toLowerCase().trim()];
  if (match) {
    p.price = match.price;
    p.compareAtPrice = match.compareAtPrice;
    updatedCount++;
  } else {
    // If not found by exact name, maybe search by partial name
    const partialMatch = fullProducts.find(fp => 
      p.name.toLowerCase().includes(fp.name.toLowerCase()) || 
      fp.name.toLowerCase().includes(p.name.toLowerCase())
    );
    if (partialMatch) {
      p.price = partialMatch.price;
      p.compareAtPrice = partialMatch.compareAtPrice;
      updatedCount++;
    } else {
      console.log('No price match found for:', p.name);
    }
  }
  return p;
});

console.log(`Updated prices for ${updatedCount} products.`);

const newContent = `const products = ${JSON.stringify(products, null, 2)};\n\nexport default products;\n`;
fs.writeFileSync('data/products.js', newContent);
console.log('Successfully updated data/products.js');
