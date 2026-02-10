/**
 * Patient Detail Page
 * Comprehensive patient dossier with tabbed navigation
 * Tabs: Synthèse, Consultations, Traitements, Analyses, Imagerie, Recommandations, Chat
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PatientService } from '../../services/patient.service';
import type { Patient } from '../../services/patient.service';

// Import patient components (will be created next)
import PatientSynthese from '../../components/medical/PatientSynthese';
import PatientAnalyses from '../../components/medical/PatientAnalyses';
import PatientTreatments from '../../components/medical/PatientTreatments';
import PatientConsultations from '../../components/medical/PatientConsultations';
import PatientImagerie from '../../components/medical/PatientImagerie';
import PatientChat from '../../components/medical/PatientChat';
import PatientRecommandations from '../../components/medical/PatientRecommandations';

import './PatientDetail.css';

interface Tab {
  id: string;
  icon: string;
  label: string;
  component: React.ComponentType<TabComponentProps>;
}

interface TabComponentProps {
  patient: Patient;
  patientId: string;
  onUpdate: () => void;
}

const PatientDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('synthese');

  useEffect(() => {
    if (id) {
      fetchPatient();
    }
  }, [id]);

  const fetchPatient = async () => {
    if (!id) return;
    
    try {
      const data = await PatientService.getById(Number(id));
      setPatient(data);
    } catch (error) {
      console.error('Erreur chargement patient:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateAge = (dateOfBirth?: string): number | string => {
    if (!dateOfBirth) return '?';
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const tabs: Tab[] = [
    { id: 'synthese', icon: '📋', label: 'Synthèse', component: PatientSynthese },
    { id: 'consultations', icon: '🩺', label: 'Consultations', component: PatientConsultations },
    { id: 'treatments', icon: '💊', label: 'Traitements', component: PatientTreatments },
    { id: 'analyses', icon: '🔬', label: 'Analyses', component: PatientAnalyses },
    { id: 'imaging', icon: '📸', label: 'Imagerie', component: PatientImagerie },
    { id: 'recommandations', icon: '🤖', label: 'Recommandations', component: PatientRecommandations },
    { id: 'chat', icon: '💬', label: 'Chat Patient', component: PatientChat }
  ];

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Chargement du dossier patient...</p>
      </div>
    );
  }

  if (!patient || !id) {
    return (
      <div className="error-container">
        <span className="error-icon">❌</span>
        <h2>Patient non trouvé</h2>
        <button onClick={() => navigate('/patients')}>
          ← Retour à la liste
        </button>
      </div>
    );
  }

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component;

  return (
    <div className="patient-detail-page">
      {/* Header */}
      <div className="patient-header">
        <button className="btn-back" onClick={() => navigate('/patients')}>
          ← Retour aux patients
        </button>

        <div className="patient-info-header">
          <div className="patient-avatar-large">
            {patient.gender === 'M' ? '👨' : patient.gender === 'F' ? '👩' : '👤'}
          </div>
          
          <div className="patient-main-details">
            <h1>
              {patient.lastName} {patient.firstName}
              <span className="patient-id-badge">#{id.padStart(3, '0')}</span>
            </h1>
            
            <div className="patient-meta">
              <span className="meta-item">
                <strong>{calculateAge(patient.dateOfBirth)} ans</strong>
                {patient.dateOfBirth && ` • Né(e) le ${new Date(patient.dateOfBirth).toLocaleDateString('fr-FR')}`}
              </span>
              {patient.gender && (
                <span className="meta-item">
                  • {patient.gender === 'M' ? 'Masculin' : 'Féminin'}
                </span>
              )}
            </div>

            {patient.chronicDiseases && patient.chronicDiseases.length > 0 && (
              <div className="quick-pathologies">
                🏥 {patient.chronicDiseases.join(', ')}
              </div>
            )}
          </div>

          <div className="patient-quick-actions">
            <button className="quick-action-btn">📞 Appeler</button>
            <button className="quick-action-btn">✉️ Email</button>
            <button className="quick-action-btn">🖨️ Imprimer</button>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="tabs-container">
        <div className="tabs-nav">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-label">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {ActiveComponent && (
          <ActiveComponent 
            patient={patient} 
            patientId={id} 
            onUpdate={fetchPatient} 
          />
        )}
      </div>
    </div>
  );
};

export default PatientDetail;
