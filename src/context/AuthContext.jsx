import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsAuthenticated(false);
        setUser(null);
        setLoading(false);
        return;
      }
      try {
        const userData = await authService.getCurrentUser();
        setUser(userData);
        setIsAuthenticated(true);
      } catch {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const login = async (credentials) => {
    const data = await authService.login(credentials);
    localStorage.setItem('token', data.token);
    setIsAuthenticated(true);
    // Normalize: always expose 'id' regardless of what the backend user object sends
    const rawUser = data.user || {};
    const normalizedUser = { ...rawUser, id: rawUser.id || rawUser.userId || rawUser.sub };
    setUser(normalizedUser);
    return data;
  };

  const logout = () => {
    authService.logout();
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUser(null);
  };

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsAuthenticated(false);
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const userData = await authService.getCurrentUser();
      setUser(userData);
      setIsAuthenticated(true);
    } catch {
      localStorage.removeItem('token');
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};