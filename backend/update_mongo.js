import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const db = mongoose.connection.useDb('aura_collection');
  const categories = db.collection('categories');
  const result = await categories.updateOne({slug: 'hair-care'}, {$set: {image: 'https://beautina-cosmetic.myshopify.com/cdn/shop/files/1-madara-gloss-and-vibrancy-shampoo-A4003.jpg?v=1773123683&width=720'}});
  console.log('Update Result:', result);
  process.exit(0);
};

run();
