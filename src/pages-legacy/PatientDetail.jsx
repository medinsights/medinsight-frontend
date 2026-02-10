// frontend/src/pages/PatientDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PatientSynthese from '../components/patient/PatientSynthese';
import PatientAnalyses from '../components/patient/PatientAnalyses';
import PatientTreatments from '../components/patient/PatientTreatments';
import PatientConsultations from '../components/patient/PatientConsultations';
import PatientImagerie from '../components/patient/PatientImagerie';
import PatientChat from '../components/patient/PatientChat';
import PatientRecommandations from '../components/patient/PatientRecommandations';
import './PatientDetail.css';

const PatientDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('synthese');

  useEffect(() => {
    fetchPatient();
  }, [id]);

  const fetchPatient = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/patients/${id}`);
      const data = await response.json();
      setPatient(data);
    } catch (error) {
      console.error('Erreur chargement patient:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateAge = (dateNaissance) => {
    if (!dateNaissance) return '?';
    const today = new Date();
    const birthDate = new Date(dateNaissance);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const tabs = [
    { id: 'synthese', icon: '📋', label: 'Synthèse', component: PatientSynthese },
    { id: 'consultations', icon: '🩺', label: 'Consultations', component: PatientConsultations },
    { id: 'treatments', icon: '💊', label: 'Traitements', component: PatientTreatments },
    { id: 'analyses', icon: '🔬', label: 'Analyses', component: PatientAnalyses },
    { id: 'imaging', icon: '📸', label: 'Imagerie', component: PatientImagerie },
    { id: 'recommandations', label: '🤖 Recommandations', component: PatientRecommandations },
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

  if (!patient) {
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
            {patient.sexe === 'M' ? '👨' : patient.sexe === 'F' ? '👩' : '👤'}
          </div>
          
          <div className="patient-main-details">
            <h1>
              {patient.nom} {patient.prenom}
              <span className="patient-id-badge">#{id.toString().padStart(3, '0')}</span>
            </h1>
            
            <div className="patient-meta">
              <span className="meta-item">
                <strong>{calculateAge(patient.date_naissance)} ans</strong>
                {patient.date_naissance && ` • Né(e) le ${new Date(patient.date_naissance).toLocaleDateString('fr-FR')}`}
              </span>
              {patient.sexe && (
                <span className="meta-item">
                  • {patient.sexe === 'M' ? 'Masculin' : 'Féminin'}
                </span>
              )}
            </div>

            {patient.pathologies_principales && (
              <div className="quick-pathologies">
                🏥 {patient.pathologies_principales}
              </div>
            )}
          </div>

          <div className="patient-quick-actions">
            <button className="quick-action-btn">📞 Appeler </button>
            <button className="quick-action-btn"> ✉️ Email </button>
            <button className="quick-action-btn"> 🖨️ Imprimer </button>
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
        {ActiveComponent && <ActiveComponent patient={patient} patientId={id} onUpdate={fetchPatient} />}
      </div>
    </div>
  );
};

export default PatientDetail;