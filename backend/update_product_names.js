import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';

dotenv.config();

const updates = [
  { slug: 'product-28', name: 'Deep Moisture Balancing Fluid' },
  { slug: 'product-29', name: 'Skinonym Semi-Matte Peptide Foundation' },
  { slug: 'product-30', name: 'Skin Equal Soft Glow Foundation' },
  { slug: 'product-31', name: 'Deep Moisture Vitamin Oil' },
  { slug: 'product-32', name: 'Deep Moisture Eye Contour Cream' },
  { slug: 'product-33', name: 'Deep Moisture Balancing Fluid' },
  { slug: 'product-34', name: 'Deep Moisture Night Cream' },
  { slug: 'product-35', name: 'The Concealer' },
  { slug: 'product-36', name: 'Skinonym Semi-Matte Peptide Foundation' },
  { slug: 'product-37', name: 'Superseed Age Recovery Facial Oil' },
  { slug: 'product-38', name: 'Derma Collagen Peptide Night Cream' },
  { slug: 'product-39', name: 'Derma Collagen Peptide Day Cream' },
  { slug: 'product-40', name: 'Age Pro Contour Wrinkle Eye Cream' },
  { slug: 'product-41', name: 'Age Pro Renew Night Cream' },
  { slug: 'product-42', name: 'Age Pro Smooth Day Cream' },
  { slug: 'product-43', name: 'Derma Collagen Peptide Serum' },
  { slug: 'product-44', name: 'Age Pro Hydra Firm Hyaluron Jelly' },
  { slug: 'product-45', name: 'Creamy Clay AHA Peel Mask' }
];

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  for (const update of updates) {
    await Product.updateOne({ slug: update.slug }, { $set: { name: update.name } });
  }
  console.log('Finished updating product names based on images.');
  process.exit(0);
};

run();
