import axios from 'axios';
import toast from 'react-hot-toast';
import { API_BASE_URL } from '../utils/constants';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('cir_token') || localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      if (status === 401) {
        localStorage.removeItem('cir_token');
        localStorage.removeItem('cir_user');
      } else if (status === 422 && data.errors) {
        const firstErr = Object.values(data.errors)[0]?.[0];
        toast.error(firstErr || 'Validation failed');
      } else if (status === 500) {
        toast.error('Internal server error. Please try again later.');
      }
    } else if (error.request) {
      console.warn('Backend API offline or unreachable.');
    }
    return Promise.reject(error);
  }
);

export default api;
