const fs = require('fs');
const cheerio = require('cheerio');
const html = fs.readFileSync('beautina_real_unlocked.html', 'utf-8');
const $ = cheerio.load(html);

// Find categories (they usually have .collection-list__item or similar)
$('.collection-list__item, .category, .cat-item, .collection-card').each((i, el) => {
  const name = $(el).text().trim().replace(/\n/g, ' ').replace(/\s+/g, ' ');
  const img = $(el).find('img').attr('data-src') || $(el).find('img').attr('src');
  console.log('Category:', name.substring(0, 50), '->', img);
});
