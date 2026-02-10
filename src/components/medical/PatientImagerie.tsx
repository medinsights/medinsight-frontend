import React, { useState } from 'react';
import { ChatbotService } from '../../services/chatbot.service';
import type { Patient } from '../../services/patient.service';

interface PatientImagerieProps {
  patient: Patient;
  patientId: string;
  onUpdate: () => void;
}

const PatientImagerie: React.FC<PatientImagerieProps> = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<any>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
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
      reader.onloadend = () => setPreviewUrl(reader.result as string);
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
      const result = await ChatbotService.analyzeImage(selectedFile);
      setUploadResult(result);
      alert('✅ Analyse terminée !');
      setSelectedFile(null);
      setPreviewUrl(null);
    } catch (error: any) {
      alert(`❌ Erreur: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const getSeverityColor = (severity?: string) => {
    if (!severity || severity === 'Aucune') return '#4caf50';
    if (severity.includes('Faible')) return '#ffc107';
    if (severity.includes('Modérée') || severity.includes('Moderee')) return '#ff9800';
    if (severity.includes('Élevée') || severity.includes('Elevee')) return '#f44336';
    return '#9e9e9e';
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ color: '#f1f5f9', marginBottom: '5px' }}>🔬 Analyse IA - Imagerie Thoracique</h3>
        <p style={{ color: '#94a3b8', fontSize: '14px', margin: 0 }}>Analyse automatisée par Deep Learning (DenseNet121)</p>
      </div>

      {/* Upload Section */}
      <div style={{ background: '#1e293b', borderRadius: '12px', padding: '20px', marginBottom: '20px', border: '1px solid #334155' }}>
        <h4 style={{ color: '#f1f5f9', marginBottom: '15px' }}>📈 Nouvelle Radiographie Thoracique</h4>
        
        <div style={{ display: 'grid', gap: '15px' }}>
          <input
            type="file"
            accept="image/jpeg,image/jpg,image/png"
            onChange={handleFileSelect}
            style={{ color: '#cbd5e1' }}
          />
          
          {previewUrl && (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '20px', background: '#0f172a', borderRadius: '8px' }}>
              <img src={previewUrl} alt="Preview" style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '8px' }} />
            </div>
          )}
          
          <button
            onClick={handleUpload}
            disabled={!selectedFile || isUploading}
            style={{
              background: selectedFile && !isUploading ? '#3b82f6' : '#334155',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 24px',
              fontSize: '15px',
              fontWeight: '600',
              cursor: selectedFile && !isUploading ? 'pointer' : 'not-allowed',
              transition: 'all 0.2s'
            }}
          >
            {isUploading ? '🔄 Analyse en cours...' : '🚀 Analyser'}
          </button>
        </div>
      </div>

      {/* Results */}
      {uploadResult && (
        <div style={{ background: '#1e293b', borderRadius: '12px', padding: '20px', border: '1px solid #334155' }}>
          <h4 style={{ color: '#f1f5f9', marginBottom: '15px' }}>✅ Résultats de l'Analyse</h4>
          
          <div style={{ display: 'grid', gap: '15px' }}>
            {/* Diagnostic */}
            <div style={{ background: '#0f172a', borderRadius: '8px', padding: '15px' }}>
              <strong style={{ color: '#94a3b8', fontSize: '14px', display: 'block', marginBottom: '8px' }}>Diagnostic Principal:</strong>
              <p style={{ color: '#f1f5f9', fontSize: '16px', margin: 0, fontWeight: '600' }}>
                {uploadResult.predicted_class || uploadResult.diagnostic || 'Non disponible'}
              </p>
            </div>

            {/* Confidence */}
            {uploadResult.confidence && (
              <div style={{ background: '#0f172a', borderRadius: '8px', padding: '15px' }}>
                <strong style={{ color: '#94a3b8', fontSize: '14px', display: 'block', marginBottom: '8px' }}>Confiance:</strong>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ flex: 1, background: '#334155', borderRadius: '20px', height: '10px', overflow: 'hidden' }}>
                    <div style={{ 
                      background: '#3b82f6', 
                      height: '100%', 
                      width: `${uploadResult.confidence}%`,
                      borderRadius: '20px',
                      transition: 'width 0.5s'
                    }}></div>
                  </div>
                  <span style={{ color: '#3b82f6', fontWeight: '600', fontSize: '16px' }}>
                    {uploadResult.confidence.toFixed(1)}%
                  </span>
                </div>
              </div>
            )}

            {/* Severity */}
            {uploadResult.severity && (
              <div style={{ background: '#0f172a', borderRadius: '8px', padding: '15px' }}>
                <strong style={{ color: '#94a3b8', fontSize: '14px', display: 'block', marginBottom: '8px' }}>Sévérité:</strong>
                <span style={{ 
                  color: getSeverityColor(uploadResult.severity),
                  fontWeight: '600',
                  fontSize: '16px'
                }}>
                  {uploadResult.severity}
                </span>
              </div>
            )}

            {/* Recommendations */}
            {uploadResult.recommendations && (
              <div style={{ background: '#0f172a', borderRadius: '8px', padding: '15px' }}>
                <strong style={{ color: '#94a3b8', fontSize: '14px', display: 'block', marginBottom: '8px' }}>Recommandations:</strong>
                <p style={{ color: '#cbd5e1', margin: 0, lineHeight: '1.6' }}>{uploadResult.recommendations}</p>
              </div>
            )}

            {/* Top Predictions */}
            {uploadResult.top_predictions && uploadResult.top_predictions.length > 0 && (
              <div style={{ background: '#0f172a', borderRadius: '8px', padding: '15px' }}>
                <strong style={{ color: '#94a3b8', fontSize: '14px', display: 'block', marginBottom: '12px' }}>Top Prédictions:</strong>
                <div style={{ display: 'grid', gap: '8px' }}>
                  {uploadResult.top_predictions.map((pred: any, idx: number) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: '#cbd5e1' }}>{pred.class}</span>
                      <span style={{ color: '#3b82f6', fontWeight: '600' }}>{pred.probability.toFixed(1)}%</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div style={{ marginTop: '15px', padding: '12px', background: 'rgba(251, 191, 36, 0.1)', border: '1px solid #fbbf24', borderRadius: '8px' }}>
            <p style={{ color: '#fbbf24', fontSize: '13px', margin: 0 }}>
              ⚠️ Cette analyse est générée par IA et doit être validée par un radiologue. Elle ne remplace pas un diagnostic médical professionnel.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientImagerie;
