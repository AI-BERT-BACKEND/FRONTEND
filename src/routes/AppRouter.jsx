import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import AdminRoute from '../components/AdminRoute';
import ScrollToTop from '../components/ScrollToTop';

import Landing from '../pages/Landing';
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
import Tasks from '../pages/Tasks';
import Prioritization from '../pages/Prioritization';
import Statistics from '../pages/Statistics';
import SmartSchedule from '../pages/SmartSchedule';
import Gamification from '../pages/Gamification';
import Settings from '../pages/Settings';
import Availability from '../pages/Availability';
import StudySession from '../pages/StudySession';
import CreateStudySession from '../pages/CreateStudySession';
import StartStudySession from '../pages/StartStudySession';
import GradeDetail from '../pages/GradeDetail';
import AdminProfile from '../pages/AdminProfile';
import AdminUsers from '../pages/AdminUsers';
import AdminStats from '../pages/AdminStats';
import AdminConfig from '../pages/AdminConfig';

const AppRouter = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/forgot-password/sent" element={<EmailSent />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/verified-success" element={<VerifiedSuccess />} />

        {/* Protected Routes */}
        <Route
          path="/academic-profile"
          element={
            <ProtectedRoute>
              <AcademicProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <StudentProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/materias"
          element={
            <ProtectedRoute>
              <Subjects />
            </ProtectedRoute>
          }
        />
        <Route
          path="/calendario"
          element={
            <ProtectedRoute>
              <Calendar />
            </ProtectedRoute>
          }
        />
        <Route
          path="/gestion"
          element={
            <ProtectedRoute>
              <AcademicManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/gestion/dashboard"
          element={
            <ProtectedRoute>
              <AcademicDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/gestion/metas"
          element={
            <ProtectedRoute>
              <AcademicGoals />
            </ProtectedRoute>
          }
        />
        <Route
          path="/gestion/preferencias"
          element={
            <ProtectedRoute>
              <StudyPreferences />
            </ProtectedRoute>
          }
        />
        <Route
          path="/gestion/disponibilidad"
          element={
            <ProtectedRoute>
              <Availability />
            </ProtectedRoute>
          }
        />
        <Route
          path="/materias/:id"
          element={
            <ProtectedRoute>
              <SubjectDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/materias/:id/cortes"
          element={
            <ProtectedRoute>
              <CourseGrades />
            </ProtectedRoute>
          }
        />
        <Route
          path="/materias/:id/notas"
          element={
            <ProtectedRoute>
              <GradeDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tareas"
          element={
            <ProtectedRoute>
              <Tasks />
            </ProtectedRoute>
          }
        />
        <Route
          path="/priorizacion"
          element={
            <ProtectedRoute>
              <Prioritization />
            </ProtectedRoute>
          }
        />
        <Route
          path="/estadisticas"
          element={
            <ProtectedRoute>
              <Statistics />
            </ProtectedRoute>
          }
        />
        <Route
          path="/horario-inteligente"
          element={
            <ProtectedRoute>
              <SmartSchedule />
            </ProtectedRoute>
          }
        />
        <Route
          path="/gamificacion"
          element={
            <ProtectedRoute>
              <Gamification />
            </ProtectedRoute>
          }
        />
        <Route
          path="/configuracion"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/sesion"
          element={
            <ProtectedRoute>
              <StudySession />
            </ProtectedRoute>
          }
        />
        <Route
          path="/sesion/crear"
          element={
            <ProtectedRoute>
              <CreateStudySession />
            </ProtectedRoute>
          }
        />
        <Route
          path="/sesion/iniciar"
          element={
            <ProtectedRoute>
              <StartStudySession />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin/perfil"
          element={
            <AdminRoute>
              <AdminProfile />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/usuarios"
          element={
            <AdminRoute>
              <AdminUsers />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/estadisticas"
          element={
            <AdminRoute>
              <AdminStats />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/configuracion"
          element={
            <AdminRoute>
              <AdminConfig />
            </AdminRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
