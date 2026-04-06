import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import ProblemPage from './pages/ProblemPage';
import FocusModePage from './pages/FocusModePage';

// Simple protected route wrapper
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <div className="font-sans antialiased bg-darkBg text-white min-h-screen">
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/login" element={<AuthPage />} />
        
        {/* Protected Routes */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/problem/:id" element={<ProtectedRoute><ProblemPage /></ProtectedRoute>} />
        <Route path="/problem" element={<Navigate to="/dashboard" replace />} />
        <Route path="/focus" element={<ProtectedRoute><FocusModePage /></ProtectedRoute>} />
      </Routes>
    </div>
  );
}

export default App;
