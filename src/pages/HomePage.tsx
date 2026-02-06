/**
 * Home Page
 */
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const HomePage = () => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const navigate = useNavigate();

  // Redirect authenticated users to their appropriate page
  useEffect(() => {
    if (isAuthenticated && user) {
      switch (user.role) {
        case 'admin':
          navigate('/dashboard');
          break;
        case 'doctor':
        case 'secretary':
          navigate('/patients');
          break;
        default:
          navigate('/profile');
      }
    }
  }, [isAuthenticated, user, navigate]);

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-500 to-secondary-500 px-4">
      <div className="text-center text-white max-w-5xl">
        <h1 className="text-5xl md:text-6xl font-bold mb-5">🔐 JWT Authentication System</h1>
        <p className="text-xl md:text-2xl mb-12 opacity-90">
          Production-ready authentication with Django + React
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20">
            <h3 className="text-2xl mb-3">🛡️ Secure</h3>
            <p className="opacity-90">RS256 JWT with token rotation</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20">
            <h3 className="text-2xl mb-3">🍪 HttpOnly Cookies</h3>
            <p className="opacity-90">Refresh tokens stored securely</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20">
            <h3 className="text-2xl mb-3">⚡ Auto-Refresh</h3>
            <p className="opacity-90">Seamless token renewal</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20">
            <h3 className="text-2xl mb-3">🔒 Protected Routes</h3>
            <p className="opacity-90">Role-based access control</p>
          </div>
        </div>
        
        {isAuthenticated ? (
          <div className="space-y-4">
            <p className="text-lg">Welcome back, {user?.username}!</p>
            <Link to="/dashboard" className="inline-block bg-white text-primary-500 font-semibold py-3 px-8 rounded-lg hover:shadow-xl hover:-translate-y-0.5 transform transition-all duration-200">
              Go to Dashboard
            </Link>
          </div>
        ) : (
          <div className="flex flex-wrap gap-5 justify-center">
            <Link to="/login" className="bg-white text-primary-500 font-semibold py-3 px-8 rounded-lg hover:shadow-xl hover:-translate-y-0.5 transform transition-all duration-200">
              Login
            </Link>
            <Link to="/register" className="bg-transparent border-2 border-white text-white font-semibold py-3 px-8 rounded-lg hover:bg-white hover:text-primary-500 transition-all duration-200">
              Register
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
