import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';

dotenv.config();

const dbURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/aura-collection';

mongoose.connect(dbURI).then(async () => {
  const products = await Product.find({}, 'name slug images');
  console.log('\n--- ALL PRODUCTS WITH IMAGES ---');
  products.forEach(p => {
    console.log(p.name + ' (' + p.slug + ') -> ' + (p.images && p.images.length > 0 ? p.images[0] : 'no-image'));
  });
  process.exit();
}).catch(console.error);
