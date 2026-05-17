import axios from 'axios';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
let baseURL = '/api';

if (apiBaseUrl) {
  // Strip trailing slashes
  const cleanUrl = apiBaseUrl.replace(/\/$/, '');
  // If it's a full URL and doesn't end with /api, append /api to match FastAPI endpoints
  if (cleanUrl.endsWith('/api')) {
    baseURL = cleanUrl;
  } else {
    // If it is a full HTTP URL, append /api. Otherwise keep it as is.
    baseURL = cleanUrl.startsWith('http') ? `${cleanUrl}/api` : cleanUrl;
  }
}

const api = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling 401 (token expired)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear local storage and redirect to login if token is invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // window.location.href = '/login'; // Optional: handled in context
    }
    return Promise.reject(error);
  }
);

export default api;
