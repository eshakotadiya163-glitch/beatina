import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';
import connectDB from './config/db.js';

dotenv.config();

const fixPrice = async () => {
  try {
    await connectDB();
    const result = await Product.updateMany(
      { name: { $regex: /Nourish and Repair Shampoo/i } },
      { $set: { price: 1500 } }
    );
    console.log("Updated Nourish and Repair Shampoo:", result);
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

fixPrice();
