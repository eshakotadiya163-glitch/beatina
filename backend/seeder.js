import mongoose from 'mongoose';
import dotenv from 'dotenv';
import users from './data/users.js';
import products from './data/products.js';
import categories from './data/categories.js';
import User from './models/User.js';
import Product from './models/Product.js';
import Category from './models/Category.js';
import Order from './models/Order.js';
import connectDB from './config/db.js';

dotenv.config();

connectDB();

const importData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await Category.deleteMany();
    await User.deleteMany();

    const createdUsers = await User.insertMany(users);
    const adminUser = createdUsers[0]._id;

    const createdCategories = await Category.insertMany(categories);

    // Helper to find category ID by slug
    const getCat = (slug) => createdCategories.find(c => c.slug === slug)?._id || createdCategories[0]._id;

    // Map products to categories
    const sampleProducts = products.map((product) => {
      const name = product.name.toLowerCase();
      let categoryId = getCat('skincare'); // default

      // Explicit overrides to exactly match Beautina's "Accessories" setup based on the screenshot
      if (
        name.includes('wrinkle') || 
        name.includes('actives') || 
        name.includes('peptide') || 
        name.includes('jelly') || 
        name.includes('smooth') ||
        name.includes('collagen') ||
        product.slug.includes('custom-actives')
      ) {
        categoryId = getCat('accessories');
      } 
      // Standard semantic matching for the rest
      else if (name.includes('hair') || name.includes('shampoo') || name.includes('scalp') || name.includes('conditioner')) {
        categoryId = getCat('hair-care');
      } 
      else if (name.includes('serum') || name.includes('oil') || name.includes('concentrate') || name.includes('fluid')) {
        categoryId = getCat('serum-cream');
      } 
      else if (name.includes('moisture') || name.includes('cream') || name.includes('butter') || name.includes('lotion') || name.includes('moisturiser')) {
        categoryId = getCat('moisture-cream');
      } 
      else if (name.includes('concealer') || name.includes('roller') || name.includes('bag') || name.includes('accessory')) {
        categoryId = getCat('accessories');
      }

      const mappedReviews = product.reviews ? product.reviews.map(r => ({...r, user: adminUser})) : [];

      return { 
        ...product, 
        user: adminUser,
        reviews: mappedReviews,
        category: categoryId
      };
    });

    await Product.insertMany(sampleProducts);

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await Category.deleteMany();
    await User.deleteMany();

    console.log('Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
