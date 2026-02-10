// frontend/src/components/patient/PatientAnalyses.jsx
import React, { useState, useEffect } from 'react';
import './PatientAnalyses.css';

const PatientAnalyses = ({ patient, patientId }) => {
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [expandedAnalysis, setExpandedAnalysis] = useState(null);

  // Debug logs
  useEffect(() => {
    console.log('🔍 PatientAnalyses - Props reçues:', { 
      patient, 
      patientId,
      patientIdType: typeof patientId 
    });
  }, [patient, patientId]);

  useEffect(() => {
    if (patientId) {
      fetchAnalyses();
    }
  }, [patientId]);

  const fetchAnalyses = async () => {
    try {
      console.log('📥 Chargement analyses pour patient:', patientId);
      const response = await fetch(`http://localhost:8000/api/patients/${patientId}/analyses`);
      const data = await response.json();
      console.log('✅ Analyses chargées:', data);
      setAnalyses(data || []);
    } catch (error) {
      console.error('❌ Erreur chargement analyses:', error);
      setAnalyses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
      console.log('📄 Fichier sélectionné:', file.name);
    } else {
      alert('⚠️ Veuillez sélectionner un fichier PDF');
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('⚠️ Veuillez sélectionner un fichier');
      return;
    }

    if (!patientId) {
      alert('❌ Erreur: ID patient manquant');
      console.error('❌ patientId est:', patientId);
      return;
    }

    console.log('📤 Début upload');
    console.log('   - Fichier:', selectedFile.name);
    console.log('   - Taille:', (selectedFile.size / 1024).toFixed(1), 'KB');
    console.log('   - Patient ID:', patientId);
    console.log('   - Type patient ID:', typeof patientId);

    setUploading(true);

    try {
      // Créer FormData
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('patient_id', String(patientId)); // Convertir en string explicitement

      console.log('📤 FormData créé');
      
      // Vérifier le contenu du FormData
      for (let [key, value] of formData.entries()) {
        console.log(`   ${key}:`, value);
      }

      // Envoyer la requête
      const response = await fetch('http://localhost:8000/api/analyze-document', {
        method: 'POST',
        body: formData
        // PAS de Content-Type header avec FormData !
      });

      console.log('📥 Response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Réponse serveur:', data);
        
        alert('✅ Analyse importée avec succès !');
        setSelectedFile(null);
        
        // Recharger les analyses
        await fetchAnalyses();
        
      } else {
        const error = await response.json();
        console.error('❌ Erreur serveur:', error);
        alert(`❌ Erreur: ${error.error || 'Import échoué'}`);
      }
      
    } catch (error) {
      console.error('❌ Erreur upload:', error);
      alert('❌ Erreur lors de l\'import: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const getSeverityColor = (gravite) => {
    switch (gravite?.toLowerCase()) {
      case 'red':
      case 'rouge':
        return '#ef4444';
      case 'yellow':
      case 'jaune':
        return '#f59e0b';
      case 'green':
      case 'vert':
        return '#22c55e';
      default:
        return '#94a3b8';
    }
  };

  const getSeverityIcon = (gravite) => {
    switch (gravite?.toLowerCase()) {
      case 'red':
      case 'rouge':
        return '🔴';
      case 'yellow':
      case 'jaune':
        return '🟡';
      case 'green':
      case 'vert':
        return '🟢';
      default:
        return '⚪';
    }
  };

  // Fonction pour parser les alertes (si c'est du texte)
  const parseAlertes = (alertesData) => {
    if (!alertesData) return [];
    
    // Si c'est déjà un array
    if (Array.isArray(alertesData)) {
      return alertesData;
    }
    
    // Si c'est du JSON string
    if (typeof alertesData === 'string') {
      try {
        const parsed = JSON.parse(alertesData);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {
        console.log('Alertes non-JSON, retour texte brut');
      }
    }
    
    return [];
  };

  // Fonction pour parser les résultats
  const parseResultats = (resultatsData) => {
    if (!resultatsData) return null;
    
    // Si c'est déjà un objet
    if (typeof resultatsData === 'object' && !Array.isArray(resultatsData)) {
      return resultatsData;
    }
    
    // Si c'est du JSON string
    if (typeof resultatsData === 'string') {
      try {
        const parsed = JSON.parse(resultatsData);
        if (typeof parsed === 'object') return parsed;
      } catch (e) {
        console.log('Résultats non-JSON');
      }
    }
    
    return null;
  };

  if (loading) {
    return (
      <div className="analyses-loading">
        <div className="spinner"></div>
        <p>Chargement des analyses...</p>
      </div>
    );
  }

  return (
    <div className="patient-analyses">
      {/* Import Section */}
      <div className="import-section">
        <div className="import-card">
          <div className="import-header">
            <h3>📤 Importer une Analyse</h3>
            <p>Téléchargez un PDF d'analyse biologique pour extraction automatique</p>
          </div>

          <div className="import-body">
            <div className="file-input-wrapper">
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileSelect}
                id="file-input"
                className="file-input-hidden"
              />
              <label htmlFor="file-input" className="file-input-label">
                {selectedFile ? (
                  <>
                    <span className="file-icon">📄</span>
                    <span className="file-name">{selectedFile.name}</span>
                    <span className="file-size">
                      ({(selectedFile.size / 1024).toFixed(1)} KB)
                    </span>
                  </>
                ) : (
                  <>
                    <span className="upload-icon">📁</span>
                    <span>Cliquez pour sélectionner un PDF</span>
                  </>
                )}
              </label>
            </div>

            {selectedFile && (
              <div className="import-actions">
                <button
                  className="btn-cancel"
                  onClick={() => setSelectedFile(null)}
                  disabled={uploading}
                >
                  ❌ Annuler
                </button>
                <button
                  className="btn-upload"
                  onClick={handleUpload}
                  disabled={uploading}
                >
                  {uploading ? '⏳ Import en cours...' : '✅ Importer l\'analyse'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Analyses List */}
      <div className="analyses-list">
        <div className="list-header">
          <h3>📊 Historique des Analyses</h3>
          <span className="analyses-count">
            {analyses.length} analyse{analyses.length > 1 ? 's' : ''}
          </span>
        </div>

        {analyses.length === 0 ? (
          <div className="empty-analyses">
            <span className="empty-icon">📋</span>
            <h4>Aucune analyse enregistrée</h4>
            <p>Importez la première analyse biologique pour ce patient</p>
          </div>
        ) : (
          <div className="analyses-timeline">
            {analyses.map((analysis) => {
              const alertes = parseAlertes(analysis.alertes);
              const resultats = parseResultats(analysis.resultats);

              return (
                <div
                  key={analysis.id}
                  className={`analysis-card ${expandedAnalysis === analysis.id ? 'expanded' : ''}`}
                >
                  {/* Header */}
                  <div
                    className="analysis-header"
                    onClick={() => setExpandedAnalysis(
                      expandedAnalysis === analysis.id ? null : analysis.id
                    )}
                  >
                    <div className="analysis-date-badge">
                      <span className="date-icon">📅</span>
                      <span className="date-text">{formatDate(analysis.date_analyse)}</span>
                    </div>

                    <div className="analysis-title">
                      <h4>{analysis.type_analyse || 'Analyse biologique'}</h4>
                      {analysis.filename && (
                        <span className="analysis-filename">📄 {analysis.filename}</span>
                      )}
                    </div>

                    <button className="expand-btn">
                      {expandedAnalysis === analysis.id ? '▼' : '▶'}
                    </button>
                  </div>

                  {/* Expanded Content */}
                  {expandedAnalysis === analysis.id && (
                    <div className="analysis-content">
                      {/* Alertes */}
                      {alertes && alertes.length > 0 && (
                        <div className="alertes-section">
                          <h5>⚠️ Résultats Hors Normes</h5>
                          <div className="alertes-grid">
                            {alertes.map((alerte, idx) => (
                              <div
                                key={idx}
                                className="alerte-item"
                                style={{ borderLeftColor: getSeverityColor(alerte.gravite) }}
                              >
                                <div className="alerte-header">
                                  <span className="alerte-icon">
                                    {getSeverityIcon(alerte.gravite)}
                                  </span>
                                  <strong>{alerte.parametre}</strong>
                                </div>
                                <div className="alerte-values">
                                  <span className="alerte-value">
                                    Valeur: <strong>{alerte.valeur}</strong>
                                  </span>
                                  <span className="alerte-norm">
                                    Norme: {alerte.norme}
                                  </span>
                                </div>
                                {alerte.explication && (
                                  <p className="alerte-explanation">
                                    {alerte.explication}
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Résultats */}
                      {resultats && Object.keys(resultats).length > 0 && (
                        <div className="resultats-section">
                          <h5>📊 Résultats</h5>
                          <div className="resultats-table">
                            {Object.entries(resultats).map(([key, value]) => (
                              <div key={key} className="resultat-row">
                                <span className="resultat-key">{key}</span>
                                <span className="resultat-value">
                                  {typeof value === 'object' ? JSON.stringify(value) : value}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Résultats en texte brut si pas de structure */}
                      {analysis.resultats && !resultats && (
                        <div className="resultats-section">
                          <h5>📊 Résultats</h5>
                          <div className="resultats-text">
                            {typeof analysis.resultats === 'string' 
                              ? analysis.resultats 
                              : JSON.stringify(analysis.resultats, null, 2)}
                          </div>
                        </div>
                      )}

                      {/* Recommandations */}
                      {analysis.recommandations && (
                        <div className="recommandations-section">
                          <h5>💡 Recommandations</h5>
                          <div className="recommandations-text">
                            {analysis.recommandations}
                          </div>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="analysis-actions">
                        <button className="action-btn">
                          📊 Voir graphique d'évolution
                        </button>
                        <button className="action-btn">
                          📄 Télécharger le PDF
                        </button>
                        <button className="action-btn">
                          🖨️ Imprimer le rapport
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientAnalyses;