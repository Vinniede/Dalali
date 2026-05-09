import axios, { AxiosInstance } from 'axios';

// Determine API base URL based on environment
let API_BASE_URL = '/api';

if (typeof window !== 'undefined') {
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    // Local development
    API_BASE_URL = 'http://localhost:5000/api';
  } else {
    // Production - always use relative /api path on Vercel
    API_BASE_URL = '/api';
  }
}

// Allow override via environment variable (for build-time configuration)
if (import.meta.env.VITE_API_URL) {
  API_BASE_URL = import.meta.env.VITE_API_URL;
}

console.log('[API Config] Base URL:', API_BASE_URL, 'Hostname:', typeof window !== 'undefined' ? window.location.hostname : 'N/A');

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to request headers
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response error logging for debugging
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('[API Error]', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      method: error.config?.method,
      data: error.response?.data,
    });
    return Promise.reject(error);
  }
);

export default api;
