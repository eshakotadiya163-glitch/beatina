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
      { name: { $regex: /SKINONYM SEMI-MATTE PEPTIDE FOUNDATION/i } },
      { $set: { price: 3900 } }
    );
    console.log("Updated SKINONYM SEMI-MATTE PEPTIDE FOUNDATION:", result1);

    // Update second product
    const result2 = await Product.updateMany(
      { name: { $regex: /SKIN EQUAL SOFT GLOW FOUNDATION/i } },
      { $set: { price: 8000 } }
    );
    console.log("Updated SKIN EQUAL SOFT GLOW FOUNDATION:", result2);

    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

fixPrice();
