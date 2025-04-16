import axios, { AxiosInstance } from 'axios';

// Use environment variables for configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

// Configure axios
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Logger utility based on environment
export const logger = {
  debug: (...args: any[]) => {
    if (import.meta.env.VITE_LOG_LEVEL === 'debug') {
      console.debug('[ACOT API]', ...args);
    }
  },
  info: (...args: any[]) => console.info('[ACOT API]', ...args),
  warn: (...args: any[]) => console.warn('[ACOT API]', ...args),
  error: (...args: any[]) => console.error('[ACOT API]', ...args)
};

// Add request interceptor to include auth token
apiClient.interceptors.request.use(
  (config) => {
    logger.debug('API Request:', config.url);
    const token = localStorage.getItem('acot-token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    logger.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    logger.debug('API Response:', response.config.url, response.status);
    
    // Check for CommonResult structure and handle error codes
    if (response.data && response.data.code !== undefined) {
      // If code is not 0, it's an error according to the CommonResult pattern
      if (response.data.code !== 0) {
        return Promise.reject(new Error(response.data.msg || 'API Error'));
      }
      // Return only the data part for successful responses
      return response;
    }
    
    return response;
  },
  (error) => {
    logger.error('Response error:', error);
    
    // Handle authentication errors
    if (error.response && error.response.status === 401) {
      // Clear authentication data
      localStorage.removeItem('acot-token');
      localStorage.removeItem('acot-user');
      
      // Redirect to login page if not already there
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiClient; 