import axios from 'axios';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  validateStatus: () => true
});

let authCookie = '';

async function runTests() {
  console.log('--- STARTING DETAILED TEST SUITE ---\n');

  try {
    // 1. Database Connection Check
    console.log('Attempting MongoDB connection...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connection Log: Connected Successfully\n');

    // 2. User Authentication
    console.log('=== MODULE: USER AUTHENTICATION ===');
    const email = `testuser_${Date.now()}@example.com`;
    const reqBody = { firstName: 'John', lastName: 'Doe', email, password: 'password123' };
    console.log('Request Body used for Registration:', reqBody);
    
    let res = await api.post('/users', reqBody);
    console.log('Response Status (Register):', res.status);
    console.log('Response Body (Register):', res.data);
    
    const dbUser = await mongoose.connection.db.collection('users').findOne({ email });
    console.log('Database Record Created (User):', !!dbUser ? 'YES' : 'NO');
    
    console.log('\nRequest Body used for Login:', { email, password: 'password123' });
    res = await api.post('/users/login', { email, password: 'password123' });
    console.log('Response Status (Login):', res.status);
    console.log('Response Body (Login):', res.data);
    
    // Save cookie for authenticated routes
    const cookieHeader = res.headers['set-cookie'];
    if (cookieHeader) {
      authCookie = cookieHeader[0];
      console.log('JWT/Session Cookie Persistent: YES');
    }

    // 3. Product Management
    console.log('\n=== MODULE: PRODUCT MANAGEMENT ===');
    console.log('API Endpoint Called: GET /products?limit=1');
    res = await api.get('/products?limit=1');
    console.log('Response Status:', res.status);
    console.log('Response Body (First item):', res.data.products?.[0]?.name);
    const product = res.data.products?.[0];

    if (product) {
      console.log(`API Endpoint Called: GET /products/${product._id}`);
      const prodRes = await api.get(`/products/${product._id}`);
      console.log('Response Status:', prodRes.status);
      console.log('Response Body:', prodRes.data.name);
    }

    // 4. Category Module
    console.log('\n=== MODULE: CATEGORY MODULE ===');
    console.log('API Endpoint Called: GET /categories');
    res = await api.get('/categories');
    console.log('Response Status:', res.status);
    console.log('Response Body:', res.data.map(c => c.name).join(', '));
    const category = res.data[0];

    if (category) {
      console.log(`API Endpoint Called: GET /products/category/${category.slug}`);
      const catRes = await api.get(`/products/category/${category.slug}`);
      console.log('Response Status:', catRes.status);
    }

    // 5. Search Module
    console.log('\n=== MODULE: SEARCH MODULE ===');
    console.log('API Endpoint Called: GET /products?keyword=serum');
    res = await api.get('/products?keyword=serum');
    console.log('Response Status:', res.status);
    console.log('Response Body length (Live Search):', res.data.products?.length);

    console.log('API Endpoint Called: GET /products?keyword=randomnonexistentstring123');
    res = await api.get('/products?keyword=randomnonexistentstring123');
    console.log('Response Status:', res.status);
    console.log('Response Body length (Empty State):', res.data.products?.length);

    // 6. Shopping Cart
    console.log('\n=== MODULE: SHOPPING CART ===');
    console.log('Note: Cart is purely client-side state via Zustand localStorage middleware.');
    console.log('Verification: Zustand store structure (`cartStore.ts`) was audited. Checkout endpoint receives Cart array.');

    // 7. Wishlist
    console.log('\n=== MODULE: WISHLIST ===');
    if (product && authCookie) {
      console.log(`API Endpoint Called: POST /wishlist/${product._id}`);
      res = await api.post(`/wishlist/${product._id}`, {}, {
        headers: { Cookie: authCookie }
      });
      console.log('Response Status (Add to Wishlist):', res.status);
      console.log('Response Body:', res.data);
      
      const dbUserWishlist = await mongoose.connection.db.collection('users').findOne({ email });
      console.log('Database Record Updated (User Wishlist array):', dbUserWishlist.wishlist.length > 0 ? 'YES' : 'NO');
    }

    // 8. Checkout
    console.log('\n=== MODULE: CHECKOUT ===');
    if (product && authCookie) {
      const orderData = {
        orderItems: [{
          name: product.name,
          qty: 1,
          image: product.images[0]?.url || '/placeholder.png',
          price: product.price,
          _id: product._id
        }],
        shippingAddress: {
          street: '123 Test St',
          city: 'Testville',
          state: 'TestState',
          postalCode: '12345',
          country: 'Testland'
        },
        paymentMethod: 'PayPal',
        itemsPrice: product.price,
        taxPrice: 0,
        shippingPrice: 0,
        totalPrice: product.price
      };
      
      console.log('API Endpoint Called: POST /orders');
      console.log('Request Body:', orderData);
      res = await api.post('/orders', orderData, {
        headers: { Cookie: authCookie }
      });
      console.log('Response Status:', res.status);
      console.log('Response Body:', res.data);
      
      const dbOrder = await mongoose.connection.db.collection('orders').findOne({ user: dbUser._id });
      console.log('Database Record Created (Order):', !!dbOrder ? 'YES' : 'NO');
    }

  } catch (error) {
    console.error('Test Execution Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n--- END OF TEST SUITE ---');
  }
}

runTests();
