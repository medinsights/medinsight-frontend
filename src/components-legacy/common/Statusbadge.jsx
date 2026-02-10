// frontend/src/components/common/StatusBadge.jsx
/**
 * COMPOSANT RÉUTILISABLE - Badge de Statut
 * 
 * Utilisé par: Consultations, Traitements, Analyses
 */

import React from 'react';
import './Statusbadge.css';

const StatusBadge = ({ 
  status, 
  customLabel = null,
  customColor = null,
  customIcon = null,
  size = 'medium' // small, medium, large
}) => {
  // Configurations par défaut pour différents types de statuts
  const statusConfigs = {
    // Consultations
    'planifiee': { label: 'Planifiée', color: '#3b82f6', icon: '📅' },
    'realisee': { label: 'Réalisée', color: '#10b981', icon: '✅' },
    'annulee': { label: 'Annulée', color: '#ef4444', icon: '❌' },
    
    // Traitements
    'actif': { label: 'Actif', color: '#10b981', icon: '✅' },
    'arrete': { label: 'Arrêté', color: '#6b7280', icon: '⏹️' },
    'suspendu': { label: 'Suspendu', color: '#f59e0b', icon: '⏸️' },
    
    // Analyses
    'normal': { label: 'Normal', color: '#10b981', icon: '✅' },
    'alerte': { label: 'Alerte', color: '#f59e0b', icon: '⚠️' },
    'critique': { label: 'Critique', color: '#ef4444', icon: '🔴' },
    
    // Générique
    'success': { label: 'Succès', color: '#10b981', icon: '✅' },
    'warning': { label: 'Attention', color: '#f59e0b', icon: '⚠️' },
    'danger': { label: 'Danger', color: '#ef4444', icon: '🔴' },
    'info': { label: 'Info', color: '#3b82f6', icon: 'ℹ️' },
    'neutral': { label: 'Neutre', color: '#6b7280', icon: '⚪' }
  };

  const config = statusConfigs[status?.toLowerCase()] || statusConfigs.neutral;
  
  const label = customLabel || config.label;
  const color = customColor || config.color;
  const icon = customIcon || config.icon;

  return (
    <span 
      className={`status-badge size-${size}`}
      style={{ 
        backgroundColor: `${color}15`,
        color: color,
        borderColor: `${color}40`
      }}
    >
      {icon && <span className="status-icon">{icon}</span>}
      <span className="status-label">{label}</span>
    </span>
  );
};

export default StatusBadge;