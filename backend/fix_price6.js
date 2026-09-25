import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';
import connectDB from './config/db.js';

dotenv.config();

const fixPrice = async () => {
  try {
    await connectDB();
    
    const updates = [
      { name: /SOS Hydra Repair Intensive Serum/i, price: 2020 },
      { name: /SOS Hydra Recharge Cream/i, price: 3000 },
      { name: /Vitamin C Illuminating Recovery Cream/i, price: 2500 },
      { name: /Brightening AHA Peel Mask/i, price: 4000 }
    ];

    for (const update of updates) {
      const result = await Product.updateMany(
        { name: { $regex: update.name } },
        { $set: { price: update.price } }
      );
      console.log(`Updated ${update.name}:`, result);
    }

    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

fixPrice();
