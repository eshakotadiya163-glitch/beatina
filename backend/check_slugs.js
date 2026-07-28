import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';

dotenv.config();

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const products = await Product.find({ name: { $regex: /roll-on|serum|fluid|boost|cream|mask/i } }).limit(10);
  console.log(products.map(p => ({name: p.name, slug: p.slug})));
  process.exit(0);
};

run();
