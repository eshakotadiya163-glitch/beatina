
const https = require('https');
const fs = require('fs');

https.get('https://beautina-cosmetic.myshopify.com/products.json?limit=250', (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
        fs.writeFileSync('shopify_products.json', data);
        console.log('Downloaded products data.');
    });
}).on('error', (err) => {
    console.error('Error: ', err.message);
});
