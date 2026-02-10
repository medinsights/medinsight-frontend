import React, { useState, useEffect } from 'react';
import { PatientService } from '../../services/patient.service';
import type { Patient, VitalSigns, Treatment, MedicalAnalysis } from '../../services/patient.service';

interface PatientSyntheseProps {
  patient: Patient;
  patientId: string;
  onUpdate: () => void;
}

interface Alert {
  type: 'error' | 'warning';
  icon: string;
  title: string;
  description: string;
  action: string;
}

const PatientSynthese: React.FC<PatientSyntheseProps> = ({ patient }) => {
  const [traitements, setTraitements] = useState<Treatment[]>([]);
  const [loadingTraitements, setLoadingTraitements] = useState(true);
  const [constantes, setConstantes] = useState<VitalSigns | null>(null);
  const [loadingConstantes, setLoadingConstantes] = useState(true);
  const [analyses, setAnalyses] = useState<MedicalAnalysis[]>([]);
  const [loadingAnalyses, setLoadingAnalyses] = useState(true);

  useEffect(() => {
    if (patient?.id) {
      const id = typeof patient.id === 'string' ? parseInt(patient.id) : patient.id;
      fetchConstantes(id);
      fetchTraitements(id);
      fetchAnalyses(id);
    }
  }, [patient?.id]);

  const fetchConstantes = async (id: number) => {
    try {
      const data = await PatientService.getLatestVitalSigns(id);
      setConstantes(data);
      console.log(`✅ Constantes chargées:`, data);
    } catch (error) {
      console.error('Erreur chargement constantes:', error);
      setConstantes(null);
    } finally {
      setLoadingConstantes(false);
    }
  };

  const fetchTraitements = async (id: number) => {
    try {
      const data = await PatientService.getActiveTreatments(id);
      setTraitements(data);
      console.log(`✅ ${data.length} traitement(s) actif(s) chargé(s)`);
    } catch (error) {
      console.error('Erreur chargement traitements:', error);
      setTraitements([]);
    } finally {
      setLoadingTraitements(false);
    }
  };

  const fetchAnalyses = async (id: number) => {
    try {
      const data = await PatientService.getMedicalAnalyses(id);
      setAnalyses(data || []);
      console.log(`✅ ${data.length} analyse(s) chargée(s)`);
    } catch (error) {
      console.error('Erreur chargement analyses:', error);
      setAnalyses([]);
    } finally {
      setLoadingAnalyses(false);
    }
  };

  const calculateIMC = (poids?: number, taille?: number): number => {
    if (!poids || !taille) return 0;
    const tailleM = taille / 100;
    return parseFloat((poids / (tailleM * tailleM)).toFixed(1));
  };

  const getIMCCategory = (imc: number): string => {
    if (!imc || imc === 0) return '';
    if (imc < 18.5) return 'Insuffisance pondérale';
    if (imc < 25) return 'Poids normal';
    if (imc < 30) return 'Surpoids';
    return 'Obésité';
  };

  const extractAlertes = (): Alert[] => {
    if (!analyses || analyses.length === 0) return [];
    
    const derniereAnalyse = analyses[0];
    const alertes: Alert[] = [];

    try {
      let alertesData = derniereAnalyse.alertes;
      
      if (typeof alertesData === 'string') {
        alertesData = JSON.parse(alertesData);
      }

      if (Array.isArray(alertesData) && alertesData.length > 0) {
        alertesData.forEach((alerte: any) => {
          alertes.push({
            type: alerte.gravite === 'rouge' ? 'error' : 'warning',
            icon: alerte.gravite === 'rouge' ? '🔴' : '🟡',
            title: alerte.parametre,
            description: `${alerte.valeur} (Norme: ${alerte.norme})`,
            action: alerte.explication || 'Surveillance recommandée'
          });
        });
      }
    } catch (e) {
      console.log('Pas d\'alertes structurées dans les analyses');
    }

    return alertes;
  };

  const vitals = constantes ? {
    poids: constantes.poids || 0,
    taille: constantes.taille || 0,
    imc: calculateIMC(constantes.poids, constantes.taille),
    tension: constantes.tension_systolique && constantes.tension_diastolique 
      ? `${constantes.tension_systolique}/${constantes.tension_diastolique}`
      : 'N/A',
    fc: constantes.frequence_cardiaque || 0,
    temperature: constantes.temperature || 0,
    saturation: constantes.saturation_oxygene || 0
  } : {
    poids: 0,
    taille: 0,
    imc: 0,
    tension: 'N/A',
    fc: 0,
    temperature: 0,
    saturation: 0
  };

  const alerts = extractAlertes();

  const pathologies = patient?.pathologies_principales || '';
  const allergies = patient?.allergies || '';
  const telephone = patient?.telephone || '';
  const email = patient?.email || '';
  const adresse = patient?.adresse || '';
  const medecinTraitant = patient?.medecin_traitant || '';

  return (
    <div className="patient-synthese" style={{ padding: '20px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Colonne gauche */}
        <div>
          {/* Constantes Vitales */}
          <div style={{ 
            background: '#1e293b', 
            borderRadius: '12px', 
            padding: '20px', 
            marginBottom: '20px',
            border: '1px solid #334155'
          }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#f1f5f9', marginBottom: '20px' }}>
              📊 Constantes Vitales
            </h2>
            
            {loadingConstantes ? (
              <p style={{ color: '#94a3b8', fontStyle: 'italic', textAlign: 'center', padding: '20px' }}>
                Chargement des constantes...
              </p>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                {[
                  { icon: '⚖️', label: 'Poids', value: vitals.poids > 0 ? `${vitals.poids} kg` : 'N/A' },
                  { icon: '📏', label: 'Taille', value: vitals.taille > 0 ? `${vitals.taille} cm` : 'N/A' },
                  { icon: '📈', label: 'IMC', value: vitals.imc > 0 ? vitals.imc : 'N/A', extra: vitals.imc > 0 ? getIMCCategory(vitals.imc) : '' },
                  { icon: '💓', label: 'Tension', value: `${vitals.tension} mmHg` },
                  { icon: '❤️', label: 'Fréquence Cardiaque', value: vitals.fc > 0 ? `${vitals.fc} bpm` : 'N/A' },
                  { icon: '🌡️', label: 'Température', value: vitals.temperature > 0 ? `${vitals.temperature}°C` : 'N/A' }
                ].map((vital, idx) => (
                  <div key={idx} style={{ background: '#0f172a', padding: '15px', borderRadius: '8px' }}>
                    <span style={{ fontSize: '24px' }}>{vital.icon}</span>
                    <div style={{ marginTop: '8px' }}>
                      <span style={{ color: '#94a3b8', fontSize: '14px', display: 'block' }}>{vital.label}</span>
                      <span style={{ color: '#f1f5f9', fontSize: '18px', fontWeight: '600' }}>{vital.value}</span>
                      {vital.extra && (
                        <span style={{ color: '#64748b', fontSize: '12px', display: 'block', marginTop: '4px' }}>
                          {vital.extra}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pathologies */}
          <div style={{ 
            background: '#1e293b', 
            borderRadius: '12px', 
            padding: '20px', 
            marginBottom: '20px',
            border: '1px solid #334155'
          }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#f1f5f9', marginBottom: '15px' }}>
              🏥 Pathologies
            </h2>
            {pathologies ? (
              <div>
                {pathologies.split(',').map((path, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'start', marginBottom: '10px' }}>
                    <span style={{ color: '#3b82f6', marginRight: '10px' }}>•</span>
                    <div>
                      <strong style={{ color: '#f1f5f9' }}>{path.trim()}</strong>
                      <span style={{ color: '#64748b', fontSize: '14px', display: 'block' }}>Suivi en cours</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: '#94a3b8', fontStyle: 'italic' }}>Aucune pathologie renseignée</p>
            )}
          </div>

          {/* Traitements en cours */}
          <div style={{ 
            background: '#1e293b', 
            borderRadius: '12px', 
            padding: '20px', 
            border: '1px solid #334155'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#f1f5f9' }}>💊 Traitements en cours</h2>
              <span style={{ background: '#3b82f6', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '14px' }}>
                {loadingTraitements ? '...' : traitements.length}
              </span>
            </div>
  
            {loadingTraitements ? (
              <p style={{ color: '#94a3b8', fontStyle: 'italic' }}>Chargement...</p>
            ) : traitements.length === 0 ? (
              <p style={{ color: '#94a3b8', fontStyle: 'italic' }}>Aucun traitement actif</p>
            ) : (
              <div>
                {traitements.map((traitement) => (
                  <div key={traitement.id} style={{ 
                    background: '#0f172a', 
                    padding: '15px', 
                    borderRadius: '8px', 
                    marginBottom: '10px',
                    border: '1px solid #1e293b'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ color: '#f1f5f9', fontWeight: '600' }}>💊 {traitement.medicament}</span>
                      <span style={{ color: '#3b82f6', fontSize: '14px' }}>{traitement.dosage}</span>
                    </div>
                    
                    {traitement.frequence && (
                      <div style={{ marginBottom: '4px', fontSize: '14px' }}>
                        <span style={{ color: '#94a3b8' }}>Fréquence: </span>
                        <span style={{ color: '#cbd5e1' }}>{traitement.frequence}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Colonne droite */}
        <div>
          {/* Alertes */}
          <div style={{ 
            background: '#1e293b', 
            borderRadius: '12px', 
            padding: '20px', 
            marginBottom: '20px',
            border: '1px solid #334155'
          }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#f1f5f9', marginBottom: '15px' }}>⚠️ Alertes Médicales</h2>
            {loadingAnalyses ? (
              <p style={{ color: '#94a3b8', fontStyle: 'italic', textAlign: 'center', padding: '20px' }}>Chargement des alertes...</p>
            ) : alerts.length > 0 ? (
              <div>
                {alerts.map((alert, idx) => (
                  <div key={idx} style={{ 
                    background: alert.type === 'error' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(251, 191, 36, 0.1)',
                    border: `1px solid ${alert.type === 'error' ? '#ef4444' : '#fbbf24'}`,
                    borderRadius: '8px',
                    padding: '15px',
                    marginBottom: '10px'
                  }}>
                    <span style={{ fontSize: '24px' }}>{alert.icon}</span>
                    <h3 style={{ color: '#f1f5f9', fontSize: '16px', fontWeight: '600', margin: '8px 0' }}>{alert.title}</h3>
                    <p style={{ color: '#cbd5e1', fontSize: '14px', marginBottom: '8px' }}>{alert.description}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                      <span>👉</span>
                      <span style={{ color: '#94a3b8' }}>{alert.action}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <span style={{ fontSize: '48px' }}>✅</span>
                <p style={{ color: '#22c55e', marginTop: '10px' }}>Aucune alerte active</p>
              </div>
            )}
          </div>

          {/* Allergies */}
          <div style={{ 
            background: '#1e293b', 
            borderRadius: '12px', 
            padding: '20px', 
            marginBottom: '20px',
            border: '1px solid #334155'
          }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#f1f5f9', marginBottom: '15px' }}>⚠️ Allergies</h2>
            {allergies && (typeof allergies === 'string' ? allergies !== 'Aucune allergie connue' : allergies.length > 0) ? (
              <div style={{ 
                background: 'rgba(251, 191, 36, 0.1)', 
                border: '1px solid #fbbf24', 
                borderRadius: '8px', 
                padding: '15px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <span style={{ fontSize: '24px' }}>⚠️</span>
                <strong style={{ color: '#fbbf24' }}>{allergies}</strong>
              </div>
            ) : (
              <p style={{ color: '#22c55e' }}>✅ Aucune allergie connue</p>
            )}
          </div>

          {/* Coordonnées */}
          <div style={{ 
            background: '#1e293b', 
            borderRadius: '12px', 
            padding: '20px', 
            marginBottom: '20px',
            border: '1px solid #334155'
          }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#f1f5f9', marginBottom: '15px' }}>📞 Coordonnées</h2>
            <div>
              {telephone && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                  <span style={{ fontSize: '20px' }}>📱</span>
                  <span style={{ color: '#cbd5e1' }}>{telephone}</span>
                </div>
              )}
              {email && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                  <span style={{ fontSize: '20px' }}>✉️</span>
                  <span style={{ color: '#cbd5e1' }}>{email}</span>
                </div>
              )}
              {adresse && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '20px' }}>📍</span>
                  <span style={{ color: '#cbd5e1' }}>{adresse}</span>
                </div>
              )}
              {!telephone && !email && !adresse && (
                <p style={{ color: '#94a3b8', fontStyle: 'italic' }}>Aucune coordonnée renseignée</p>
              )}
            </div>
          </div>

          {/* Médecin traitant */}
          {medecinTraitant && (
            <div style={{ 
              background: '#1e293b', 
              borderRadius: '12px', 
              padding: '20px',
              border: '1px solid #334155'
            }}>
              <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#f1f5f9', marginBottom: '15px' }}>👨‍⚕️ Médecin Traitant</h2>
              <p style={{ color: '#f1f5f9' }}><strong>{medecinTraitant}</strong></p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientSynthese;
