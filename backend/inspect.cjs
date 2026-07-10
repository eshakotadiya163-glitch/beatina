const fs = require('fs');
const cheerio = require('cheerio');
const html = fs.readFileSync('beautina_real_unlocked.html', 'utf-8');
const $ = cheerio.load(html);

// Find a product by title
const card = $('.card__heading:contains("Niacinamide")').closest('.card-wrapper');
if (card.length > 0) {
  console.log('--- CARD HTML ---');
  console.log($.html(card));
} else {
  // Let's just grab any card
  const c = $('div[class*="card"]').first();
  console.log($.html(c));
}
