import axios from 'axios';

const PLANNING_BASE_URL = import.meta.env.VITE_PLANNING_API_URL || 'http://localhost:1504';

const planningApi = axios.create({
  baseURL: PLANNING_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

planningApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const userId = payload.id || payload.userId || payload.sub;
        if (userId) config.headers['X-User-Id'] = String(userId);
      } catch {
        // token malformed — skip X-User-Id
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default planningApi;
