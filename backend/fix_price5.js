import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';
import connectDB from './config/db.js';

dotenv.config();

const fixPrice = async () => {
  try {
    await connectDB();
    
    // Update first product
    const result1 = await Product.updateMany(
      { name: { $regex: /SOS Instant Hydra Mask/i } },
      { $set: { price: 3400 } }
    );
    console.log("Updated SOS Instant Hydra Mask:", result1);

    // Update second product
    const result2 = await Product.updateMany(
      { name: { $regex: /SOS\+ Rich Hydra-Barrier Cica Cream/i } },
      { $set: { price: 4420 } }
    );
    console.log("Updated SOS+ Rich Hydra-Barrier Cica Cream:", result2);

    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

fixPrice();
