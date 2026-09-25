import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.DEV ? 'http://localhost:5000/api' : (import.meta.env.VITE_API_URL || '/api'),
  withCredentials: true, // Important for sending/receiving cookies (JWT)
});

export default api;
