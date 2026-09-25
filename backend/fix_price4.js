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
      { name: { $regex: /DEEP MOISTURE BALANCING FLUID/i } },
      { $set: { price: 7000 } }
    );
    console.log("Updated DEEP MOISTURE BALANCING FLUID:", result1);

    // Update second product
    const result2 = await Product.updateMany(
      { name: { $regex: /DEEP MOISTURE NIGHT CREAM/i } },
      { $set: { price: 2000 } }
    );
    console.log("Updated DEEP MOISTURE NIGHT CREAM:", result2);

    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

fixPrice();
