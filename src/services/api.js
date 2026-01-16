
import axios from 'axios';

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://volunteer-wct-api.onrender.com';
if (!process.env.NEXT_PUBLIC_API_BASE_URL && typeof window !== 'undefined') {
  // Dev-friendly warning to ensure environment is configured
  console.warn('[api] NEXT_PUBLIC_API_BASE_URL not set. Using default:', baseURL);
}

export const api = axios.create({
  baseURL,
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token =
    typeof window !== 'undefined'
      ? window.localStorage.getItem('token')
      : null;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Fallback: if backend doesn't use '/api' prefix, retry once without it on 404
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error?.response?.status;
    const cfg = error?.config;
    const url = cfg?.url;
    const isApiPrefixed = typeof url === 'string' && url.startsWith('/api/');
    if (status === 404 && isApiPrefixed && !cfg._retry) {
      cfg._retry = true;
      cfg.url = url.replace(/^\/api\//, '/');
      try {
        return await api.request(cfg);
      } catch (e) {
        throw e;
      }
    }
    throw error;
  }
);

export default api;
