import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Login';
import ForgotPassword from '../pages/ForgotPassword';
import EmailSent from '../pages/EmailSent';
import Register from '../pages/Register';
import VerifyEmail from '../pages/VerifyEmail';
import VerifiedSuccess from '../pages/VerifiedSuccess';
import AcademicProfile from '../pages/AcademicProfile';
import Dashboard from '../pages/Dashboard';
import StudentProfile from '../pages/StudentProfile';
import Subjects from '../pages/Subjects';
import AcademicManagement from '../pages/AcademicManagement';
import AcademicDashboard from '../pages/AcademicDashboard';
import Calendar from '../pages/Calendar';

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
        <Route path="/verify-email" element={<VerifyEmail theme={theme} onToggleTheme={toggleTheme} />} />
        <Route path="/verified-success" element={<VerifiedSuccess theme={theme} onToggleTheme={toggleTheme} />} />
        <Route path="/academic-profile" element={<AcademicProfile theme={theme} onToggleTheme={toggleTheme} />} />
        <Route path="/dashboard" element={<Dashboard theme={theme} onToggleTheme={toggleTheme} />} />
        <Route path="/profile" element={<StudentProfile theme={theme} onToggleTheme={toggleTheme} />} />
        <Route path="/materias" element={<Subjects theme={theme} onToggleTheme={toggleTheme} />} />
        <Route path="/calendario" element={<Calendar theme={theme} onToggleTheme={toggleTheme} />} />
        <Route path="/gestion" element={<AcademicManagement theme={theme} onToggleTheme={toggleTheme} />} />
        <Route path="/gestion/dashboard" element={<AcademicDashboard theme={theme} onToggleTheme={toggleTheme} />} />

      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;