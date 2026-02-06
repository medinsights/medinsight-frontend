/**
 * Main App Component with Routing
 */
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import RoleRoute from './components/RoleRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import PatientProfilePageNew from './pages/PatientProfilePageNew';
import PatientsListPage from './pages/patient/PatientsListPage';
import PatientDetailPage from './pages/patient/PatientDetailPage';
import { AIAssistantPage } from './pages/AIAssistantPage';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Admin Only Routes */}
          <Route element={<AdminRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
          </Route>

          {/* Patient Management - Admin, Doctor, and Secretary */}
          <Route element={<RoleRoute roles={['admin', 'doctor', 'secretary']} />}>
            <Route path="/patients" element={<PatientsListPage />} />
            <Route path="/patients/:id" element={<PatientDetailPage />} />
          </Route>

          {/* Protected Routes - All authenticated users */}
          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<PatientProfilePageNew />} />
            <Route path="/ai-assistant" element={<AIAssistantPage />} />
          </Route>
          
          {/* Catch all - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;

