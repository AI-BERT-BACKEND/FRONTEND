// MOCK SERVICE for Prototype
const authService = {
  login: async (credentials) => {
    console.log('Mock Login with:', credentials);
    const mockData = {
      token: 'mock-jwt-token',
      user: { name: 'Juan', email: credentials.email || 'juan@example.com' }
    };
    localStorage.setItem('token', mockData.token);
    return mockData;
  },

  register: async (userData) => {
    console.log('Mock Register with:', userData);
    return { success: true };
  },

  verifyEmail: async (code) => {
    console.log('Mock Verify Email with:', code);
    return { success: true };
  },

  forgotPassword: async (email) => {
    console.log('Mock Forgot Password with:', email);
    return { success: true };
  },

  logout: () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  },

  getCurrentUser: async () => {
    return { name: 'Juan', email: 'juan@example.com' };
  },
};

export default authService;
