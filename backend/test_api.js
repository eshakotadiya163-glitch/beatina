import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  validateStatus: () => true
});

async function runTests() {
  console.log('Testing Authentication...');
  const regRes = await api.post('/users', {
    firstName: 'Test',
    lastName: 'User',
    email: `test${Date.now()}@example.com`,
    password: 'password123'
  });
  console.log('Registration:', regRes.status === 201 ? 'PASS' : 'FAIL', regRes.status);
  
  const loginRes = await api.post('/users/login', {
    email: regRes.data?.email,
    password: 'password123'
  });
  console.log('Login:', loginRes.status === 200 ? 'PASS' : 'FAIL');

  console.log('\nTesting Products...');
  const prodRes = await api.get('/products');
  console.log('Get Products:', prodRes.status === 200 ? 'PASS' : 'FAIL');
  
  if (prodRes.data.products && prodRes.data.products.length > 0) {
     const prodDetail = await api.get(`/products/${prodRes.data.products[0]._id}`);
     console.log('Product Details:', prodDetail.status === 200 ? 'PASS' : 'FAIL');
  }

  console.log('\nTesting Search...');
  const searchRes = await api.get('/products?keyword=serum');
  console.log('Search Products:', searchRes.status === 200 ? 'PASS' : 'FAIL');

  console.log('\nAll tests complete.');
}

runTests();
