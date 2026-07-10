
const fs = require('fs');
const cheerio = require('cheerio');
const data = JSON.parse(fs.readFileSync('../brain/6187fdb0-666e-413f-9ccc-7086efe5ab29/scratch/sections-data.json', 'utf8'));

let products = [];
for (const [key, section] of Object.entries(data)) {
    let htmlContent = '';
    if (typeof section === 'string') htmlContent = section;
    else if (section && section.html) htmlContent = section.html;
    else continue;

    const $ = cheerio.load(htmlContent);
    .product-card.each((i, el) => {
        const title = .find('.product-card__name').text().trim() || .find('h3, .h4, a').text().trim();
        const brand = .find('.product-card__vendor').text().trim();
        let price = .find('.price').text().trim();
        const img = .find('img').attr('data-src') || .find('img').attr('src') || .find('img').attr('srcset');
        
        products.push({
            title,
            brand,
            price,
            img
        });
    });
}
console.log('Found', products.length, 'products');
console.log(JSON.stringify(products.slice(0, 5), null, 2));
