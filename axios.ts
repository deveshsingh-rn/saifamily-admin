import axios from 'axios';

const configuredApiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  'http://localhost:4000/api';

// Existing API modules include `/api` in their endpoint paths.
const apiOrigin = configuredApiBaseUrl.replace(/\/api\/?$/, '');

const axiosInstance = axios.create({
  baseURL: apiOrigin,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export { axiosInstance };
