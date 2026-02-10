// frontend/src/components/DocumentAnalyzer.jsx
import React, { useState, useEffect } from 'react';
import './DocumentAnalyzer.css';

const DocumentAnalyzer = ({ patientId }) => {
  const [file, setFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState(null);

  // Debug: Afficher quand patientId change
  useEffect(() => {
    console.log('DocumentAnalyzer - patientId changé:', patientId);
  }, [patientId]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setError(null);
      setAnalysis(null);
      console.log('Fichier sélectionné:', selectedFile.name);
    } else {
      setError('Veuillez sélectionner un fichier PDF');
      setFile(null);
    }
  };

  const handleAnalyze = async () => {
    if (!file) {
      setError('Veuillez sélectionner un fichier');
      return;
    }

    console.log('=== DÉBUT ANALYSE ===');
    console.log('Patient ID:', patientId);
    console.log('Type de patientId:', typeof patientId);
    console.log('Fichier:', file.name);

    setIsAnalyzing(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    // Construire l'URL avec patient_id
    let url = 'http://localhost:8000/api/analyze-document';
    if (patientId) {
      url += `?patient_id=${patientId}`;
      console.log('✅ Patient sélectionné, URL:', url);
    } else {
      console.warn('⚠️ AUCUN PATIENT SÉLECTIONNÉ !');
      console.warn('L\'analyse ne sera PAS sauvegardée !');
    }

    try {
      console.log('Envoi requête à:', url);
      
      const response = await fetch(url, {
        method: 'POST',
        body: formData
      });

      console.log('Status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      console.log('=== RÉPONSE BACKEND ===');
      console.log('Success:', data.success);
      console.log('Analysis ID:', data.analysis_id);
      console.log('Alerts:', data.alerts?.length);
      console.log('Full data:', data);
      
      setAnalysis(data);
      
      if (data.analysis_id) {
        console.log('✅ SUCCÈS: Analyse sauvegardée avec ID', data.analysis_id);
        alert(`✅ Analyse sauvegardée avec l'ID ${data.analysis_id}`);
      } else if (patientId) {
        console.error('❌ ERREUR: patient_id était fourni mais analysis_id manque !');
        console.error('Le backend n\'a PAS sauvegardé l\'analyse !');
        alert('⚠️ Analyse effectuée mais NON sauvegardée dans la base !');
      } else {
        console.warn('ℹ️ Analyse effectuée sans patient (normal si aucun patient sélectionné)');
      }
    } catch (err) {
      console.error('=== ERREUR ===');
      console.error('Message:', err.message);
      console.error('Stack:', err);
      setError(err.message || 'Erreur lors de l\'analyse du document');
    } finally {
      setIsAnalyzing(false);
      console.log('=== FIN ANALYSE ===');
    }
  };

  const getSeverityIcon = (severity) => {
    if (!severity) return '🟢 Normal';
    const s = severity.toLowerCase();
    if (s.includes('red') || s.includes('urgent')) return '🔴 Urgent';
    if (s.includes('yellow') || s.includes('attention')) return '🟡 Attention';
    return '🟢 Normal';
  };

  return (
    <div className="document-analyzer">
      <div className="upload-section">
        <h2>📄 Analyse de Document Médical</h2>
        <p>Importez un PDF d'analyses médicales pour détecter les valeurs hors normes</p>
        
        {/* DEBUG INFO */}
        <div style={{
          background: '#f0f0f0', 
          padding: '10px', 
          marginBottom: '20px', 
          borderRadius: '5px',
          fontSize: '12px',
          fontFamily: 'monospace'
        }}>
          <strong>🔍 DEBUG:</strong><br/>
          Patient ID: {patientId ? `✅ ${patientId}` : '❌ Non sélectionné'}<br/>
          Type: {typeof patientId}<br/>
          Sera sauvegardé: {patientId ? '✅ OUI' : '❌ NON'}
        </div>
        
        {patientId && (
          <div className="patient-info-banner">
            ✅ L'analyse sera automatiquement sauvegardée pour le patient #{patientId}
          </div>
        )}
        
        {!patientId && (
          <div className="patient-warning-banner">
            ⚠️ Aucun patient sélectionné ! L'analyse ne sera PAS sauvegardée.
          </div>
        )}
        
        <div className="file-input-wrapper">
          <label htmlFor="file-upload" className="file-label">
            {file ? `📎 ${file.name}` : '📁 Choisir un fichier PDF'}
          </label>
          <input
            id="file-upload"
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="file-input"
          />
        </div>

        <button
          onClick={handleAnalyze}
          disabled={!file || isAnalyzing}
          className="analyze-button"
        >
          {isAnalyzing ? '🔄 Analyse en cours...' : '🔬 Analyser le document'}
        </button>

        {error && (
          <div className="error-message">
            ❌ {error}
          </div>
        )}
      </div>

      {analysis && (
        <div className="analysis-results">
          <h3>📋 Résultats de l'Analyse</h3>
          
          {analysis.patient_info && (
            <div className="patient-info">
              <h4>👤 Informations Patient</h4>
              <p><strong>Nom:</strong> {analysis.patient_info.nom || 'N/A'}</p>
              <p><strong>Âge:</strong> {analysis.patient_info.age || 'N/A'}</p>
              <p><strong>Date:</strong> {analysis.patient_info.date || 'N/A'}</p>
            </div>
          )}

          {analysis.alerts && analysis.alerts.length > 0 && (
            <div className="alerts-section">
              <h4>⚠️ Valeurs Hors Normes Détectées</h4>
              {analysis.alerts.map((alert, index) => (
                <div key={index} className={`alert-card severity-${alert.gravite}`}>
                  <div className="alert-header">
                    <span className="severity">{getSeverityIcon(alert.gravite)}</span>
                    <strong>{alert.parametre}</strong>
                  </div>
                  <div className="alert-details">
                    <p><strong>Valeur mesurée:</strong> {alert.valeur}</p>
                    <p><strong>Norme:</strong> {alert.norme}</p>
                    <p><strong>Explication:</strong> {alert.explication}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {analysis.recommendations && (
            <div className="recommendations">
              <h4>💡 Recommandations</h4>
              <p>{analysis.recommendations}</p>
            </div>
          )}

          {analysis.full_analysis && !analysis.alerts && (
            <div className="full-analysis">
              <h4>📝 Analyse Complète</h4>
              <pre>{analysis.full_analysis}</pre>
            </div>
          )}
          
          {analysis.analysis_id && (
            <div className="save-confirmation">
              ✅ Analyse sauvegardée avec l'ID #{analysis.analysis_id}
            </div>
          )}
          
          {!analysis.analysis_id && patientId && (
            <div className="save-warning">
              ⚠️ L'analyse n'a PAS été sauvegardée ! Vérifiez les logs.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DocumentAnalyzer;