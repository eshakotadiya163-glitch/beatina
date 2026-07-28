const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const categorySchema = new mongoose.Schema({
  name: String,
  slug: String,
  image: String,
  description: String,
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

const Category = mongoose.models.Category || mongoose.model('Category', categorySchema);

mongoose.connect(process.env.MONGO_URI).then(async () => {
  console.log('Connected to DB');
  
  const result = await Category.updateOne(
    { slug: 'skincare' },
    { $set: { image: 'https://beautina-cosmetic.myshopify.com/cdn/shop/files/s1_1512x_bea7bc22-bd86-4362-83de-b0466c905009.jpg?v=1773124924' } }
  );
  
  console.log('Update result:', result);
  
  // also check if "skin-care" instead of "skincare" exists just in case
  const result2 = await Category.updateOne(
    { slug: 'skin-care' },
    { $set: { image: 'https://beautina-cosmetic.myshopify.com/cdn/shop/files/s1_1512x_bea7bc22-bd86-4362-83de-b0466c905009.jpg?v=1773124924' } }
  );
  
  console.log('Update result 2:', result2);

  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
});
