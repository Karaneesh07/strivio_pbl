// src/App.jsx — Route definitions
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

import LoginPage            from './pages/LoginPage';
import RegisterPage         from './pages/RegisterPage';
import OnboardingPage       from './pages/OnboardingPage';
import DashboardPage        from './pages/DashboardPage';
import ProblemsPage         from './pages/ProblemsPage';
import DailyPage            from './pages/DailyPage';
import SubmissionsPage      from './pages/SubmissionsPage';
import AnalyticsPage        from './pages/AnalyticsPage';
import FocusPage            from './pages/FocusPage';
import LeaderboardPage      from './pages/LeaderboardPage';
import SettingsPage         from './pages/SettingsPage';
import WeeklyGoalsPage      from './pages/WeeklyGoalsPage';
import ReflectionJournalPage from './pages/ReflectionJournalPage';
import NotificationsPage    from './pages/NotificationsPage';
import ProblemWorkspace     from './pages/ProblemWorkspace';
import Sidebar              from './components/Sidebar';

// Protected route: also redirects to onboarding on first login
const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="d-flex justify-content-center align-items-center vh-100" style={{ color: '#4361ee' }}>
      <div className="spinner-border" />
    </div>
  );
  if (!user) return <Navigate to="/login" replace />;
  if (!localStorage.getItem('strivio_onboarded')) return <Navigate to="/onboarding" replace />;
  return children;
};

const AppLayout = ({ children }) => (
  <div className="d-flex">
    <Sidebar />
    <div className="main-content flex-grow-1">{children}</div>
  </div>
);

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login"      element={<LoginPage />} />
        <Route path="/register"   element={<RegisterPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />

        <Route path="/" element={<PrivateRoute><AppLayout><DashboardPage /></AppLayout></PrivateRoute>} />
        <Route path="/problems"     element={<PrivateRoute><AppLayout><ProblemsPage /></AppLayout></PrivateRoute>} />
        <Route path="/daily"        element={<PrivateRoute><AppLayout><DailyPage /></AppLayout></PrivateRoute>} />
        <Route path="/submissions"  element={<PrivateRoute><AppLayout><SubmissionsPage /></AppLayout></PrivateRoute>} />
        <Route path="/analytics"    element={<PrivateRoute><AppLayout><AnalyticsPage /></AppLayout></PrivateRoute>} />
        <Route path="/focus"        element={<PrivateRoute><AppLayout><FocusPage /></AppLayout></PrivateRoute>} />
        <Route path="/leaderboard"  element={<PrivateRoute><AppLayout><LeaderboardPage /></AppLayout></PrivateRoute>} />
        <Route path="/settings"     element={<PrivateRoute><AppLayout><SettingsPage /></AppLayout></PrivateRoute>} />
        <Route path="/goals"        element={<PrivateRoute><AppLayout><WeeklyGoalsPage /></AppLayout></PrivateRoute>} />
        <Route path="/reflections"  element={<PrivateRoute><AppLayout><ReflectionJournalPage /></AppLayout></PrivateRoute>} />
        <Route path="/notifications" element={<PrivateRoute><AppLayout><NotificationsPage /></AppLayout></PrivateRoute>} />
        <Route path="/workspace/:id" element={<PrivateRoute><AppLayout><ProblemWorkspace /></AppLayout></PrivateRoute>} />
        <Route path="*"             element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}
