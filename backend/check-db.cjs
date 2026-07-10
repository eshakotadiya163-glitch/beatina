const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/the-woman-company').then(async () => {
  const db = mongoose.connection.db;
  const cats = await db.collection('categories').countDocuments();
  const total = await db.collection('products').countDocuments();
  const products = await db.collection('products').find({}).limit(10).toArray();
  
  console.log('Total Categories:', cats);
  console.log('Total Products:', total);
  products.forEach(p => console.log(`- ${p.name} | ${p.tabCategory} | Price: ${p.price} | Images: ${p.images.length}`));
  process.exit(0);
});
