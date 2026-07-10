
const fs = require('fs');
let seedContent = fs.readFileSync('seedBeautina.cjs', 'utf-8');

const newArrivals = [
  'https://beautina-cosmetic.myshopify.com/cdn/shop/files/1-botanic-niacinamide-alternative-5-in-1-serum-A2223.jpg?v=1773123675&width=720',
  'https://beautina-cosmetic.myshopify.com/cdn/shop/files/1-madara-niacinamide-alternative-travel-size-SM2223-15.jpg?v=1773123675&width=720',
  'https://beautina-cosmetic.myshopify.com/cdn/shop/files/1-brightening-5-aha-peel-mask-A2101.jpg?v=1773123676&width=720',
  'https://beautina-cosmetic.myshopify.com/cdn/shop/files/madara-brightening-aha-peel-mask-5ml-SC2101-5.jpg?v=1773123676&width=720',
  'https://beautina-cosmetic.myshopify.com/cdn/shop/files/1-creamy-clay-7-aha-peel-mask-A2105.jpg?v=1773123674&width=720',
  'https://beautina-cosmetic.myshopify.com/cdn/shop/files/madara-creamy-peel-aha-clay-mask-3ml-SC2105-3.jpg?v=1773123674&width=720',
  'https://beautina-cosmetic.myshopify.com/cdn/shop/files/1-exfoliating-oil-to-milk-scrub-A2151.jpg?v=1773123673&width=720',
  'https://beautina-cosmetic.myshopify.com/cdn/shop/files/2-oil-based-face-scrub-texture-A2151.jpg?v=1773123673&width=720'
];

const bestSellers = [
  'https://beautina-cosmetic.myshopify.com/cdn/shop/files/1-age-pro-intense-wrinkle-serum-A3340.jpg?v=1773123652&width=720',
  'https://beautina-cosmetic.myshopify.com/cdn/shop/files/madara-intense-wrinkle-serum-2ml-sample-SC3340-2.jpg?v=1773123651&width=720',
  'https://beautina-cosmetic.myshopify.com/cdn/shop/files/1-hydra-firm-hyaluron-jelly-A3342.jpg?v=1773123654&width=720',
  'https://beautina-cosmetic.myshopify.com/cdn/shop/files/madara-hydra-firm-hyaluron-jelly-2ml-sample-SC3342-2.jpg?v=1773123654&width=720',
  'https://beautina-cosmetic.myshopify.com/cdn/shop/files/1-madara-omega-3-6-9-concentrate-A3263.jpg?v=1773123671&width=720',
  'https://beautina-cosmetic.myshopify.com/cdn/shop/files/2-omega-concentrate-A3263.jpg?v=1773123670&width=720',
  'https://beautina-cosmetic.myshopify.com/cdn/shop/files/1-derma-collagen-peptides-serum-A3061.jpg?v=1773123657&width=720',
  'https://beautina-cosmetic.myshopify.com/cdn/shop/files/madara-derma-collagen-hydra-fill-firming-serum-2ml-SC3061-2.jpg?v=1773123657&width=720'
];

const trending = [
  'https://beautina-cosmetic.myshopify.com/cdn/shop/files/1-exfoliating-oil-to-milk-scrub-A2151.jpg?v=1773123673&width=720',
  'https://beautina-cosmetic.myshopify.com/cdn/shop/files/2-oil-based-face-scrub-texture-A2151.jpg?v=1773123673&width=720',
  'https://beautina-cosmetic.myshopify.com/cdn/shop/files/1-3-min-growth-boost-scalp-treatment-A4070.jpg?v=1773123686&width=720',
  'https://beautina-cosmetic.myshopify.com/cdn/shop/files/2-natural-hair-growth-booster-A4070.jpg?v=1773123685&width=720',
  'https://beautina-cosmetic.myshopify.com/cdn/shop/files/1-deep-moisture-eye-contour-cream-A2271.jpg?v=1773123678&width=720',
  'https://beautina-cosmetic.myshopify.com/cdn/shop/files/2-organic-eye-contour-cream-A2271.jpg?v=1773123678&width=720',
  'https://beautina-cosmetic.myshopify.com/cdn/shop/files/1-sos-rich-hydra-barrier-cica-cream-A3012.jpg?v=1773123663&width=720',
  'https://beautina-cosmetic.myshopify.com/cdn/shop/files/madara-sos-rich-hydra-barrier-cica-cream-2ml-SC3012-2.jpg?v=1773123663&width=720'
];

let pIndex = 0;
seedContent = seedContent.replace(/images: \[\{ url: p\.image, altText: p\.name \}\]/g, () => {
  let img1, img2;
  if (pIndex < 4) {
    img1 = newArrivals[pIndex * 2];
    img2 = newArrivals[pIndex * 2 + 1];
  } else if (pIndex < 8) {
    img1 = bestSellers[(pIndex - 4) * 2];
    img2 = bestSellers[(pIndex - 4) * 2 + 1];
  } else {
    img1 = trending[(pIndex - 8) * 2];
    img2 = trending[(pIndex - 8) * 2 + 1];
  }
  pIndex++;
  return \images: [{ url: '\', altText: p.name }, { url: '\', altText: p.name }]\;
});

fs.writeFileSync('seedBeautina.cjs', seedContent);
