import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const Product = mongoose.model('Product', new mongoose.Schema({}, { strict: false }));

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');
    
    const products = await Product.find({});
    let count = 0;
    
    for (const p of products) {
      let modified = false;
      const data = p.toObject();
      
      if (data.vendor && data.vendor.includes('Beautina')) {
        p.vendor = data.vendor.replace(/Beautina/g, 'The Woman Company');
        modified = true;
      }
      if (data.vendor && data.vendor.includes('BEAUTINA')) {
        p.vendor = data.vendor.replace(/BEAUTINA/g, 'THE WOMAN COMPANY');
        modified = true;
      }
      
      if (data.description && data.description.includes('Beautina')) {
        p.description = data.description.replace(/Beautina/g, 'The Woman Company');
        modified = true;
      }
      
      if (data.shortDescription && data.shortDescription.includes('Beautina')) {
        p.shortDescription = data.shortDescription.replace(/Beautina/g, 'The Woman Company');
        modified = true;
      }
      
      if (data.name && data.name.includes('Beautina')) {
        p.name = data.name.replace(/Beautina/g, 'The Woman Company');
        modified = true;
      }

      if (modified) {
        await p.save();
        count++;
      }
    }
    
    console.log(`Updated ${count} products in MongoDB.`);
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

connectDB();
