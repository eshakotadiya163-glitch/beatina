const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/the-woman-company');

// We can dynamically define a generic schema just to update all documents in the 'products' collection
const productSchema = new mongoose.Schema({}, { strict: false });
const Product = mongoose.model('Product', productSchema, 'products');

async function updatePrices() {
  try {
    const products = await Product.find({});
    let count = 0;
    
    for (const prod of products) {
      const doc = prod.toObject();
      let updated = false;
      
      // Assume prices are currently in USD (< 1000). If already > 1000, maybe they are already INR.
      // But we will force conversion just to be sure. Wait, some prices are 48, some might be 4000.
      if (doc.price && doc.price < 500) { 
        prod.set('price', Math.round(doc.price * 83));
        updated = true;
      }
      
      if (doc.compareAtPrice && doc.compareAtPrice < 500) {
        prod.set('compareAtPrice', Math.round(doc.compareAtPrice * 83));
        updated = true;
      }
      
      if (updated) {
        await prod.save();
        count++;
      }
    }
    
    console.log(`Updated ${count} products to INR prices.`);
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

updatePrices();
