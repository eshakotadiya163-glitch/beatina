import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';

dotenv.config();

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const slugs = ['acne-spot-roll-on', 'scalp-peel-serum', 'deep-moisture-balancing-fluid', 'boost-3-min-growth-boost-scalp-treatment', 'deep-moisture-nourish-cream-for-face'];
  const products = await Product.find({ slug: { $in: slugs } });
  console.log(products.map(p => p.slug));
  process.exit(0);
};

run();
