import React, { useState, useEffect } from 'react';
import { PatientService } from '../../services/patient.service';
import { ChatbotService } from '../../services/chatbot.service';
import type { Patient, MedicalAnalysis } from '../../services/patient.service';

interface PatientAnalysesProps {
  patient: Patient;
  patientId: string;
  onUpdate: () => void;
}

const PatientAnalyses: React.FC<PatientAnalysesProps> = ({ patientId }) => {
  const [analyses, setAnalyses] = useState<MedicalAnalysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [expandedAnalysis, setExpandedAnalysis] = useState<number | null>(null);

  useEffect(() => {
    if (patientId) fetchAnalyses();
  }, [patientId]);

  const fetchAnalyses = async () => {
    try {
      const id = typeof patientId === 'string' ? parseInt(patientId) : patientId;
      const data = await PatientService.getMedicalAnalyses(id);
      setAnalyses(data || []);
    } catch (error) {
      console.error('❌ Erreur chargement analyses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
    } else {
      alert('⚠️ Veuillez sélectionner un fichier PDF');
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !patientId) return;
    setUploading(true);
    try {
      const id = typeof patientId === 'string' ? parseInt(patientId) : patientId;
      await ChatbotService.analyzeDocument(selectedFile, id, 'Analyse biologique');
      alert('✅ Analyse importée avec succès !');
      setSelectedFile(null);
      await fetchAnalyses();
    } catch (error: any) {
      alert(`❌ Erreur: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
  };

  return (
    <div style={{ padding: '20px' }}>
      {/* Upload */}
      <div style={{ background: '#1e293b', borderRadius: '12px', padding: '20px', marginBottom: '20px', border: '1px solid #334155' }}>
        <h3 style={{ color: '#f1f5f9', marginBottom: '15px' }}>📤 Importer une Analyse</h3>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <input type="file" accept=".pdf" onChange={handleFileSelect} style={{ flex: 1, color: '#cbd5e1' }} />
          <button onClick={handleUpload} disabled={!selectedFile || uploading} style={{
            background: selectedFile && !uploading ? '#3b82f6' : '#334155',
            color: 'white', border: 'none', borderRadius: '8px', padding: '10px 20px',
            cursor: selectedFile && !uploading ? 'pointer' : 'not-allowed'
          }}>
            {uploading ? 'Import...' : 'Importer'}
          </button>
        </div>
      </div>

      {/* List */}
      <div>
        <h3 style={{ color: '#f1f5f9', marginBottom: '15px' }}>🔬 Historique des Analyses</h3>
        {loading ? (
          <p style={{ color: '#94a3b8' }}>Chargement...</p>
        ) : analyses.length === 0 ? (
          <p style={{ color: '#94a3b8' }}>Aucune analyse</p>
        ) : (
          <div style={{ display: 'grid', gap: '15px' }}>
            {analyses.map((analysis) => (
              <div key={analysis.id} style={{ background: '#1e293b', borderRadius: '12px', padding: '20px', border: '1px solid #334155' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <h4 style={{ color: '#f1f5f9', margin: 0 }}>{analysis.type_analyse}</h4>
                  <span style={{ color: '#94a3b8', fontSize: '14px' }}>{formatDate(analysis.date_analyse)}</span>
                </div>
                <button onClick={() => setExpandedAnalysis(expandedAnalysis === analysis.id ? null : (analysis.id ?? null))} style={{
                  background: '#334155', color: '#cbd5e1', border: 'none', borderRadius: '6px',
                  padding: '8px 16px', cursor: 'pointer', fontSize: '14px'
                }}>
                  {expandedAnalysis === analysis.id ? 'Masquer' : 'Voir détails'}
                </button>
                {expandedAnalysis === analysis.id && (
                  <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px solid #334155' }}>
                    <p style={{ color: '#cbd5e1', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>{analysis.interpretation || 'Aucune interprétation'}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientAnalyses;
