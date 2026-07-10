const fs = require('fs');
const cheerio = require('cheerio');
const html = fs.readFileSync('beautina_real_unlocked.html', 'utf8');
const $ = cheerio.load(html);
console.log($('.slideshow__text-wrap--desktop .slideshow__text-content').first().html());
