
import axios from 'axios';

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
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
      ? (window.localStorage.getItem('authToken') || window.localStorage.getItem('token'))
      : null;
  if (token) config.headers.Authorization = `Bearer ${token}`;

  // Prepend /api prefix if missing
  let url = config.url;
  if (url && typeof url === 'string') {
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      if (!url.startsWith('/')) {
        url = '/' + url;
      }
      if (!url.startsWith('/api/') && url !== '/api') {
        config.url = '/api' + url;
      }
    }
  }

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

    // Fix 3: Handle 401 Unauthorized (Expired Token)
    if (status === 401 && !cfg._retry) {
      cfg._retry = true;
      const refreshToken = typeof window !== 'undefined' ? window.localStorage.getItem('refreshToken') : null;

      if (!refreshToken) {
        // No refresh token, clear everything and redirect if not on auth page
        window.localStorage.removeItem('authToken');
        window.localStorage.removeItem('token');
        window.localStorage.removeItem('refreshToken');
        document.cookie = "authToken=; path=/; max-age=0";
        document.cookie = "refreshToken=; path=/; max-age=0";

        if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/auth')) {
          window.location.href = '/auth/login';
        }
        throw error;
      }

      try {
        // Attempt to refresh token - Use correct endpoint /api/refresh (no /auth)
        const { data } = await axios.post(`${baseURL}/api/refresh`, {
          refresh_token: refreshToken
        });

        if (data.success && data.data.token) {
          const newToken = data.data.token;
          const newRefreshToken = data.data.refresh_token;

          window.localStorage.setItem('authToken', newToken);
          window.localStorage.setItem('token', newToken);
          document.cookie = `authToken=${newToken}; path=/; max-age=86400`;

          if (newRefreshToken) {
            window.localStorage.setItem('refreshToken', newRefreshToken);
            document.cookie = `refreshToken=${newRefreshToken}; path=/; max-age=86400`;
          }

          cfg.headers.Authorization = `Bearer ${newToken}`;
          return await axios(cfg);
        }
      } catch (refreshError) {
        // If refresh fails, clear auth and redirect to login
        window.localStorage.removeItem('authToken');
        window.localStorage.removeItem('token');
        window.localStorage.removeItem('refreshToken');
        document.cookie = "authToken=; path=/; max-age=0";
        document.cookie = "refreshToken=; path=/; max-age=0";

        // Prevent redirect loop if already on an auth page
        if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/auth')) {
          window.location.href = '/auth/login';
        }
      }
    }

    throw error;
  }
);

export default api;
