const fs = require('fs');
const cheerio = require('cheerio');
const html = fs.readFileSync('collections.html', 'utf8');
const $ = cheerio.load(html);

$('*').each((i, el) => {
  if (el.tagName === 'svg' || el.tagName === 'script' || el.tagName === 'style') {
    $(el).remove();
  }
});

const mainContent = $('#MainContent').html() || $('main').html() || '';
console.log("----- Main Content HTML Snippet -----");
console.log(mainContent.substring(0, 4000));
