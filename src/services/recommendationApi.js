import axios from 'axios';
import config from '../config';

const recommendationApi = axios.create({
  baseURL: config.api.baseUrlWithoutApi,
  headers: { 'Content-Type': 'application/json' },
});

recommendationApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const userId = payload.id || payload.userId || payload.sub;
        if (userId) {
          config.headers['X-User-Id'] = String(userId);
          config.headers['X-Student-Id'] = String(userId);
        }
      } catch {
        // token malformed — skip headers
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

recommendationApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default recommendationApi;
