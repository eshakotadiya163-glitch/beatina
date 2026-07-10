const mongoose = require('mongoose');

const categories = [
  { name: 'Skin Care', slug: 'skin-care', image: 'https://beautina-cosmetic.myshopify.com/cdn/shop/files/c1.jpg?v=1773123847&width=300' },
  { name: 'Body Care', slug: 'body-care', image: 'https://beautina-cosmetic.myshopify.com/cdn/shop/files/c2.jpg?v=1773123847&width=300' }, 
  { name: 'Hair Care', slug: 'hair-care', image: 'https://beautina-cosmetic.myshopify.com/cdn/shop/files/c3.jpg?v=1773123848&width=300' }, 
  { name: 'Fragrance', slug: 'fragrance', image: 'https://beautina-cosmetic.myshopify.com/cdn/shop/files/c4.jpg?v=1773123847&width=300' }, 
  { name: 'Wellness', slug: 'wellness', image: 'https://beautina-cosmetic.myshopify.com/cdn/shop/files/c5.jpg?v=1773123848&width=300' } 
];

const products = [
  // ===================== NEW ARRIVALS =====================
  {
    name: 'Niacinamide Alternative 5-in-1 Serum',
    vendor: 'MADARA COSMETICS',
    price: 2200,
    compareAtPrice: 2500, // Make it look like a sale item if applicable
    tabCategory: 'New Arrivals',
    images: [
      'https://beautina-cosmetic.myshopify.com/cdn/shop/files/1-botanic-niacinamide-alternative-5-in-1-serum-A2223.jpg?v=1773123675&width=800',
      'https://beautina-cosmetic.myshopify.com/cdn/shop/files/1-madara-niacinamide-alternative-travel-size-SM2223-15.jpg?v=1773123675&width=800'
    ]
  },
  {
    name: 'Brightening AHA Peel Mask',
    vendor: 'MADARA COSMETICS',
    price: 100,
    tabCategory: 'New Arrivals',
    images: [
      'https://beautina-cosmetic.myshopify.com/cdn/shop/files/1-brightening-5-aha-peel-mask-A2101.jpg?v=1773123676&width=800',
      'https://beautina-cosmetic.myshopify.com/cdn/shop/files/madara-brightening-aha-peel-mask-5ml-SC2101-5.jpg?v=1773123676&width=800'
    ]
  },
  {
    name: 'Creamy Clay AHA Peel Mask',
    vendor: 'MADARA COSMETICS',
    price: 100,
    tabCategory: 'New Arrivals',
    images: [
      'https://beautina-cosmetic.myshopify.com/cdn/shop/files/1-creamy-clay-7-aha-peel-mask-A2105.jpg?v=1773123674&width=800',
      'https://beautina-cosmetic.myshopify.com/cdn/shop/files/madara-creamy-peel-aha-clay-mask-3ml-SC2105-3.jpg?v=1773123674&width=800'
    ]
  },
  {
    name: 'Exfoliating Oil-To-Milk Scrub',
    vendor: 'MADARA COSMETICS',
    price: 2600,
    tabCategory: 'New Arrivals',
    images: [
      'https://beautina-cosmetic.myshopify.com/cdn/shop/files/1-exfoliating-oil-to-milk-scrub-A2151.jpg?v=1773123673&width=800',
      'https://beautina-cosmetic.myshopify.com/cdn/shop/files/2-oil-based-face-scrub-texture-A2151.jpg?v=1773123673&width=800'
    ]
  },
  {
    name: 'Clarifying Toner',
    vendor: 'MADARA COSMETICS',
    price: 1900,
    tabCategory: 'New Arrivals',
    images: [
      'https://beautina-cosmetic.myshopify.com/cdn/shop/files/1-madara-clarifying-toner-A2051.jpg?v=1773123673&width=800',
      'https://beautina-cosmetic.myshopify.com/cdn/shop/files/2-cosmos-natural-exfoliating-toner-A2051.jpg?v=1773123673&width=800'
    ]
  },
  {
    name: 'Spot Roll-On',
    vendor: 'MADARA COSMETICS',
    price: 1500,
    tabCategory: 'New Arrivals',
    images: [
      'https://beautina-cosmetic.myshopify.com/cdn/shop/files/1-madara-acne-spot-roll-on-A2103.jpg?v=1773123672&width=800',
      'https://beautina-cosmetic.myshopify.com/cdn/shop/files/2-salicylic-acid-treatment-A2103.jpg?v=1773123673&width=800'
    ]
  },
  {
    name: 'Sebum Control Clear Skin Wash',
    vendor: 'MADARA COSMETICS',
    price: 2100,
    tabCategory: 'New Arrivals',
    images: [
      'https://beautina-cosmetic.myshopify.com/cdn/shop/files/1-sebum-control-clear-skin-wash-A2004.jpg?v=1773123671&width=800',
      'https://beautina-cosmetic.myshopify.com/cdn/shop/files/2-acne-cleansing-treatment-A2004.jpg?v=1773123671&width=800'
    ]
  },
  {
    name: 'Omega 3-6-9 Concentrate',
    vendor: 'MADARA COSMETICS',
    price: 2000,
    tabCategory: 'New Arrivals',
    images: [
      'https://beautina-cosmetic.myshopify.com/cdn/shop/files/1-madara-omega-3-6-9-concentrate-A3263.jpg?v=1773123671&width=800',
      'https://beautina-cosmetic.myshopify.com/cdn/shop/files/2-omega-concentrate-A3263.jpg?v=1773123670&width=800'
    ]
  },

  // ===================== BEST SELLERS =====================
  {
    name: 'Intense Wrinkle Serum',
    vendor: 'MADARA COSMETICS',
    price: 100,
    tabCategory: 'Best Sellers',
    images: [
      'https://beautina-cosmetic.myshopify.com/cdn/shop/files/1-age-pro-intense-wrinkle-serum-A3340.jpg?v=1773123652&width=800',
      'https://beautina-cosmetic.myshopify.com/cdn/shop/files/madara-intense-wrinkle-serum-2ml-sample-SC3340-2.jpg?v=1773123651&width=800'
    ]
  },
  {
    name: 'Hydra Firm Hyaluron Jelly',
    vendor: 'MADARA COSMETICS',
    price: 100,
    tabCategory: 'Best Sellers',
    images: [
      'https://beautina-cosmetic.myshopify.com/cdn/shop/files/1-hydra-firm-hyaluron-jelly-A3342.jpg?v=1773123654&width=800',
      'https://beautina-cosmetic.myshopify.com/cdn/shop/files/madara-hydra-firm-hyaluron-jelly-2ml-sample-SC3342-2.jpg?v=1773123654&width=800'
    ]
  },
  {
    name: 'Omega 3-6-9 Concentrate',
    vendor: 'MADARA COSMETICS',
    price: 2000,
    tabCategory: 'Best Sellers',
    images: [
      'https://beautina-cosmetic.myshopify.com/cdn/shop/files/1-madara-omega-3-6-9-concentrate-A3263.jpg?v=1773123671&width=800',
      'https://beautina-cosmetic.myshopify.com/cdn/shop/files/2-omega-concentrate-A3263.jpg?v=1773123670&width=800'
    ]
  },
  {
    name: 'Peptide Serum',
    vendor: 'MADARA COSMETICS',
    price: 100,
    tabCategory: 'Best Sellers',
    images: [
      'https://beautina-cosmetic.myshopify.com/cdn/shop/files/1-derma-collagen-peptides-serum-A3061.jpg?v=1773123657&width=800',
      'https://beautina-cosmetic.myshopify.com/cdn/shop/files/madara-derma-collagen-hydra-fill-firming-serum-2ml-SC3061-2.jpg?v=1773123657&width=800'
    ]
  },
  {
    name: 'Smooth Day Cream',
    vendor: 'MADARA COSMETICS',
    price: 100,
    tabCategory: 'Best Sellers',
    images: [
      'https://beautina-cosmetic.myshopify.com/cdn/shop/files/1-age-pro-smooth-day-cream-A3330.jpg?v=1773123655&width=800',
      'https://beautina-cosmetic.myshopify.com/cdn/shop/files/madara-smooth-day-cream-2ml-sample-SC3330-2.jpg?v=1773123655&width=800'
    ]
  },
  {
    name: 'Renew Night Cream',
    vendor: 'MADARA COSMETICS',
    price: 100,
    tabCategory: 'Best Sellers',
    images: [
      'https://beautina-cosmetic.myshopify.com/cdn/shop/files/1-age-pro-night-cream-A3335.jpg?v=1773123653&width=800',
      'https://beautina-cosmetic.myshopify.com/cdn/shop/files/madara-renew-night-cream-2ml-sample-SC3335-2.jpg?v=1773123652&width=800'
    ]
  },
  {
    name: 'Contour Wrinkle Eye Cream',
    vendor: 'MADARA COSMETICS',
    price: 100,
    tabCategory: 'Best Sellers',
    images: [
      'https://beautina-cosmetic.myshopify.com/cdn/shop/files/1-contour-wrinkle-eye-cream-A3343.jpg?v=1773123652&width=800',
      'https://beautina-cosmetic.myshopify.com/cdn/shop/files/madara-contour-wrinkle-eye-cream-1.5ml-sample-SC3343-1.5.jpg?v=1773123652&width=800'
    ]
  },
  {
    name: 'Peptide Day Cream',
    vendor: 'MADARA COSMETICS',
    price: 4200,
    tabCategory: 'Best Sellers',
    images: [
      'https://beautina-cosmetic.myshopify.com/cdn/shop/files/1-madara-derma-collagen-peptide-day-cream.jpg?v=1773123651&width=800',
      'https://beautina-cosmetic.myshopify.com/cdn/shop/files/2-collagen-boosting-day-cream.jpg?v=1773123650&width=800'
    ]
  },
  {
    name: 'Peptide Night Cream',
    vendor: 'MADARA COSMETICS',
    price: 100,
    tabCategory: 'Best Sellers',
    images: [
      'https://beautina-cosmetic.myshopify.com/cdn/shop/files/derma-collagen-peptide-night-cream-madara-a3062.jpg?v=1773123650&width=800',
      'https://beautina-cosmetic.myshopify.com/cdn/shop/files/1-night-source-sleeping-cream-madara-A3062.jpg?v=1773123650&width=800'
    ]
  },
  {
    name: 'Age Recovery Facial Oil',
    vendor: 'MADARA COSMETICS',
    price: 5900,
    tabCategory: 'Best Sellers',
    images: [
      'https://beautina-cosmetic.myshopify.com/cdn/shop/files/1-superseed-age-recovery-oil-30ml-A2603.jpg?v=1773123649&width=800',
      'https://beautina-cosmetic.myshopify.com/cdn/shop/files/2-anti-age-recovery-treatment-A2603.jpg?v=1773123649&width=800'
    ]
  },

  // ===================== TRENDING (Shop The Look) =====================
  {
    name: '3-Min Growth-Boost Scalp Treatment',
    vendor: 'MADARA COSMETICS',
    price: 4000,
    tabCategory: 'Trending',
    images: [
      'https://beautina-cosmetic.myshopify.com/cdn/shop/files/1-3-min-growth-boost-scalp-treatment-A4070.jpg?v=1773123686&width=800',
      'https://beautina-cosmetic.myshopify.com/cdn/shop/files/2-natural-hair-growth-booster-A4070.jpg?v=1773123685&width=800'
    ]
  },
  {
    name: 'Deep Moisture Eye Contour Cream',
    vendor: 'MADARA COSMETICS',
    price: 3200,
    tabCategory: 'Trending',
    images: [
      'https://beautina-cosmetic.myshopify.com/cdn/shop/files/1-deep-moisture-eye-contour-cream-A2271.jpg?v=1773123678&width=800',
      'https://beautina-cosmetic.myshopify.com/cdn/shop/files/2-organic-eye-contour-cream-A2271.jpg?v=1773123678&width=800'
    ]
  }
];

