import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';
import connectDB from './config/db.js';

dotenv.config();

const fixPrice = async () => {
  try {
    await connectDB();
    const result = await Product.updateMany(
      { name: { $regex: /Derma Collagen Peptide Serum/i } },
      { $set: { price: 5500 } }
    );
    console.log("Updated Derma Collagen Peptide Serum:", result);
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

fixPrice();
