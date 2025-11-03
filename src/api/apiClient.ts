import axios from 'axios';

// Use environment variable for the API base URL. This is more robust than relying on a proxy.
// In your .env.local file, you should have: VITE_API_BASE_URL=http://localhost:8082
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8082';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add the auth token to every request
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Corrected key to match AuthContext
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('API Request with token:', config.url, 'Token present:', !!token);
    } else {
      console.log('API Request without token:', config.url);
    }
    
    // If the data is FormData, remove Content-Type header to let browser set it with boundary
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor to standardize error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error) && error.response) {
      // Log the full error for debugging
      console.error('API Error Details:', {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
        headers: error.response.headers,
        url: error.config?.url,
        method: error.config?.method
      });
      
      // Extract the most specific error message from the backend response
      const errorData = error.response.data;
      let message = 'An unexpected error occurred.';
      if (typeof errorData === 'string' && errorData.length > 0) {
        message = errorData;
      } else if (typeof errorData === 'object' && errorData !== null) {
        message = errorData.message || errorData.error || JSON.stringify(errorData);
      }
      
      // Include status code in error message for better debugging
      message = `[${error.response.status}] ${message}`;
      
      // Create a new error with a consistent message format
      return Promise.reject(new Error(message));
    }
    // Fallback for non-Axios errors or network issues
    console.error('Non-Axios error:', error);
    
    // Handle network errors (connection refused, etc.)
    if (axios.isAxiosError(error)) {
      if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
        const baseURL = error.config?.baseURL || API_BASE_URL;
        const helpfulMessage = `Unable to connect to the backend server at ${baseURL}. Please ensure the backend server is running. To start it, navigate to the backend-java directory and run: mvn spring-boot:run`;
        return Promise.reject(new Error(helpfulMessage));
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;