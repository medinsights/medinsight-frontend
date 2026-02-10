// frontend/src/components/AnalysisHistory.jsx
import React, { useState, useEffect } from 'react';
import './AnalysisHistory.css';

const AnalysisHistory = ({ patientId }) => {
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);

  useEffect(() => {
    if (patientId) {
      fetchAnalyses();
    }
  }, [patientId]);

  const fetchAnalyses = async () => {
    try {
      setLoading(true);
      console.log(`🔍 Chargement analyses pour patient ${patientId}...`);
      
      const response = await fetch(`http://localhost:8000/api/patients/${patientId}/analyses`);
      const data = await response.json();
      
      console.log('📦 Analyses reçues:', data);
      console.log('📊 Type:', Array.isArray(data) ? 'Array' : typeof data);
      console.log('📏 Nombre:', Array.isArray(data) ? data.length : 'N/A');
      
      // CORRECTION: data est directement un tableau, pas data.analyses
      setAnalyses(data || []);
    } catch (error) {
      console.error('❌ Erreur chargement analyses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = async (analysisId) => {
    try {
      const response = await fetch(`http://localhost:8000/api/analyses/${analysisId}/export-pdf`);
      
      if (!response.ok) {
        throw new Error('Erreur export PDF');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `rapport_analyse_${analysisId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      alert('Rapport PDF téléchargé !');
    } catch (error) {
      console.error('Erreur export:', error);
      alert('Erreur lors de l\'export du PDF');
    }
  };

  const getSeverityColor = (gravite) => {
    if (!gravite) return '#4CAF50';
    const g = gravite.toLowerCase();
    if (g.includes('red') || g.includes('urgent')) return '#F44336';
    if (g.includes('yellow') || g.includes('attention')) return '#FF9800';
    return '#4CAF50';
  };

  const getSeverityIcon = (gravite) => {
    if (!gravite) return '🟢';
    const g = gravite.toLowerCase();
    if (g.includes('red') || g.includes('urgent')) return '🔴';
    if (g.includes('yellow') || g.includes('attention')) return '🟡';
    return '🟢';
  };

  if (!patientId) {
    return (
      <div className="analysis-history">
        <div className="empty-state">
          <p>📋 Veuillez sélectionner un patient</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="analysis-history">
        <div className="loading">⏳ Chargement des analyses...</div>
      </div>
    );
  }

  return (
    <div className="analysis-history">
      <h2>📊 Historique des Analyses - Patient #{patientId}</h2>
      
      {analyses.length === 0 ? (
        <div className="empty-state">
          <p>📋 Aucune analyse enregistrée pour ce patient</p>
          <p>💡 Uploadez un document PDF dans l'onglet "Analyse Document"</p>
        </div>
      ) : (
        <div className="analyses-list">
          <p className="analyses-count">📊 {analyses.length} analyse(s) trouvée(s)</p>
          
          {analyses.map(analysis => (
            <div key={analysis.id} className="analysis-card">
              <div className="analysis-header">
                <div className="analysis-title">
                  <h3>📄 {analysis.filename || 'Document médical'}</h3>
                  <span className="analysis-date">
                    📅 {analysis.date_analyse || 'Date non spécifiée'}
                  </span>
                  <span className="analysis-created">
                    🕒 Créé le {new Date(analysis.created_at).toLocaleString('fr-FR')}
                  </span>
                </div>
                <button 
                  className="btn-export"
                  onClick={() => handleExportPDF(analysis.id)}
                  title="Télécharger le rapport PDF"
                >
                  📥 Export PDF
                </button>
              </div>

              {analysis.alertes && Array.isArray(analysis.alertes) && analysis.alertes.length > 0 && (
                <div className="alerts-summary">
                  <h4>⚠️ Anomalies détectées ({analysis.alertes.length})</h4>
                  <div className="alerts-grid">
                    {analysis.alertes.map((alerte, idx) => (
                      <div 
                        key={idx} 
                        className="alert-mini"
                        style={{ borderLeftColor: getSeverityColor(alerte.gravite) }}
                      >
                        <div className="alert-param">
                          {getSeverityIcon(alerte.gravite)} {alerte.parametre}
                        </div>
                        <div className="alert-value">
                          {alerte.valeur}
                        </div>
                        <div className="alert-norm">
                          Norme: {alerte.norme}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {analysis.recommandations && (
                <div className="recommendations">
                  <strong>💡 Recommandations:</strong>
                  <p>{analysis.recommandations}</p>
                </div>
              )}

              <button 
                className="btn-details"
                onClick={() => setSelectedAnalysis(
                  selectedAnalysis?.id === analysis.id ? null : analysis
                )}
              >
                {selectedAnalysis?.id === analysis.id ? '▲ Masquer détails' : '▼ Voir détails'}
              </button>

              {selectedAnalysis?.id === analysis.id && (
                <div className="analysis-details">
                  <h4>📄 Texte extrait (OCR)</h4>
                  <pre className="ocr-text">{analysis.texte_ocr || 'Aucun texte extrait'}</pre>
                  
                  {analysis.resultats && (
                    <>
                      <h4>📊 Résultats</h4>
                      <pre className="json-data">{JSON.stringify(analysis.resultats, null, 2)}</pre>
                    </>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AnalysisHistory;