const fs = require('fs');
const cheerio = require('cheerio');
const html = fs.readFileSync('skincare.html', 'utf8');
const $ = cheerio.load(html);

console.log('--- Skincare Category Page ---');
console.log('Sidebar elements:', $('.sidebar').length);
console.log('Product cards:', $('.product-card').length);

const row = $('.row.grid--uniform').first();
console.log('Grid Classes:', row.attr('class'));
console.log('Columns inside grid:', row.children().first().attr('class'));

// Collection banner / header?
const header = $('.collection-header');
console.log('Header exists?', header.length > 0);
if(header.length > 0) {
  console.log('Header class:', header.attr('class'));
}

// Any collection description?
console.log('Description:', $('.collection-description').text().trim().substring(0, 50));
