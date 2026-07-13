import axios from 'axios';

const api = axios.create({
  baseURL: '/api', // Proxied through Vite dev server → http://localhost:5000/api
  withCredentials: true, // Important for sending/receiving cookies (JWT)
});

export default api;
