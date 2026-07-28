const fs = require('fs');
const html = fs.readFileSync('beautina_real_unlocked.html', 'utf8');

const regex = /<a[^>]+class="[^"]*product-card__name[^"]*"[^>]*>([^<]+)<\/a>/g;
let match;
const products = new Set();
while ((match = regex.exec(html)) !== null) {
  products.add(match[1].trim());
}

console.log(Array.from(products));