async function seed() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/the-woman-company');
    const db = mongoose.connection.db;

    console.log('Seeding categories...');
    await db.collection('categories').deleteMany({});
    
    const insertedCategories = {};
    for (const cat of categories) {
      const res = await db.collection('categories').insertOne({ ...cat, createdAt: new Date(), updatedAt: new Date() });
      insertedCategories[cat.name] = res.insertedId;
    }

    console.log('Seeding products...');
    await db.collection('products').deleteMany({});
    
    const enrichedProducts = products.map(p => {
      const catId = insertedCategories['Skin Care'];
      const baseSlug = p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      const slug = baseSlug + '-' + p.tabCategory.toLowerCase().replace(/ /g, '-');
      return {
        name: p.name,
        slug: slug,
        brand: p.vendor,
        price: p.price,
        compareAtPrice: p.compareAtPrice || null,
        tabCategory: p.tabCategory, 
        category: catId,
        images: p.images.map(url => ({ url, altText: p.name })),
        description: p.name + ' description',
        countInStock: 100,
        rating: 5,
        numReviews: 12,
        createdAt: new Date(),
        updatedAt: new Date()
      };
    });
    
    await db.collection('products').insertMany(enrichedProducts);

    console.log('Seeding complete! Total products:', enrichedProducts.length);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

seed();
