// frontend/src/components/patient/PatientImagerie.jsx - VERSION FINALE IA
import React, { useState, useEffect } from 'react';
import './PatientImagerie.css';

const PatientImagerie = ({ patientId, patient }) => {
  const [analyses, setAnalyses] = useState([]);
  const [showUpload, setShowUpload] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [indication, setIndication] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);

  useEffect(() => {
    loadAnalyses();
  }, [patientId]);

  const loadAnalyses = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/patients/${patientId}/imagerie`);
      const data = await response.json();
      setAnalyses(data || []);
      console.log('✅ Analyses chargées:', data);
    } catch (error) {
      console.error('❌ Erreur chargement analyses:', error);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.match('image/(jpeg|jpg|png)')) {
        alert('❌ Format non supporté. Utilisez JPEG ou PNG.');
        return;
      }
      
      if (file.size > 10 * 1024 * 1024) {
        alert('❌ Fichier trop volumineux (max 10 MB)');
        return;
      }
      
      setSelectedFile(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('⚠️ Veuillez sélectionner une image');
      return;
    }

    setIsUploading(true);
    setUploadResult(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('patient_id', patientId);
      formData.append('indication', indication || 'Non précisée');

      console.log('📤 Upload vers /api/imagerie/thorax/analyze');

      const response = await fetch('http://localhost:8000/api/imagerie/thorax/analyze', {
        method: 'POST',
        body: formData
      });

      console.log('📥 Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || errorData.detail || 'Erreur serveur');
      }

      const result = await response.json();
      console.log('✅ Résultat:', result);

      setUploadResult(result);
      
      await loadAnalyses();
      
      setSelectedFile(null);
      setPreviewUrl(null);
      setIndication('');
      setShowUpload(false);

    } catch (error) {
      console.error('❌ Erreur upload:', error);
      alert(`❌ Erreur: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const viewAnalysis = (analysis) => {
    setSelectedAnalysis(analysis);
    setUploadResult(null);
  };

  const closeModal = () => {
    setSelectedAnalysis(null);
    setUploadResult(null);
  };

  const getSeverityColor = (severite) => {
    if (!severite || severite === 'Aucune') return '#4caf50';
    if (severite.includes('Faible')) return '#ffc107';
    if (severite.includes('Modérée') || severite.includes('Moderee')) return '#ff9800';
    if (severite.includes('Élevée') || severite.includes('Elevee')) return '#f44336';
    return '#9e9e9e';
  };

  const getDiagnosticIcon = (diagnostic) => {
    if (diagnostic.includes('Normal')) return '✅';
    if (diagnostic.includes('Pneumonie')) return '🦠';
    if (diagnostic.includes('Insuffisance') || diagnostic.includes('Cardiaque')) return '❤️';
    return '🔍';
  };

  return (
    <div className="patient-imagerie">
      {/* Header */}
      <div className="imagerie-header">
        <div className="header-left">
          <h3>🔬 Analyse IA - Imagerie Thoracique</h3>
          <p className="subtitle">Analyse automatisée par Deep Learning (DenseNet121)</p>
        </div>
        <button 
          className="btn-upload-new"
          onClick={() => setShowUpload(!showUpload)}
        >
          {showUpload ? '❌ Annuler' : '📤 Analyser une Radio'}
        </button>
      </div>

      {/* Zone Upload */}
      {showUpload && (
        <div className="upload-section">
          <h4>📸 Nouvelle Radiographie Thoracique</h4>
          
          <div className="upload-form">
            <div className="file-input-area">
              <input
                type="file"
                id="imageFile"
                accept="image/jpeg,image/jpg,image/png"
                onChange={handleFileSelect}
                disabled={isUploading}
                style={{ display: 'none' }}
              />
              <label htmlFor="imageFile" className="file-input-label">
                📁 Sélectionner une radiographie
              </label>
              {selectedFile && (
                <span className="file-name">✅ {selectedFile.name}</span>
              )}
            </div>

            {previewUrl && (
              <div className="image-preview">
                <img src={previewUrl} alt="Prévisualisation" />
                <p className="preview-info">Taille: {(selectedFile.size / 1024).toFixed(1)} KB</p>
              </div>
            )}

            <div className="indication-input">
              <label>💬 Indication clinique :</label>
              <textarea
                value={indication}
                onChange={(e) => setIndication(e.target.value)}
                placeholder="Ex: Toux + fièvre depuis 3 jours, suspicion pneumonie..."
                rows="3"
                disabled={isUploading}
              />
            </div>

            <button
              className="btn-analyze"
              onClick={handleUpload}
              disabled={!selectedFile || isUploading}
            >
              {isUploading ? '⏳ Analyse IA en cours...' : '🚀 Lancer Analyse IA'}
            </button>
          </div>
        </div>
      )}

      {/* Résultat Upload Récent */}
      {uploadResult && uploadResult.success && (
        <div className="upload-result-card">
          <div className="result-header">
            <h4>✅ Analyse Terminée (ID: {uploadResult.analyse_id})</h4>
            <button onClick={() => setUploadResult(null)}>✕</button>
          </div>
          
          <div className="result-main">
            <div className="diagnostic-section">
              <div className="diagnostic-label">
                {getDiagnosticIcon(uploadResult.diagnostic_ia)} Diagnostic IA :
              </div>
              <div className="diagnostic-value" style={{ color: getSeverityColor(uploadResult.severite) }}>
                {uploadResult.diagnostic_ia}
              </div>
            </div>

            <div className="confidence-section">
              <div className="confidence-label">📊 Niveau de confiance :</div>
              <div className="confidence-bar">
                <div 
                  className="confidence-fill" 
                  style={{ 
                    width: `${uploadResult.confiance}%`,
                    background: uploadResult.confiance >= 70 ? '#4caf50' : uploadResult.confiance >= 50 ? '#ff9800' : '#f44336'
                  }}
                >
                  {uploadResult.confiance}%
                </div>
              </div>
            </div>

            <div className="severite-section">
              <span className="severite-badge" style={{ background: getSeverityColor(uploadResult.severite) }}>
                Sévérité : {uploadResult.severite}
              </span>
            </div>
          </div>

          {/* Probabilités */}
          {uploadResult.metadata?.probabilites && (
            <div className="probabilities-section">
              <h5>📈 Distribution des probabilités :</h5>
              <div className="prob-bars">
                {Object.entries(uploadResult.metadata.probabilites).map(([classe, prob]) => (
                  <div key={classe} className="prob-item">
                    <div className="prob-label">{classe}</div>
                    <div className="prob-bar">
                      <div 
                        className="prob-fill" 
                        style={{ width: `${prob}%` }}
                      ></div>
                    </div>
                    <div className="prob-value">{prob.toFixed(1)}%</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Anomalies */}
          {uploadResult.anomalies_detectees && uploadResult.anomalies_detectees.length > 0 && (
            <div className="anomalies-section">
              <h5>⚠️ Anomalies Détectées :</h5>
              <ul>
                {uploadResult.anomalies_detectees.map((anomalie, idx) => (
                  <li key={idx}>{anomalie}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Recommandations */}
          {uploadResult.recommandations && uploadResult.recommandations.length > 0 && (
            <div className="recommendations-section">
              <h5>💊 Recommandations HAS :</h5>
              <ul>
                {uploadResult.recommandations.map((reco, idx) => (
                  <li key={idx}>{reco}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Corrélation Biologie */}
          {uploadResult.correlation_biologie && (
            <div className="correlation-section">
              <h5>🔗 Corrélation Biologique :</h5>
              <div className={`correlation-message ${uploadResult.correlation_biologie.coherent ? 'coherent' : 'no-data'}`}>
                {uploadResult.correlation_biologie.message}
              </div>
              {uploadResult.correlation_biologie.marqueurs && uploadResult.correlation_biologie.marqueurs.length > 0 && (
                <div className="marqueurs-list">
                  {uploadResult.correlation_biologie.marqueurs.map((marqueur, idx) => (
                    <span key={idx} className="marqueur-badge">✓ {marqueur}</span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Historique */}
      <div className="analyses-history">
        <h4>📋 Historique des Analyses IA ({analyses.length})</h4>
        
        {analyses.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🔬</div>
            <p>Aucune analyse d'imagerie pour ce patient</p>
            <button className="btn-first-upload" onClick={() => setShowUpload(true)}>
              📤 Uploader première radiographie
            </button>
          </div>
        ) : (
          <div className="analyses-grid">
            {analyses.map((analyse) => (
              <div key={analyse.id} className="analysis-card">
                <div className="card-header">
                  <span className="card-date">
                    📅 {new Date(analyse.date_examen).toLocaleDateString('fr-FR')}
                  </span>
                  <span className="card-id">#{analyse.id}</span>
                </div>
                
                <div className="card-body">
                  <div className="card-diagnostic">
                    <span className="diagnostic-icon">{getDiagnosticIcon(analyse.diagnostic_ia)}</span>
                    <span className="diagnostic-text">{analyse.diagnostic_ia}</span>
                  </div>
                  
                  <div className="card-confidence">
                    <div className="confidence-mini-bar">
                      <div 
                        className="confidence-mini-fill" 
                        style={{ width: `${analyse.confiance}%` }}
                      ></div>
                    </div>
                    <span className="confidence-text">{analyse.confiance}%</span>
                  </div>
                  
                  {analyse.severite && analyse.severite !== 'Aucune' && (
                    <div className="card-severite">
                      <span 
                        className="severite-mini-badge" 
                        style={{ background: getSeverityColor(analyse.severite) }}
                      >
                        {analyse.severite}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="card-footer">
                  <button 
                    className="btn-view-details"
                    onClick={() => viewAnalysis(analyse)}
                  >
                    👁️ Voir Détails Complets
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Détails */}
      {selectedAnalysis && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>📊 Analyse Détaillée #{selectedAnalysis.id}</h3>
              <button className="modal-close" onClick={closeModal}>✕</button>
            </div>
            
            <div className="modal-body">
              <div className="detail-grid">
                <div className="detail-item">
                  <span className="detail-label">📅 Date:</span>
                  <span className="detail-value">
                    {new Date(selectedAnalysis.date_examen).toLocaleString('fr-FR')}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">🔍 Diagnostic:</span>
                  <span className="detail-value">{selectedAnalysis.diagnostic_ia}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">📊 Confiance:</span>
                  <span className="detail-value">{selectedAnalysis.confiance}%</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">⚠️ Sévérité:</span>
                  <span className="detail-value">{selectedAnalysis.severite}</span>
                </div>
              </div>

              {selectedAnalysis.indication && (
                <div className="modal-section">
                  <h5>💬 Indication Clinique:</h5>
                  <p>{selectedAnalysis.indication}</p>
                </div>
              )}

              {selectedAnalysis.anomalies_detectees && selectedAnalysis.anomalies_detectees.length > 0 && (
                <div className="modal-section">
                  <h5>⚠️ Anomalies Détectées:</h5>
                  <ul>
                    {selectedAnalysis.anomalies_detectees.map((anomalie, idx) => (
                      <li key={idx}>{anomalie}</li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedAnalysis.recommandations && selectedAnalysis.recommandations.length > 0 && (
                <div className="modal-section">
                  <h5>💊 Recommandations HAS:</h5>
                  <ul>
                    {selectedAnalysis.recommandations.map((reco, idx) => (
                      <li key={idx}>{reco}</li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedAnalysis.correlation_biologie && (
                <div className="modal-section">
                  <h5>🔗 Corrélation Biologique:</h5>
                  <p className={selectedAnalysis.correlation_biologie.coherent ? 'text-success' : ''}>
                    {selectedAnalysis.correlation_biologie.message}
                  </p>
                  {selectedAnalysis.correlation_biologie.marqueurs && 
                   selectedAnalysis.correlation_biologie.marqueurs.length > 0 && (
                    <div className="marqueurs-list">
                      {selectedAnalysis.correlation_biologie.marqueurs.map((m, idx) => (
                        <span key={idx} className="marqueur-badge">✓ {m}</span>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {selectedAnalysis.metadata && (
                <div className="modal-section metadata-section">
                  <h5>ℹ️ Métadonnées Techniques:</h5>
                  <div className="metadata-grid">
                    <div><strong>Modèle:</strong> {selectedAnalysis.metadata.version_modele}</div>
                    <div><strong>Mode:</strong> {selectedAnalysis.metadata.mode_inference}</div>
                    {selectedAnalysis.metadata.taille_bytes && (
                      <div><strong>Taille:</strong> {(selectedAnalysis.metadata.taille_bytes / 1024).toFixed(1)} KB</div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button className="btn-close-modal" onClick={closeModal}>
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientImagerie;