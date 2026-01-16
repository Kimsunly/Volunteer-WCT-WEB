
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

// Fallback: if backend doesn't use '/api' prefix or has trailing slash issues, retry
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error?.response?.status;
    const cfg = error?.config;
    let url = cfg?.url;
    if (!url || cfg._retry) throw error;

    // Fix 1: Trailing slash issue (Common in FastAPI)
    if ((status === 404 || status === 405) && url.endsWith('/')) {
      cfg._retry = true;
      cfg.url = url.slice(0, -1);
      try {
        return await api.request(cfg);
      } catch (e) {
        throw e;
      }
    }

    // Fix 2: /api prefix issue
    const isApiPrefixed = typeof url === 'string' && url.startsWith('/api/');
    if (status === 404 && isApiPrefixed) {
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
