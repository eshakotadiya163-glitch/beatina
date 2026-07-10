const fs = require('fs');
const cheerio = require('cheerio');
const html = fs.readFileSync('beautina_real_unlocked.html', 'utf-8');
const $ = cheerio.load(html);

// We need to find the product tabs.
// The actual tabs are inside .shopify-section.template--21198444855396__product-tab
// There are multiple tab panels.
const tabContent = $('.tab-content .tab-pane');

const dbProducts = [];

tabContent.each((i, pane) => {
  const tabId = $(pane).attr('id'); // e.g. collection-1647413661159, collection-1647413662580
  let tabName = '';
  if (i === 0) tabName = 'New Arrivals';
  else if (i === 1) tabName = 'Best Sellers';
  else if (i === 2) tabName = 'Trending';
  else tabName = 'Other';

  $(pane).find('.product-card').each((j, card) => {
    const name = $(card).find('.product-card__name').text().trim();
    let priceText = $(card).find('.product-card__price').text().trim();
    priceText = priceText.replace(/[^\d]/g, ''); // Extract numbers
    const price = parseInt(priceText, 10) / 100 || 0; // assuming format is Rs. 5,900.00 -> 590000 -> 5900

    const imgEl = $(card).find('.first-image');
    let imgUrl = imgEl.attr('data-src') || imgEl.attr('src');
    if (imgUrl) imgUrl = imgUrl.replace('{width}', '800');

    // hover image
    const hoverImgEl = $(card).find('.second-image');
    let hoverUrl = hoverImgEl.attr('data-src') || hoverImgEl.attr('src');
    if (hoverUrl) hoverUrl = hoverUrl.replace('{width}', '800');

    dbProducts.push({
      name,
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + i + '-' + j,
      brand: 'MADARA COSMETICS',
      price: price,
      compareAtPrice: null, // will add if found
      tabCategory: tabName,
      images: [
        { url: imgUrl, altText: name },
        ...(hoverUrl ? [{ url: hoverUrl, altText: name + ' hover' }] : [])
      ],
      countInStock: 100,
      rating: 5,
      numReviews: 10
    });
  });
});

fs.writeFileSync('full_products.json', JSON.stringify(dbProducts, null, 2));
console.log('Saved to full_products.json');
