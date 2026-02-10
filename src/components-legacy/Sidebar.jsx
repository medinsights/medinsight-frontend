// frontend/src/components/Sidebar.jsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      id: 'assistant',
      icon: '💬',
      label: 'Assistant Général',
      path: '/',
      description: 'Questions médicales générales'
    },
    {
      id: 'patients',
      icon: '👥',
      label: 'Mes Patients',
      path: '/patients',
      description: 'Gestion des dossiers patients'
    },
    {
      id: 'settings',
      icon: '⚙️',
      label: 'Paramètres',
      path: '/settings',
      description: 'Configuration du système'
    }
  ];

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="sidebar">
      {/* Header */}
      <div className="sidebar-header">
        <div className="logo">
          <span className="logo-icon">🏥</span>
          <div className="logo-text">
            <h2>MediAssist</h2>
            <p>Assistant Médical IA</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {menuItems.map(item => (
          <button
            key={item.id}
            className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
            onClick={() => navigate(item.path)}
          >
            <span className="nav-icon">{item.icon}</span>
            <div className="nav-content">
              <span className="nav-label">{item.label}</span>
              <span className="nav-description">{item.description}</span>
            </div>
          </button>
        ))}
      </nav>

      {/* User Info */}
      <div className="sidebar-footer">
        <div className="user-info">
          <div className="user-avatar">👨‍⚕️</div>
          <div className="user-details">
            <strong>Dr. Benali</strong>
            <span>Médecin Généraliste</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;