const mongoose = require('mongoose');
const fs = require('fs');

const categories = [
  { name: 'Skin Care', slug: 'skin-care', image: 'https://beautina-cosmetic.myshopify.com/cdn/shop/files/5-omega-and-vitamin-e-oil-for-face-A2281.jpg?v=1773123679&width=200' },
  { name: 'Body Care', slug: 'body-care', image: 'https://beautina-cosmetic.myshopify.com/cdn/shop/files/2-nourish-and-repair-hair-care-A4051.jpg?v=1773123684&width=200' }, 
  { name: 'Hair Care', slug: 'hair-care', image: 'https://beautina-cosmetic.myshopify.com/cdn/shop/files/4_madara-cosmetics-grow-volume-shampoo-conditioner-boost-scalp-treatment-set.jpg?v=1773123689&width=200' }, 
  { name: 'Makeup', slug: 'makeup', image: 'https://beautina-cosmetic.myshopify.com/cdn/shop/files/5-madara-sos-skincare-A3021.jpg?v=1773123668&width=200' }, 
  { name: 'Face Care', slug: 'face-care', image: 'https://beautina-cosmetic.myshopify.com/cdn/shop/files/6-madara-his-collection-A5003.jpg?v=1773123669&width=200' },
  { name: 'Best Sellers', slug: 'best-sellers', image: 'https://beautina-cosmetic.myshopify.com/cdn/shop/files/gallery-3-v2.webp?v=1773124923&width=200' }
];

mongoose.connect('mongodb://127.0.0.1:27017/the-woman-company').then(async () => {
  try {
    const db = mongoose.connection.db;
    
    console.log('Clearing old products...');
    await db.collection('products').deleteMany({});
    
    console.log('Seeding categories...');
    await db.collection('categories').deleteMany({});
    const categoryDocs = await db.collection('categories').insertMany(categories);
    const skinCareId = Object.values(categoryDocs.insertedIds)[0];

    const products = JSON.parse(fs.readFileSync('full_products.json', 'utf-8'));
    
    // Add category ref to all products
    products.forEach(p => {
        p.category = skinCareId;
    });

    console.log(`Seeding ${products.length} products...`);
    await db.collection('products').insertMany(products);

    console.log('Database fully rebuilt!');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
});
