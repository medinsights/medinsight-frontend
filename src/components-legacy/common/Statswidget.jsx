// frontend/src/components/common/StatsWidget.jsx
/**
 * COMPOSANT RÉUTILISABLE - Widget de Statistiques
 * 
 * Utilisé par: Consultations, Traitements, Analyses, Synthèse
 */

import React from 'react';
import './Statswidget.css';

const StatsWidget = ({ stats = [], loading = false }) => {
  if (loading) {
    return (
      <div className="stats-widget loading">
        <div className="stats-skeleton">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="stat-skeleton"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!stats || stats.length === 0) {
    return null;
  }

  return (
    <div className="stats-widget">
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`stat-card ${stat.trend ? `trend-${stat.trend}` : ''}`}
            style={stat.color ? { borderLeftColor: stat.color } : {}}
          >
            <div className="stat-header">
              {stat.icon && <span className="stat-icon">{stat.icon}</span>}
              <span className="stat-label">{stat.label}</span>
            </div>

            <div className="stat-value-wrapper">
              <span className="stat-value">
                {stat.value}
                {stat.unit && <span className="stat-unit">{stat.unit}</span>}
              </span>

              {stat.trend && (
                <span className={`stat-trend trend-${stat.trend}`}>
                  {stat.trend === 'up' && '↗'}
                  {stat.trend === 'down' && '↘'}
                  {stat.trend === 'stable' && '→'}
                  {stat.trendValue && ` ${stat.trendValue}`}
                </span>
              )}
            </div>

            {stat.subtitle && (
              <div className="stat-subtitle">{stat.subtitle}</div>
            )}

            {stat.progress !== undefined && (
              <div className="stat-progress-bar">
                <div
                  className="stat-progress-fill"
                  style={{
                    width: `${Math.min(stat.progress, 100)}%`,
                    backgroundColor: stat.progressColor || '#3b82f6'
                  }}
                />
              </div>
            )}

            {stat.badge && (
              <div className={`stat-badge ${stat.badgeType || 'info'}`}>
                {stat.badge}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatsWidget;