// frontend/src/components/patient/PatientRecommandations.jsx
import React, { useState, useEffect } from 'react';
import './PatientRecommandations.css';

const PatientRecommandations = ({ patient, patientId }) => {
  const [recommandations, setRecommandations] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (patientId) {
      fetchRecommandations();
    }
  }, [patientId]);

  const fetchRecommandations = async () => {
    try {
      console.log('🔍 Chargement recommandations pour patient', patientId);
      const response = await fetch(`http://localhost:8000/api/patients/${patientId}/recommandations`);
      const data = await response.json();
      setRecommandations(data);
      console.log('✅ Recommandations chargées:', data);
    } catch (error) {
      console.error('❌ Erreur chargement recommandations:', error);
      setRecommandations(null);
    } finally {
      setLoading(false);
    }
  };

  const getUrgenceColor = (urgence) => {
    if (urgence?.includes('Immédiate')) return '#ef4444';
    if (urgence?.includes('Court terme')) return '#f59e0b';
    return '#3b82f6';
  };

  if (loading) {
    return (
      <div className="recommandations-loading">
        <div className="spinner"></div>
        <p>Analyse du dossier en cours...</p>
      </div>
    );
  }

  if (!recommandations) {
    return (
      <div className="recommandations-error">
        <span className="error-icon">⚠️</span>
        <p>Impossible de générer les recommandations</p>
        <button onClick={fetchRecommandations} className="btn-retry">
          🔄 Réessayer
        </button>
      </div>
    );
  }

  const hasAlertes = recommandations.alertes_critiques?.length > 0 || 
                      recommandations.alertes_surveillance?.length > 0;
  const hasRecommandations = recommandations.recommandations_traitements?.length > 0 ||
                             recommandations.recommandations_examens?.length > 0 ||
                             recommandations.recommandations_consultations?.length > 0;

  return (
    <div className="patient-recommandations">
      {/* Header avec score de risque */}
      <div className="recommandations-header">
        <div className="header-info">
          <h2>🤖 Recommandations Médicales Personnalisées</h2>
          <p>Analyse basée sur les recommandations HAS/ANSM</p>
        </div>
        <div className="risk-score">
          <div className="score-circle" style={{
            background: recommandations.score_risque > 5 ? '#ef4444' :
                       recommandations.score_risque > 2 ? '#f59e0b' : '#22c55e'
          }}>
            <span className="score-number">{recommandations.score_risque || 0}</span>
          </div>
          <span className="score-label">Score de risque</span>
        </div>
      </div>

      {/* Actions prioritaires */}
      {recommandations.actions_prioritaires?.length > 0 && (
        <div className="actions-prioritaires-section">
          <h3 className="section-title">
            🎯 Actions Prioritaires
            <span className="badge-count">{recommandations.actions_prioritaires.length}</span>
          </h3>
          
          <div className="actions-list">
            {recommandations.actions_prioritaires.map((action, idx) => (
              <div key={idx} className="action-card" style={{
                borderLeftColor: getUrgenceColor(action.urgence)
              }}>
                <div className="action-header">
                  <div className="action-priority">
                    <span className="priority-badge" style={{
                      background: getUrgenceColor(action.urgence)
                    }}>
                      Priorité {action.priorite}
                    </span>
                    <span className="urgence-text">{action.urgence}</span>
                  </div>
                  <span className="action-type-badge">{action.type}</span>
                </div>
                
                <h4 className="action-titre">{action.titre}</h4>
                <p className="action-description">{action.action}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Alertes critiques */}
      {recommandations.alertes_critiques?.length > 0 && (
        <div className="alertes-section alertes-critiques">
          <h3 className="section-title">
            🔴 Alertes Critiques - Action Immédiate Requise
            <span className="badge-count">{recommandations.alertes_critiques.length}</span>
          </h3>
          
          <div className="alertes-grid">
            {recommandations.alertes_critiques.map((alerte, idx) => (
              <div key={idx} className="alerte-card alerte-critique">
                <div className="alerte-icon">🔴</div>
                <div className="alerte-content">
                  <h4>{alerte.titre}</h4>
                  <p className="alerte-description">{alerte.description}</p>
                  <div className="alerte-recommendation">
                    <strong>📋 Recommandation:</strong>
                    <p>{alerte.recommandation}</p>
                  </div>
                  {alerte.source && (
                    <div className="alerte-source">
                      <span className="source-icon">📚</span>
                      <span>{alerte.source}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Alertes surveillance */}
      {recommandations.alertes_surveillance?.length > 0 && (
        <div className="alertes-section alertes-surveillance">
          <h3 className="section-title">
            🟡 Alertes de Surveillance
            <span className="badge-count">{recommandations.alertes_surveillance.length}</span>
          </h3>
          
          <div className="alertes-grid">
            {recommandations.alertes_surveillance.map((alerte, idx) => (
              <div key={idx} className="alerte-card alerte-surveillance">
                <div className="alerte-icon">🟡</div>
                <div className="alerte-content">
                  <h4>{alerte.titre}</h4>
                  <p className="alerte-description">{alerte.description}</p>
                  <div className="alerte-recommendation">
                    <strong>📋 Recommandation:</strong>
                    <p>{alerte.recommandation}</p>
                  </div>
                  {alerte.source && (
                    <div className="alerte-source">
                      <span className="source-icon">📚</span>
                      <span>{alerte.source}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommandations traitements */}
      {recommandations.recommandations_traitements?.length > 0 && (
        <div className="recommandations-section">
          <h3 className="section-title">
            💊 Recommandations Thérapeutiques
            <span className="badge-count">{recommandations.recommandations_traitements.length}</span>
          </h3>
          
          <div className="recommandations-list">
            {recommandations.recommandations_traitements.map((reco, idx) => (
              <div key={idx} className="reco-card">
                <div className="reco-header">
                  <h4>{reco.action || reco.titre}</h4>
                  {reco.priorite && (
                    <span className={`priority-tag priority-${reco.priorite}`}>
                      {reco.priorite === 'haute' ? '⚡ Haute' : '📌 Moyenne'}
                    </span>
                  )}
                </div>
                
                {reco.detail && (
                  <p className="reco-detail">{reco.detail}</p>
                )}
                
                {reco.posologie && (
                  <div className="reco-info">
                    <strong>💊 Posologie:</strong> {reco.posologie}
                  </div>
                )}
                
                {reco.surveillance && (
                  <div className="reco-info">
                    <strong>👁️ Surveillance:</strong> {reco.surveillance}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommandations examens */}
      {recommandations.recommandations_examens?.length > 0 && (
        <div className="recommandations-section">
          <h3 className="section-title">
            🔬 Examens Complémentaires Recommandés
            <span className="badge-count">{recommandations.recommandations_examens.length}</span>
          </h3>
          
          <div className="recommandations-list">
            {recommandations.recommandations_examens.map((examen, idx) => (
              <div key={idx} className="reco-card">
                <div className="reco-header">
                  <h4>{examen.titre}</h4>
                  {examen.priorite && (
                    <span className={`priority-tag priority-${examen.priorite}`}>
                      {examen.priorite === 'haute' ? '⚡ Urgent' : '📅 À planifier'}
                    </span>
                  )}
                </div>
                
                <p className="reco-detail">{examen.description}</p>
                <div className="reco-action">
                  <strong>✅ Action:</strong> {examen.action}
                </div>
                
                {examen.source && (
                  <div className="reco-source">
                    <span className="source-icon">📚</span>
                    <span>{examen.source}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommandations consultations */}
      {recommandations.recommandations_consultations?.length > 0 && (
        <div className="recommandations-section">
          <h3 className="section-title">
            🩺 Suivi Médical
            <span className="badge-count">{recommandations.recommandations_consultations.length}</span>
          </h3>
          
          <div className="recommandations-list">
            {recommandations.recommandations_consultations.map((consult, idx) => (
              <div key={idx} className="reco-card">
                <h4>{consult.titre}</h4>
                {consult.description && <p className="reco-detail">{consult.description}</p>}
                <div className="reco-action">
                  <strong>✅ Action:</strong> {consult.action}
                </div>
                {consult.source && (
                  <div className="reco-source">
                    <span className="source-icon">📚</span>
                    <span>{consult.source}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Aucune recommandation */}
      {!hasAlertes && !hasRecommandations && (
        <div className="no-recommandations">
          <span className="success-icon">✅</span>
          <h3>Excellent suivi médical</h3>
          <p>Aucune alerte active. Le dossier patient est bien suivi.</p>
        </div>
      )}

      {/* Bouton actualiser */}
      <div className="recommandations-footer">
        <button onClick={fetchRecommandations} className="btn-refresh">
          🔄 Actualiser les recommandations
        </button>
        <p className="footer-note">
          💡 Recommandations générées automatiquement basées sur HAS/ANSM - 
          Toujours valider avec jugement clinique
        </p>
      </div>
    </div>
  );
};

export default PatientRecommandations;