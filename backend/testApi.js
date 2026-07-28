import http from 'http';

const data = JSON.stringify({
  email: 'admin@example.com',
  password: '123456'
});

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/users/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, res => {
  let responseData = '';
  res.on('data', chunk => { responseData += chunk; });
  res.on('end', () => {
    console.log(`STATUS: ${res.statusCode}`);
    console.log(`BODY: ${responseData}`);
  });
});

req.on('error', error => { console.error(error); });
req.write(data);
req.end();
