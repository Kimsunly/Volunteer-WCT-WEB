// ============================================
// STEP 2: API Configuration
// File: src/lib/api.js
// ============================================

import axios from 'axios';
import Cookies from 'js-cookie';

// Backend API URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add token to all requests
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      Cookies.remove('access_token');
      Cookies.remove('user');
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// ============================================
// AUTH API FUNCTIONS
// ============================================

export const authAPI = {
  // Register new user
  register: async (userData) => {
    const response = await api.post('/api/auth/register', userData);
    return response.data;
  },

  // Login user
  // Supports both: login({ email, password }) or login(email, password)
  login: async (credentialsOrEmail, password) => {
    // Handle both function signatures
    let loginData;
    if (typeof credentialsOrEmail === 'string' && password) {
      // Called as login(email, password)
      loginData = { email: credentialsOrEmail, password };
    } else {
      // Called as login({ email, password })
      loginData = credentialsOrEmail;
    }

    // Send request
    const response = await api.post('/api/auth/login', loginData);
    
    // Debug: See exactly what the backend returned
    console.log("Backend Response:", response.data);

    // Extract Token (Check all possible paths)
    const token = response.data.access_token || 
                  response.data.token || 
                  response.data.session?.access_token;
    
    const user = response.data.user || response.data.session?.user;

    // Save to cookies if token exists
    if (token) {
      Cookies.set('access_token', token, { expires: 7, path: '/' });
      if (user) {
        Cookies.set('user', JSON.stringify(user), { expires: 7, path: '/' });
      }
      return response.data;
    } else {
      console.warn("No token found in response!");
      return response.data;
    }
  },
  // Get current user from cookie
  getCurrentUser: () => {
    const userCookie = Cookies.get('user');
    return userCookie ? JSON.parse(userCookie) : null;
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!Cookies.get('access_token');
  },
};

// ============================================
// USER PROFILE API FUNCTIONS
// ============================================

export const userAPI = {
  // Get user profile
  getProfile: async () => {
    const response = await api.get('/api/user/profile');
    return response.data;
  },

  // Update user profile
  updateProfile: async (profileData) => {
    const response = await api.put('/api/user/profile', profileData);
    return response.data;
  },

  // Upload avatar
  uploadAvatar: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post('/api/user/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Get user stats
  getStats: async () => {
    const response = await api.get('/api/user/stats');
    return response.data;
  },
};

// ============================================
// ORGANIZER API FUNCTIONS
// ============================================

export const organizerAPI = {
  // Apply as organizer
  apply: async (applicationData) => {
    const response = await api.post('/api/organizer/apply', applicationData);
    return response.data;
  },

  // Upload organization card
  uploadCard: async (applicationId, file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post(
      `/api/organizer/apply/${applicationId}/upload-card`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },

  // Get my application
  getMyApplication: async () => {
    const response = await api.get('/api/organizer/application/my');
    return response.data;
  },
};

// ============================================
// ADMIN API FUNCTIONS
// ============================================

export const adminAPI = {
  // Get pending applications
  getPendingApplications: async () => {
    const response = await api.get('/api/admin/applications/pending');
    return response.data;
  },

  // Approve application
  approveApplication: async (applicationId) => {
    const response = await api.post(`/api/admin/applications/${applicationId}/approve`);
    return response.data;
  },

  // Reject application
  rejectApplication: async (applicationId, reason) => {
    const response = await api.post(
      `/api/admin/applications/${applicationId}/reject?reason=${reason || ''}`
    );
    return response.data;
  },

  // Get admin stats
  getStats: async () => {
    const response = await api.get('/api/admin/stats');
    return response.data;
  },
};

export default api;