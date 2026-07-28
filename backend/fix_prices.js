import fs from 'fs';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';

dotenv.config();

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const data = JSON.parse(fs.readFileSync('full_products.json', 'utf8'));
  const dbProducts = await Product.find({});
  let updatedCount = 0;

  for (const dbP of dbProducts) {
    // Attempt to find matching product in JSON
    // We can try exact name match first
    let match = data.find(p => p.name === dbP.name);
    
    // If not found, try slug match (without trailing "-0-0")
    if (!match) {
      match = data.find(p => dbP.slug && p.slug.startsWith(dbP.slug));
    }
    
    // If still not found, try partial name match (e.g., if one includes the other)
    if (!match) {
      match = data.find(p => p.name.includes(dbP.name) || dbP.name.includes(p.name));
    }

    if (match) {
      if (dbP.price !== match.price) {
        console.log(`Updating ${dbP.name}: ${dbP.price} -> ${match.price}`);
        dbP.price = match.price;
        if (match.compareAtPrice) dbP.compareAtPrice = match.compareAtPrice;
        await dbP.save();
        updatedCount++;
      }
    } else {
      console.log(`WARNING: No match found for DB product: ${dbP.name} (${dbP.slug})`);
    }
  }

  console.log(`Successfully updated prices for ${updatedCount} products.`);
  process.exit(0);
};

run();
