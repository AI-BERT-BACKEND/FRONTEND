import axios from 'axios';

const ACADEMIC_BASE_URL = import.meta.env.VITE_ACADEMIC_API_URL || 'http://localhost:1502';

const academicApi = axios.create({
  baseURL: ACADEMIC_BASE_URL,
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
        if (studentId) config.headers['X-Student-Id'] = String(studentId);
      } catch {
        // token inválido — continúa sin X-Student-Id
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default academicApi;
