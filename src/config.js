const env = import.meta.env;

const config = {
  api: {
    baseUrl: env.VITE_API_URL || 'http://localhost:3000/api',
    baseUrlWithoutApi: (env.VITE_API_URL || 'http://localhost:3000/api').replace(/\/api\/?$/, ''),
  },
  planning: {
    baseUrl: env.VITE_PLANNING_API_URL || env.VITE_API_URL?.replace(/\/api\/?$/, '') || 'http://localhost:3000',
  },
};

export default config;
