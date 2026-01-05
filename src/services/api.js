
import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 15000,
});

// Optional: attach JWT if you store it in a cookie or localStorage later.
api.interceptors.request.use((config) => {
  // Example (adjust to your auth strategy):
  // const token = localStorage.getItem('token');
  // if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
``
