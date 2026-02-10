/**
 * Home Page - MedInsights Landing
 * Modern medical platform landing page with feature showcase
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <span className="text-2xl font-bold text-gray-900">MedInsights</span>
            </div>
            
            {!isAuthenticated && (
              <div className="flex gap-3">
                <Link to="/login" className="px-4 py-2 text-blue-600 hover:text-blue-700 font-medium transition-colors">
                  Sign In
                </Link>
                <Link to="/register" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors">
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            🏥 Intelligent Medical
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Practice Management
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            AI-powered platform for modern healthcare professionals. 
            Streamline patient management, leverage clinical AI, and enhance care quality.
          </p>
          
          {!isAuthenticated && (
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/register" className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200">
                Start Free Trial
              </Link>
              <Link to="/medical/assistant" className="px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-gray-50 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 border border-blue-200">
                Try AI Assistant
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Comprehensive Healthcare Platform
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-white rounded-xl p-8 shadow-md hover:shadow-xl transition-shadow border border-gray-100">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-3xl">🤖</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">AI Medical Assistant</h3>
            <p className="text-gray-600 leading-relaxed">
              Get instant clinical decision support with RAG-powered AI trained on HAS/ANSM guidelines. 
              Ask questions, get evidence-based recommendations.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white rounded-xl p-8 shadow-md hover:shadow-xl transition-shadow border border-gray-100">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-3xl">📋</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Smart Patient Records</h3>
            <p className="text-gray-600 leading-relaxed">
              Complete electronic health records with automated data extraction from lab results, 
              prescriptions, and medical images.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white rounded-xl p-8 shadow-md hover:shadow-xl transition-shadow border border-gray-100">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-3xl">💬</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Patient-Specific Chat</h3>
            <p className="text-gray-600 leading-relaxed">
              Context-aware AI chat for each patient. Access full medical history, analyses, 
              and get personalized treatment suggestions.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-white rounded-xl p-8 shadow-md hover:shadow-xl transition-shadow border border-gray-100">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-3xl">🔬</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Lab Analysis OCR</h3>
            <p className="text-gray-600 leading-relaxed">
              Automatically extract and interpret lab results from scanned documents. 
              AI detects anomalies and provides clinical insights.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="bg-white rounded-xl p-8 shadow-md hover:shadow-xl transition-shadow border border-gray-100">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-3xl">📊</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Evolution Tracking</h3>
            <p className="text-gray-600 leading-relaxed">
              Visualize patient health trends over time. Track vital signs, lab values, 
              and treatment effectiveness with interactive charts.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="bg-white rounded-xl p-8 shadow-md hover:shadow-xl transition-shadow border border-gray-100">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-3xl">🔐</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Enterprise Security</h3>
            <p className="text-gray-600 leading-relaxed">
              HIPAA-compliant with RS256 JWT authentication, role-based access control, 
              and encrypted data storage.
            </p>
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
            Built with Modern Technology
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Microservices architecture with cutting-edge AI and best-in-class security
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <div className="text-4xl mb-2">⚛️</div>
              <div className="font-semibold text-gray-900">React + TypeScript</div>
              <div className="text-sm text-gray-600">Frontend</div>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <div className="text-4xl mb-2">🐍</div>
              <div className="font-semibold text-gray-900">FastAPI + Django</div>
              <div className="text-sm text-gray-600">Backend</div>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <div className="text-4xl mb-2">☕</div>
              <div className="font-semibold text-gray-900">Spring Boot</div>
              <div className="text-sm text-gray-600">Services</div>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <div className="text-4xl mb-2">🦍</div>
              <div className="font-semibold text-gray-900">Kong Gateway</div>
              <div className="text-sm text-gray-600">API Gateway</div>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <div className="text-4xl mb-2">🧠</div>
              <div className="font-semibold text-gray-900">OpenAI GPT</div>
              <div className="text-sm text-gray-600">AI Assistant</div>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <div className="text-4xl mb-2">🔍</div>
              <div className="font-semibold text-gray-900">RAG + Chroma</div>
              <div className="text-sm text-gray-600">Vector DB</div>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <div className="text-4xl mb-2">🐘</div>
              <div className="font-semibold text-gray-900">PostgreSQL</div>
              <div className="text-sm text-gray-600">Database</div>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <div className="text-4xl mb-2">🐳</div>
              <div className="font-semibold text-gray-900">Docker</div>
              <div className="text-sm text-gray-600">Containers</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-12 text-center text-white shadow-2xl">
          <h2 className="text-4xl font-bold mb-4">Ready to Transform Your Practice?</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join modern healthcare professionals leveraging AI for better patient outcomes
          </p>
          {!isAuthenticated && (
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/register" className="px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-gray-100 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200">
                Create Free Account
              </Link>
              <Link to="/medical/patients" className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg hover:bg-white/10 font-semibold text-lg transition-all duration-200">
                View Demo
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">MedInsights</h3>
              <p className="text-gray-400 text-sm">
                AI-powered medical practice management for modern healthcare
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/medical/assistant" className="hover:text-white transition-colors">AI Assistant</Link></li>
                <li><Link to="/medical/patients" className="hover:text-white transition-colors">Patient Management</Link></li>
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API Reference</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">HIPAA Compliance</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>© 2026 MedInsights. All rights reserved. Built with ❤️ for healthcare professionals.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
