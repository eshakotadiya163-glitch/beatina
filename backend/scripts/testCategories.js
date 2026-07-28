import axios from 'axios';

const categories = [
  { name: 'SkinCare', slug: 'skin-care' },
  { name: 'Serum & Cream', slug: 'serum-cream' },
  { name: 'Moisture Cream', slug: 'moisture-cream' },
  { name: 'Hair Care', slug: 'hair-care' },
  { name: 'Accessories', slug: 'accessories' }
];

const testCategories = async () => {
  console.log('--- CATEGORY API TEST REPORT ---');
  for (const cat of categories) {
    try {
      const response = await axios.get(`http://localhost:5000/api/products/category/${cat.slug}`);
      const data = response.data;
      const productCount = data.products.length;
      console.log(`\nCategory Name: ${cat.name}`);
      console.log(`Number of products: ${productCount}`);
      console.log(`API response: 200 OK (Products: ${productCount}, Total Pages: ${data.pages})`);
      console.log(`Test result: PASS`);
    } catch (error) {
      console.log(`\nCategory Name: ${cat.name}`);
      console.log(`Number of products: N/A`);
      console.log(`API response: ${error.response ? error.response.status : error.message}`);
      console.log(`Test result: FAIL`);
    }
  }
  console.log('\n--- END OF REPORT ---');
};

testCategories();
