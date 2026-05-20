import React from 'react';
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
import AcademicGoals from '../pages/AcademicGoals';
import StudyPreferences from '../pages/StudyPreferences';
import SubjectDetail from '../pages/SubjectDetail';
import CourseGrades from '../pages/CourseGrades';

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/forgot-password/sent" element={<EmailSent />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/verified-success" element={<VerifiedSuccess />} />
        <Route path="/academic-profile" element={<AcademicProfile />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<StudentProfile />} />
        <Route path="/materias" element={<Subjects />} />
        <Route path="/calendario" element={<Calendar />} />
        <Route path="/gestion" element={<AcademicManagement />} />
        <Route path="/gestion/dashboard" element={<AcademicDashboard />} />
        <Route path="/gestion/metas" element={<AcademicGoals />} />
        <Route path="/gestion/preferencias" element={<StudyPreferences />} />
        <Route path="/materias/:id" element={<SubjectDetail />} />
        <Route path="/materias/:id/cortes" element={<CourseGrades />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
