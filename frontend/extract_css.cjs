const fs = require('fs');
const cheerio = require('cheerio');
const html = fs.readFileSync('collections.html', 'utf8');
const $ = cheerio.load(html);

// 1. Get exact style for collection card
const cardHtml = $('.collection-card').first().parent().html();
console.log("--- Collection Card HTML ---");
console.log(cardHtml);

// 2. Get exact HTML for the first product card
const productHtml = $('.product-card').first().parent().html();
console.log("\n--- Product Card HTML ---");
console.log(productHtml);

// 3. Find the CSS file links
const cssLinks = [];
$('link[rel="stylesheet"]').each((i, el) => {
  cssLinks.push($(el).attr('href'));
});
console.log("\n--- CSS Links ---");
console.log(cssLinks);
