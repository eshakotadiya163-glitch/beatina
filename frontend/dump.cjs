const fs = require('fs');
const cheerio = require('cheerio');
const $ = cheerio.load(fs.readFileSync('skincare.html', 'utf8'));

// Get the full product card HTML
const firstCard = $('.product-card').first();
console.log('=== FIRST PRODUCT CARD FULL HTML ===\n');
console.log(firstCard.html());

console.log('\n=== PRODUCT INFO SECTION ===\n');
const info = firstCard.find('.product-card__info');
console.log(info.html());

console.log('\n=== HERO BANNER ===\n');
const hero = $('.collection-hero');
console.log('Hero class:', hero.attr('class'));
const heroBg = $('[class*="collection-hero"]').first();
console.log('Hero element count:', $('[class*="collection-hero"]').length);
$('[class*="collection-hero"]').each((i, el) => {
  console.log(`  ${i}: class=${$(el).attr('class')}, style=${$(el).attr('style')}`);
});
