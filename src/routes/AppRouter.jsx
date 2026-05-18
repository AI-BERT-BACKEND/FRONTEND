import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Login';
import ForgotPassword from '../pages/ForgotPassword';
import EmailSent from '../pages/EmailSent';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';

const AppRouter = () => {
  const [theme, setTheme] = useState('light');
  const toggleTheme = () => setTheme(t => t === 'light' ? 'dark' : 'light');

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login theme={theme} onToggleTheme={toggleTheme} />} />
        <Route path="/forgot-password" element={<ForgotPassword theme={theme} onToggleTheme={toggleTheme} />} />
        <Route path="/forgot-password/sent" element={<EmailSent theme={theme} onToggleTheme={toggleTheme} />} />
        <Route path="/register" element={<Register theme={theme} onToggleTheme={toggleTheme} />} />
        <Route path="/dashboard" element={<Dashboard theme={theme} onToggleTheme={toggleTheme} />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;