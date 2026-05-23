const env = import.meta.env;

const normalize = (url) => (url || '').replace(/\/api\/?$/, '') || 'http://localhost:3000';

const config = {
  api: {
    baseUrl: normalize(env.VITE_API_URL),
    baseUrlWithoutApi: normalize(env.VITE_API_URL),
  },
  planning: {
    baseUrl: env.VITE_PLANNING_API_URL || normalize(env.VITE_API_URL) || 'http://localhost:3000',
  },
};

export default config;
