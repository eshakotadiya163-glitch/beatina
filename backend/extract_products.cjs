const fs = require('fs');
const cheerio = require('cheerio');

const html = fs.readFileSync('beautina_home.html', 'utf-8');
const $ = cheerio.load(html);

const products = [];
let count = 0;

$('.grid__item').each((i, el) => {
  const title = $(el).find('.card__heading').text().trim();
  if (!title) return;

  const images = [];
  $(el).find('.media img').each((j, img) => {
    let src = $(img).attr('src') || $(img).attr('srcset');
    if (src) {
      src = src.split(' ')[0];
      if (src.startsWith('//')) src = 'https:' + src;
      if (src.startsWith('/cdn')) src = 'https://beautina-cosmetic.myshopify.com' + src;
      src = src.replace(/width=\d+/, 'width=800');
      images.push(src);
    }
  });
  
  if (images.length === 0) return;

  let vendor = $(el).find('.card-information__text').text().trim();
  
  let priceStr = $(el).find('.price-item--regular').text().replace(/[^0-9.]/g, '').trim();
  let compareStr = $(el).find('.price-item--sale').text().replace(/[^0-9.]/g, '').trim();
  if (!priceStr) {
      priceStr = $(el).find('.price-item--last').text().replace(/[^0-9.]/g, '').trim();
  }

  const price = priceStr ? parseFloat(priceStr) * 100 : 2000;
  let comparePrice = compareStr ? parseFloat(compareStr) * 100 : null;
  if (comparePrice && comparePrice < price) {
    comparePrice = null;
  }

  let tabCategory = 'New Arrivals';
  const sectionId = $(el).closest('.shopify-section').attr('id');
  if (sectionId && sectionId.includes('product-list')) {
    tabCategory = 'Best Sellers';
  } else if (sectionId && sectionId.includes('shop-the-look')) {
    tabCategory = 'Trending';
  } else {
    const tabPanel = $(el).closest('.tab-content');
    if (tabPanel.length > 0) {
      tabCategory = 'New Arrivals';
    }
  }

  products.push({
    name: title,
    slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-+$)/g, ''),
    vendor: vendor || 'MADARA COSMETICS',
    price: price,
    compareAtPrice: comparePrice,
    images: images.map(url => ({ url, altText: title })),
    tabCategory: tabCategory,
    category: tabCategory === 'Best Sellers' ? 'Skin Care' : 'Body Care',
    countInStock: 100,
    rating: 5,
    numReviews: 12
  });
});

fs.writeFileSync('extracted_exact_products.json', JSON.stringify(products, null, 2));
console.log('Extracted ' + products.length + ' products.');