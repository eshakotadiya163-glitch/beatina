import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';
import connectDB from './config/db.js';

dotenv.config();

const fixImage = async () => {
  try {
    await connectDB();
    const product = await Product.findOne({ name: "Brightening AHA Peel Mask" });
    if (product) {
      const restoredImage = {
        url: "/images/products/brightening-aha-peel-mask/hover.png",
        altText: "Brightening AHA Peel Mask applied"
      };
      
      // Insert at index 1
      product.images.splice(1, 0, restoredImage);
      await product.save();
      console.log("Restored the second image for Brightening AHA Peel Mask.");
    } else {
      console.log("Product not found.");
    }
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

fixImage();
