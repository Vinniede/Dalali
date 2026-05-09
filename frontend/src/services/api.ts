import axios, { AxiosInstance } from 'axios';

// Determine API base URL based on environment
let API_BASE_URL = '/api';

if (typeof window !== 'undefined') {
  const hostname = window.location.hostname;
  const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';
  
  if (isLocalhost) {
    // Local development - connect to backend on port 5000
    API_BASE_URL = 'http://localhost:5000/api';
  } else {
    // Production on Vercel - use relative /api path
    // The vercel.json routes will handle forwarding to serverless functions
    API_BASE_URL = '/api';
  }
  
  console.log('[API Config] Environment:', isLocalhost ? 'development' : 'production');
  console.log('[API Config] Hostname:', hostname);
  console.log('[API Config] Base URL:', API_BASE_URL);
}

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
  console.log('[API Request]', config.method?.toUpperCase(), config.url);
  return config;
});

// Add response error logging for debugging
api.interceptors.response.use(
  (response) => {
    console.log('[API Response]', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('[API Error]', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      method: error.config?.method?.toUpperCase(),
      baseURL: error.config?.baseURL,
      fullURL: error.config?.url?.startsWith('http') ? error.config.url : (error.config?.baseURL + error.config?.url),
      data: error.response?.data,
    });
    return Promise.reject(error);
  }
);

export default api;
