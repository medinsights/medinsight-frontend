/**
 * Main App Component with Routing
 * Medical pages migrated from Chatbot-Medical-Copie - All protected routes
 */
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Medical Pages (migrated from Chatbot-Medical-Copie) - All Protected
import PatientsList from './pages/medical/PatientsList';
import PatientDetail from './pages/medical/PatientDetail';
import AssistantGeneral from './pages/medical/AssistantGeneral';

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

          {/* Protected Medical Routes - Migrated from Chatbot-Medical-Copie */}
          <Route element={<ProtectedRoute />}>
            {/* Main medical pages */}
            <Route path="/patients" element={<PatientsList />} />
            <Route path="/patients/:id" element={<PatientDetail />} />
            <Route path="/assistant" element={<AssistantGeneral />} />
          </Route>
          
          {/* Catch all - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;

