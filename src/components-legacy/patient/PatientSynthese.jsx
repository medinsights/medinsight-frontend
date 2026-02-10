// frontend/src/components/patient/PatientSynthese.jsx
import React, { useState, useEffect } from 'react';
import './PatientSynthese.css';
import ModalConstantes from './ModalConstantes';
import ModalPathologies from './ModalPathologies';
import ModalCoordonnees from './ModalCoordonnees';

const PatientSynthese = ({ patient, onUpdate }) => {
  const [traitements, setTraitements] = useState([]);
  const [loadingTraitements, setLoadingTraitements] = useState(true);
  const [constantes, setConstantes] = useState(null);
  const [loadingConstantes, setLoadingConstantes] = useState(true);
  const [analyses, setAnalyses] = useState([]);
  const [loadingAnalyses, setLoadingAnalyses] = useState(true);
  
  // États des modals
  const [showModalConstantes, setShowModalConstantes] = useState(false);
  const [showPathologiesModal, setShowPathologiesModal] = useState(false);
  const [showCoordonneesModal, setShowCoordonneesModal] = useState(false);

  // Charger toutes les données au montage
  useEffect(() => {
    if (patient?.id || patient?.ID) {
      const patientId = patient?.id || patient?.ID;
      fetchTraitements(patientId);
      fetchConstantes(patientId);
      fetchAnalyses(patientId);
    }
  }, [patient?.id, patient?.ID]);

  const fetchConstantes = async (patientId) => {
    try {
      const response = await fetch(`http://localhost:8000/api/patients/${patientId}/constantes`);
      const data = await response.json();
      setConstantes(data);
      console.log(`✅ Constantes chargées:`, data);
    } catch (error) {
      console.error('Erreur chargement constantes:', error);
      setConstantes(null);
    } finally {
      setLoadingConstantes(false);
    }
  };

  const fetchTraitements = async (patientId) => {
    try {
      const response = await fetch(`http://localhost:8000/api/patients/${patientId}/traitements`);
      const data = await response.json();
      
      // Filtrer uniquement les traitements actifs
      const traitementsActifs = data.filter(t => t.statut === 'Actif');
      setTraitements(traitementsActifs);
      
      console.log(`✅ ${traitementsActifs.length} traitement(s) actif(s) chargé(s)`);
    } catch (error) {
      console.error('Erreur chargement traitements:', error);
      setTraitements([]);
    } finally {
      setLoadingTraitements(false);
    }
  };

  const fetchAnalyses = async (patientId) => {
    try {
      const response = await fetch(`http://localhost:8000/api/patients/${patientId}/analyses`);
      const data = await response.json();
      setAnalyses(data || []);
      console.log(`✅ ${data.length} analyse(s) chargée(s)`);
    } catch (error) {
      console.error('Erreur chargement analyses:', error);
      setAnalyses([]);
    } finally {
      setLoadingAnalyses(false);
    }
  };

  // Recharger toutes les données
  const reloadAllData = () => {
    const patientId = patient?.id || patient?.ID;
    fetchConstantes(patientId);
    fetchTraitements(patientId);
    fetchAnalyses(patientId);
    
    // Callback pour rafraîchir patient dans le composant parent
    if (onUpdate) {
      onUpdate();
    }
  };

  // Fonction de calcul IMC
  const calculateIMC = (poids, taille) => {
    if (!poids || !taille) return 0;
    const tailleM = taille / 100;
    return (poids / (tailleM * tailleM)).toFixed(1);
  };

  const getIMCCategory = (imc) => {
    if (!imc || imc === 0) return '';
    if (imc < 18.5) return 'Insuffisance pondérale';
    if (imc < 25) return 'Poids normal';
    if (imc < 30) return 'Surpoids';
    return 'Obésité';
  };

  // Extraire alertes depuis la dernière analyse
  const extractAlertes = () => {
    if (!analyses || analyses.length === 0) return [];
    
    const derniereAnalyse = analyses[0]; // La plus récente
    const alertes = [];

    try {
      // Parser les alertes JSON
      let alertesData = derniereAnalyse.alertes;
      
      if (typeof alertesData === 'string') {
        alertesData = JSON.parse(alertesData);
      }

      if (Array.isArray(alertesData) && alertesData.length > 0) {
        alertesData.forEach(alerte => {
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

  // Constantes vitales dynamiques
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

  // Alertes dynamiques depuis analyses
  const alerts = extractAlertes();

  // Extraire pathologies, allergies, antécédents (gérer majuscules/minuscules)
  const pathologies = patient?.PATHOLOGIES_PRINCIPALES || patient?.pathologies_principales || '';
  const allergies = patient?.ALLERGIES || patient?.allergies || '';
  const antecedents = patient?.ANTECEDENTS_FAMILIAUX || patient?.antecedents_familiaux || '';
  const telephone = patient?.TELEPHONE || patient?.telephone || '';
  const email = patient?.EMAIL || patient?.email || '';
  const adresse = patient?.ADRESSE || patient?.adresse || '';
  const medecinTraitant = patient?.MEDECIN_TRAITANT || patient?.medecin_traitant || '';

  return (
    <div className="patient-synthese">
      <div className="synthese-grid">
        {/* Colonne gauche */}
        <div className="synthese-column">
          {/* Constantes Vitales */}
          <div className="synthese-card">
            <div className="card-header-with-action">
              <h2 className="card-title">📊 Constantes Vitales</h2>
              <button 
                className="btn-edit-constantes"
                onClick={() => setShowModalConstantes(true)}
              >
                ✏️ Modifier
              </button>
            </div>
            
            {loadingConstantes ? (
              <p style={{ color: '#94a3b8', fontStyle: 'italic', textAlign: 'center', padding: '20px' }}>
                Chargement des constantes...
              </p>
            ) : (
              <div className="vitals-grid">
                <div className="vital-item">
                  <span className="vital-icon">⚖️</span>
                  <div className="vital-info">
                    <span className="vital-label">Poids</span>
                    <span className="vital-value">
                      {vitals.poids > 0 ? `${vitals.poids} kg` : 'N/A'}
                    </span>
                  </div>
                </div>

                <div className="vital-item">
                  <span className="vital-icon">📏</span>
                  <div className="vital-info">
                    <span className="vital-label">Taille</span>
                    <span className="vital-value">
                      {vitals.taille > 0 ? `${vitals.taille} cm` : 'N/A'}
                    </span>
                  </div>
                </div>

                <div className="vital-item">
                  <span className="vital-icon">📈</span>
                  <div className="vital-info">
                    <span className="vital-label">IMC</span>
                    <span className="vital-value">
                      {vitals.imc > 0 ? vitals.imc : 'N/A'}
                      {vitals.imc > 0 && (
                        <span className="imc-category">{getIMCCategory(vitals.imc)}</span>
                      )}
                    </span>
                  </div>
                </div>

                <div className="vital-item">
                  <span className="vital-icon">💓</span>
                  <div className="vital-info">
                    <span className="vital-label">Tension</span>
                    <span className="vital-value">{vitals.tension} mmHg</span>
                  </div>
                </div>

                <div className="vital-item">
                  <span className="vital-icon">❤️</span>
                  <div className="vital-info">
                    <span className="vital-label">Fréquence Cardiaque</span>
                    <span className="vital-value">
                      {vitals.fc > 0 ? `${vitals.fc} bpm` : 'N/A'}
                    </span>
                  </div>
                </div>

                <div className="vital-item">
                  <span className="vital-icon">🌡️</span>
                  <div className="vital-info">
                    <span className="vital-label">Température</span>
                    <span className="vital-value">
                      {vitals.temperature > 0 ? `${vitals.temperature}°C` : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Pathologies */}
          <div className="synthese-card">
            <div className="card-header-with-action">
              <h2 className="card-title">🏥 Pathologies</h2>
              <button 
                className="btn-edit-constantes"
                onClick={() => setShowPathologiesModal(true)}
              >
                ✏️ Modifier
              </button>
            </div>
            {pathologies ? (
              <div className="pathologies-list">
                {pathologies.split(',').map((path, idx) => (
                  <div key={idx} className="pathology-item">
                    <span className="pathology-bullet">•</span>
                    <div>
                      <strong>{path.trim()}</strong>
                      <span className="pathology-date">Suivi en cours</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="empty-text">Aucune pathologie renseignée</p>
            )}
          </div>

          {/* Traitements en cours */}
          <div className="synthese-card">
            <div className="section-header">
              <h2 className="card-title">💊 Traitements en cours</h2>
              <span className="badge">
                {loadingTraitements ? '...' : traitements.length}
              </span>
            </div>
  
            <div className="info-content">
              {loadingTraitements ? (
                <p style={{ color: '#94a3b8', fontStyle: 'italic' }}>
                  Chargement...
                </p>
              ) : traitements.length === 0 ? (
                <p style={{ color: '#94a3b8', fontStyle: 'italic' }}>
                  Aucun traitement actif
                </p>
              ) : (
                <div className="traitements-list">
                  {traitements.map((traitement) => (
                    <div key={traitement.id} className="traitement-item">
                      <div className="traitement-header">
                        <span className="traitement-nom">
                          💊 {traitement.medicament}
                        </span>
                        <span className="traitement-dosage">
                          {traitement.dosage}
                        </span>
                      </div>
            
                      {traitement.frequence && (
                        <div className="traitement-details">
                          <span className="detail-label">Fréquence:</span>
                          <span className="detail-value">{traitement.frequence}</span>
                        </div>
                      )}
            
                      {traitement.voie_administration && (
                        <div className="traitement-details">
                          <span className="detail-label">Voie:</span>
                          <span className="detail-value">{traitement.voie_administration}</span>
                        </div>
                      )}
            
                      {traitement.indication && (
                        <div className="traitement-details">
                          <span className="detail-label">Indication:</span>
                          <span className="detail-value">{traitement.indication}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Colonne droite */}
        <div className="synthese-column">
          {/* Alertes */}
          <div className="synthese-card">
            <h2 className="card-title">⚠️ Alertes Médicales</h2>
            {loadingAnalyses ? (
              <p style={{ color: '#94a3b8', fontStyle: 'italic', textAlign: 'center', padding: '20px' }}>
                Chargement des alertes...
              </p>
            ) : alerts.length > 0 ? (
              <div className="alerts-list">
                {alerts.map((alert, idx) => (
                  <div key={idx} className={`alert-item alert-${alert.type}`}>
                    <span className="alert-icon-large">{alert.icon}</span>
                    <div className="alert-content">
                      <h3>{alert.title}</h3>
                      <p>{alert.description}</p>
                      <div className="alert-action">
                        <span>👉</span>
                        <span>{alert.action}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-alerts">
                <span className="success-icon">✅</span>
                <p>Aucune alerte active</p>
              </div>
            )}
          </div>

          {/* Allergies */}
          <div className="synthese-card">
            <h2 className="card-title">⚠️ Allergies</h2>
            {allergies && allergies !== 'Aucune allergie connue' ? (
              <div className="allergy-warning">
                <span className="allergy-icon">⚠️</span>
                <strong>{allergies}</strong>
              </div>
            ) : (
              <p className="empty-text success">✅ Aucune allergie connue</p>
            )}
          </div>

          {/* Antécédents */}
          {antecedents && (
            <div className="synthese-card">
              <h2 className="card-title">👨‍👩‍👧‍👦 Antécédents Familiaux</h2>
              <p>{antecedents}</p>
            </div>
          )}

          {/* Coordonnées */}
          <div className="synthese-card">
            <div className="card-header-with-action">
              <h2 className="card-title">📞 Coordonnées</h2>
              <button 
                className="btn-edit-constantes"
                onClick={() => setShowCoordonneesModal(true)}
              >
                ✏️ Modifier
              </button>
            </div>
            <div className="contact-info">
              {telephone && (
                <div className="contact-item">
                  <span className="contact-icon">📱</span>
                  <span>{telephone}</span>
                </div>
              )}
              {email && (
                <div className="contact-item">
                  <span className="contact-icon">✉️</span>
                  <span>{email}</span>
                </div>
              )}
              {adresse && (
                <div className="contact-item">
                  <span className="contact-icon">📍</span>
                  <span>{adresse}</span>
                </div>
              )}
              {!telephone && !email && !adresse && (
                <p className="empty-text">Aucune coordonnée renseignée</p>
              )}
            </div>
          </div>

          {/* Médecin traitant */}
          {medecinTraitant && (
            <div className="synthese-card">
              <h2 className="card-title">👨‍⚕️ Médecin Traitant</h2>
              <p><strong>{medecinTraitant}</strong></p>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <ModalConstantes
        isOpen={showModalConstantes}
        onClose={() => setShowModalConstantes(false)}
        patient={patient}
        constantes={constantes}
        onSave={reloadAllData}
      />

      <ModalPathologies
        isOpen={showPathologiesModal}
        onClose={() => setShowPathologiesModal(false)}
        patient={patient}
        onSave={reloadAllData}
      />

      <ModalCoordonnees
        isOpen={showCoordonneesModal}
        onClose={() => setShowCoordonneesModal(false)}
        patient={patient}
        onSave={reloadAllData}
      />
    </div>
  );
};

export default PatientSynthese;