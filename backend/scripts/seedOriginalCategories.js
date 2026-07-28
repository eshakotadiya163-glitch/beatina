import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';
import Category from '../models/Category.js';

dotenv.config();

const dbURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/aura-collection';

const seedOriginalCategories = async () => {
  try {
    await mongoose.connect(dbURI);
    console.log('MongoDB Connected');

    const originalCategories = [
      { name: 'SkinCare', slug: 'skin-care', image: '/images/migrated/15_highlight-icon-1.webp', description: 'Nourish and protect your skin.' },
      { name: 'Serum & Cream', slug: 'serum-cream', image: '/images/migrated/16_highlight-icon-2.webp', description: 'Advanced serums and creams.' },
      { name: 'Moisture Cream', slug: 'moisture-cream', image: '/images/migrated/17_highlight-icon-3.webp', description: 'Deep hydration for all skin types.' },
      { name: 'Hair Care', slug: 'hair-care', image: '/images/migrated/15_highlight-icon-1.webp', description: 'Revitalize your locks.' }, // Reused icon
      { name: 'Accessories', slug: 'accessories', image: '/images/migrated/16_highlight-icon-2.webp', description: 'Essential beauty tools.' } // Reused icon
    ];

    console.log('Wiping existing categories...');
    await Category.deleteMany({});

    console.log('Inserting Original Categories...');
    const createdCategories = await Category.insertMany(originalCategories);
    
    // Remap products back to these categories
    const categoryMap = {};
    createdCategories.forEach(c => {
      categoryMap[c.slug] = c._id;
    });

    console.log('Updating Products with new categories...');
    const products = await Product.find({});
    
    for (const product of products) {
      let assignedCategory = categoryMap['skin-care']; // Default

      const pName = product.name.toLowerCase();
      
      if (pName.includes('serum') || pName.includes('aha')) assignedCategory = categoryMap['serum-cream'];
      else if (pName.includes('moistur') || pName.includes('cream')) assignedCategory = categoryMap['moisture-cream'];
      else if (pName.includes('hair') || pName.includes('shampoo')) assignedCategory = categoryMap['hair-care'];
      else if (pName.includes('brush') || pName.includes('tool')) assignedCategory = categoryMap['accessories'];

      product.category = assignedCategory;
      await product.save();
    }

    console.log('Original categories restored and products mapped!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedOriginalCategories();
