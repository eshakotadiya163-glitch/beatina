import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';
import connectDB from './config/db.js';

dotenv.config();

const fixPrice = async () => {
  try {
    await connectDB();
    const result = await Product.updateMany(
      { name: { $regex: /Creamy Clay AHA Peel Mask/i } },
      { $set: { price: 2700 } }
    );
    console.log("Updated Creamy Clay AHA Peel Mask:", result);
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

fixPrice();
