import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';
import Category from '../models/Category.js';

dotenv.config();

const dbURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/aura-collection';

const seedCategories = async () => {
  try {
    await mongoose.connect(dbURI);
    console.log('MongoDB Connected');

    const categories = [
      { name: 'Skin Care', slug: 'skin-care', description: 'Nourish and protect your skin.' },
      { name: 'Hair Care', slug: 'hair-care', description: 'Revitalize your locks.' },
      { name: 'Body Care', slug: 'body-care', description: 'Full body hydration and care.' },
      { name: 'Fragrance', slug: 'fragrance', description: 'Captivating scents.' },
      { name: 'Wellness', slug: 'wellness', description: 'Inner health and wellness.' },
      { name: 'Sun Care', slug: 'sun-care', description: 'Protection against UV rays.' },
      { name: 'Makeup', slug: 'makeup', description: 'Enhance your natural beauty.' }
    ];

    console.log('Inserting Categories...');
    for (const cat of categories) {
      const exists = await Category.findOne({ slug: cat.slug });
      if (!exists) {
        await Category.create(cat);
      }
    }

    const allCategories = await Category.find({});
    const categoryMap = {};
    allCategories.forEach(c => {
      categoryMap[c.name.toLowerCase()] = c._id;
    });

    console.log('Updating Products...');
    const products = await Product.find({});
    
    for (const product of products) {
      let assignedCategory = categoryMap['skin care']; // Default

      const pName = product.name.toLowerCase();
      const pDesc = product.description.toLowerCase();
      
      if (pName.includes('hair') || pName.includes('shampoo')) assignedCategory = categoryMap['hair care'];
      else if (pName.includes('body') || pName.includes('lotion')) assignedCategory = categoryMap['body care'];
      else if (pName.includes('perfume') || pName.includes('fragrance')) assignedCategory = categoryMap['fragrance'];
      else if (pName.includes('sun') || pName.includes('spf')) assignedCategory = categoryMap['sun care'];
      else if (pName.includes('wellness') || pName.includes('tea')) assignedCategory = categoryMap['wellness'];
      else if (pName.includes('makeup') || pName.includes('lipstick')) assignedCategory = categoryMap['makeup'];

      // Assign the ObjectId
      product.category = assignedCategory;
      await product.save();
    }

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedCategories();
