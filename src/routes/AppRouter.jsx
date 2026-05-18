import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginScreen from '../pages/LoginScreen';
import ForgotPasswordScreen from '../pages/ForgotPasswordScreen';
import EmailSentScreen from '../pages/EmailSentScreen';
import RegisterScreen from '../pages/RegisterScreen';

const AppRouter = () => {
  const [theme, setTheme] = useState('light');
  const toggleTheme = () => setTheme(t => t === 'light' ? 'dark' : 'light');

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginScreen theme={theme} onToggleTheme={toggleTheme} />} />
        <Route path="/forgot-password" element={<ForgotPasswordScreen theme={theme} onToggleTheme={toggleTheme} />} />
        <Route path="/forgot-password/sent" element={<EmailSentScreen theme={theme} onToggleTheme={toggleTheme} />} />
        <Route path="/register" element={<RegisterScreen theme={theme} onToggleTheme={toggleTheme} />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;