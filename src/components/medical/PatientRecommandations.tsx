import React, { useState, useEffect } from 'react';
import { ChatbotService } from '../../services/chatbot.service';
import type { Patient } from '../../services/patient.service';

interface PatientRecommandationsProps {
  patient: Patient;
  patientId: string;
  onUpdate: () => void;
}

const PatientRecommandations: React.FC<PatientRecommandationsProps> = ({ patientId }) => {
  const [recommandations, setRecommandations] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (patientId) {
      fetchRecommandations();
    }
  }, [patientId]);

  const fetchRecommandations = async () => {
    try {
      const id = typeof patientId === 'string' ? parseInt(patientId) : patientId;
      const data = await ChatbotService.getRecommendations(id);
      setRecommandations(data);
    } catch (error) {
      console.error('❌ Erreur:', error);
      setRecommandations(null);
    } finally {
      setLoading(false);
    }
  };

  const getUrgenceColor = (urgence?: string) => {
    if (urgence?.includes('Immédiate')) return '#ef4444';
    if (urgence?.includes('Court terme')) return '#f59e0b';
    return '#3b82f6';
  };

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <div style={{ display: 'inline-block', width: '40px', height: '40px', border: '4px solid #334155', borderTopColor: '#3b82f6', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        <p style={{ color: '#94a3b8', marginTop: '15px' }}>Analyse du dossier en cours...</p>
      </div>
    );
  }

  if (!recommandations) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <span style={{ fontSize: '48px' }}>⚠️</span>
        <p style={{ color: '#ef4444', marginTop: '15px' }}>Impossible de générer les recommandations</p>
        <button onClick={fetchRecommandations} style={{
          background: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px',
          padding: '10px 20px', cursor: 'pointer', marginTop: '15px'
        }}>
          🔄 Réessayer
        </button>
      </div>
    );
  }

  const hasAlertes = recommandations.alertes_critiques?.length > 0 || recommandations.alertes_surveillance?.length > 0;
  const hasRecommandations = recommandations.recommandations_traitements?.length > 0 ||
                             recommandations.recommandations_examens?.length > 0 ||
                             recommandations.recommandations_consultations?.length > 0;

  return (
    <div style={{ padding: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h3 style={{ color: '#f1f5f9', margin: 0 }}>🤖 Recommandations Médicales Personnalisées</h3>
          <p style={{ color: '#94a3b8', fontSize: '14px', margin: '5px 0 0 0' }}>Analyse basée sur les recommandations HAS/ANSM</p>
        </div>
        <div style={{
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: recommandations.score_risque > 5 ? '#ef4444' :
                     recommandations.score_risque > 2 ? '#f59e0b' : '#22c55e',
          fontSize: '24px',
          fontWeight: '700',
          color: 'white'
        }}>
          {recommandations.score_risque || 0}
        </div>
      </div>

      {/* Actions Prioritaires */}
      {recommandations.actions_prioritaires?.length > 0 && (
        <div style={{ background: '#1e293b', borderRadius: '12px', padding: '20px', marginBottom: '20px', border: '1px solid #334155' }}>
          <h4 style={{ color: '#f1f5f9', marginBottom: '15px' }}>
            🎯 Actions Prioritaires
            <span style={{ marginLeft: '10px', background: '#3b82f6', color: 'white', padding: '4px 10px', borderRadius: '20px', fontSize: '14px' }}>
              {recommandations.actions_prioritaires.length}
            </span>
          </h4>
          
          <div style={{ display: 'grid', gap: '15px' }}>
            {recommandations.actions_prioritaires.map((action: any, idx: number) => (
              <div key={idx} style={{
                background: '#0f172a',
                borderRadius: '8px',
                padding: '15px',
                borderLeft: `4px solid ${getUrgenceColor(action.urgence)}`
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <span style={{
                      background: getUrgenceColor(action.urgence),
                      color: 'white',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}>
                      Priorité {action.priorite}
                    </span>
                    <span style={{ color: '#94a3b8', fontSize: '13px' }}>{action.urgence}</span>
                  </div>
                  <span style={{ background: '#334155', color: '#cbd5e1', padding: '4px 10px', borderRadius: '6px', fontSize: '12px' }}>
                    {action.type}
                  </span>
                </div>
                
                <h5 style={{ color: '#f1f5f9', margin: '0 0 8px 0', fontSize: '15px' }}>{action.titre}</h5>
                <p style={{ color: '#cbd5e1', margin: 0, fontSize: '14px', lineHeight: '1.6' }}>{action.action}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Alertes Critiques */}
      {recommandations.alertes_critiques?.length > 0 && (
        <div style={{ background: 'rgba(239, 68, 68, 0.1)', borderRadius: '12px', padding: '20px', marginBottom: '20px', border: '1px solid #ef4444' }}>
          <h4 style={{ color: '#ef4444', marginBottom: '15px' }}>
            🔴 Alertes Critiques - Action Immédiate Requise
            <span style={{ marginLeft: '10px', background: '#ef4444', color: 'white', padding: '4px 10px', borderRadius: '20px', fontSize: '14px' }}>
              {recommandations.alertes_critiques.length}
            </span>
          </h4>
          
          <div style={{ display: 'grid', gap: '15px' }}>
            {recommandations.alertes_critiques.map((alerte: any, idx: number) => (
              <div key={idx} style={{ background: '#1e293b', borderRadius: '8px', padding: '15px', border: '1px solid #334155' }}>
                <h5 style={{ color: '#f1f5f9', margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>🔴</span>
                  {alerte.titre}
                </h5>
                <p style={{ color: '#cbd5e1', margin: '0 0 10px 0', fontSize: '14px' }}>{alerte.description}</p>
                <div style={{ background: '#0f172a', borderRadius: '6px', padding: '12px' }}>
                  <strong style={{ color: '#94a3b8', fontSize: '13px' }}>📋 Recommandation:</strong>
                  <p style={{ color: '#cbd5e1', margin: '5px 0 0 0', fontSize: '14px' }}>{alerte.recommandation}</p>
                </div>
                {alerte.source && (
                  <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '16px' }}>📚</span>
                    <span style={{ color: '#64748b', fontSize: '13px' }}>{alerte.source}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Alertes Surveillance */}
      {recommandations.alertes_surveillance?.length > 0 && (
        <div style={{ background: 'rgba(251, 191, 36, 0.1)', borderRadius: '12px', padding: '20px', marginBottom: '20px', border: '1px solid #fbbf24' }}>
          <h4 style={{ color: '#fbbf24', marginBottom: '15px' }}>
            🟡 Alertes de Surveillance
            <span style={{ marginLeft: '10px', background: '#fbbf24', color: 'black', padding: '4px 10px', borderRadius: '20px', fontSize: '14px' }}>
              {recommandations.alertes_surveillance.length}
            </span>
          </h4>
          
          <div style={{ display: 'grid', gap: '12px' }}>
            {recommandations.alertes_surveillance.map((alerte: any, idx: number) => (
              <div key={idx} style={{ background: '#1e293b', borderRadius: '8px', padding: '12px', border: '1px solid #334155' }}>
                <p style={{ color: '#cbd5e1', margin: 0, fontSize: '14px' }}>
                  <span style={{ color: '#fbbf24', fontWeight: '600' }}>⚠️ {alerte.titre}:</span> {alerte.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Message si pas d'alertes */}
      {!hasAlertes && !hasRecommandations && (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <span style={{ fontSize: '48px' }}>✅</span>
          <p style={{ color: '#22c55e', marginTop: '15px', fontSize: '16px' }}>Aucune alerte ou recommandation spécifique</p>
        </div>
      )}
    </div>
  );
};

export default PatientRecommandations;
