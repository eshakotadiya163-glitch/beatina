import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const realNames = [
  'Age Recovery Facial Oil',
  'After Shave Serum for Men',
  'Clarifying Toner',
  'Contour Wrinkle Eye Cream',
  'Day Cream',
  'Custom Actives',
  'Face Cream for Men',
  'Spot Roll-On',
  'Hydra Moisture+Radiance Mask',
  'Gloss and Vibrancy Shampoo',
  'Gloss and Vibrancy Conditioner',
  'Colour and Shine Shampoo',
  'Colour and Shine Conditioner',
  'Grow Volume Hair Care Set for Fuller, Stronger Hair',
  '3-Step Hair Care Set for Thinning Hair',
  '3-Step Hair Care Routine for Fuller, Stronger Hair',
  'Peptide Day Cream',
  'Peptide Night cream',
  'Hydra Firm Hyaluron Jelly',
  'Peptide Serum',
  'Smooth Day Cream',
  'Renew Night Cream',
  'Eye Contour Cream'
];

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/beautina')
  .then(async () => {
    console.log('Connected to MongoDB');
    
    // Assume Product is exported as default from Product.js
    const Product = (await import('./models/Product.js')).default;
    
    const products = await Product.find({});
    
    // Find products ending in a number (the dummy ones)
    const dummyProducts = products.filter(p => /\d+$/.test(p.name));
    
    console.log(`Found ${dummyProducts.length} dummy products`);
    
    let index = 0;
    for (const product of dummyProducts) {
      if (index < realNames.length) {
        const newName = realNames[index];
        console.log(`Updating ${product.name} -> ${newName}`);
        
        // Also update slug to be safe
        const slug = newName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        
        await Product.updateOne(
          { _id: product._id }, 
          { $set: { name: newName, slug: slug } }
        );
        index++;
      }
    }
    
    console.log('Done!');
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
