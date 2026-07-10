const fs = require('fs');
const cheerio = require('cheerio');
const html = fs.readFileSync('beautina_real_unlocked.html', 'utf-8');
const $ = cheerio.load(html);

const products = [];
$('.product-card__info').each((i, el) => {
  products.push($(el).find('.product-card__name').text().trim());
});
console.log(products.join('\n'));
