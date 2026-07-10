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

    // Map products to categories
    const sampleProducts = products.map((product) => {
      const categoryMatch = createdCategories.find(c => product.slug.includes(c.slug) || (product.slug === 'luminous-hydration-serum' && c.slug === 'skin-care') || (product.slug === 'botanical-repair-shampoo' && c.slug === 'hair-care') || (product.slug === 'velvet-rose-body-butter' && c.slug === 'body-care') || (product.slug === 'midnight-amber-eau-de-parfum' && c.slug === 'fragrance') || (product.slug === 'silk-sleep-mask-pillowcase-set' && c.slug === 'wellness') || (product.slug === 'ultimate-glow-gift-set' && c.slug === 'gift-sets'));
      
      return { 
        ...product, 
        user: adminUser,
        category: categoryMatch ? categoryMatch._id : createdCategories[0]._id 
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
