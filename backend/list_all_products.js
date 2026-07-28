import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';

dotenv.config();

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const products = await Product.find({});
  console.log(JSON.stringify(products.map(p => ({
    name: p.name,
    slug: p.slug,
    image: p.images && p.images[0] ? p.images[0].url : 'none'
  })), null, 2));
  process.exit(0);
};

run();
