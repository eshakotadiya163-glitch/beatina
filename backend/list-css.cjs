const fs = require('fs');
const cheerio = require('cheerio');

const html = fs.readFileSync('beautina_real_unlocked.html', 'utf-8');
const $ = cheerio.load(html);

const links = [];
$('link[rel="stylesheet"]').each((i, el) => {
  links.push($(el).attr('href'));
});
console.log(links.join('\n'));
