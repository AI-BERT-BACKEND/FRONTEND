import axios from 'axios';
import config from '../config';

const academicApi = axios.create({
  baseURL: config.api.baseUrlWithoutApi,
  headers: { 'Content-Type': 'application/json' },
});

academicApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const studentId = payload.id || payload.userId || payload.sub;
        if (studentId) {
          config.headers['X-Student-Id'] = String(studentId);
          config.headers['X-User-Id'] = String(studentId);
        }
      } catch {
        // token inválido — continúa sin headers de identidad
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

academicApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default academicApi;
