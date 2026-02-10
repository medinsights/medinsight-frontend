// frontend/src/components/patient/PatientInfo.jsx
import React, { useState } from 'react';
import './PatientInfo.css';

const PatientInfo = ({ patient, patientId, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nom: patient?.NOM || patient?.nom || '',
    prenom: patient?.PRENOM || patient?.prenom || '',
    date_naissance: patient?.DATE_NAISSANCE || patient?.date_naissance || '',
    sexe: patient?.SEXE || patient?.sexe || '',
    telephone: patient?.TELEPHONE || patient?.telephone || '',
    email: patient?.EMAIL || patient?.email || '',
    adresse: patient?.ADRESSE || patient?.adresse || '',
    groupe_sanguin: patient?.GROUPE_SANGUIN || patient?.groupe_sanguin || '',
    pathologies_principales: patient?.PATHOLOGIES_PRINCIPALES || patient?.pathologies_principales || '',
    antecedents_familiaux: patient?.ANTECEDENTS_FAMILIAUX || patient?.antecedents_familiaux || '',
    allergies: patient?.ALLERGIES || patient?.allergies || '',
    medecin_traitant: patient?.MEDECIN_TRAITANT || patient?.medecin_traitant || ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setSaveMessage('');

      console.log('💾 Sauvegarde des modifications patient', patientId);

      const response = await fetch(`http://localhost:8000/api/patients/${patientId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}`);
      }

      const result = await response.json();
      console.log('✅ Patient mis à jour:', result);

      setSaveMessage('✅ Modifications enregistrées');
      setIsEditing(false);

      // Callback pour rafraîchir les données parent
      if (onUpdate) {
        onUpdate();
      }

      // Effacer message après 3s
      setTimeout(() => setSaveMessage(''), 3000);

    } catch (error) {
      console.error('❌ Erreur sauvegarde:', error);
      setSaveMessage('❌ Erreur lors de la sauvegarde');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    // Réinitialiser avec données originales
    setFormData({
      nom: patient?.NOM || patient?.nom || '',
      prenom: patient?.PRENOM || patient?.prenom || '',
      date_naissance: patient?.DATE_NAISSANCE || patient?.date_naissance || '',
      sexe: patient?.SEXE || patient?.sexe || '',
      telephone: patient?.TELEPHONE || patient?.telephone || '',
      email: patient?.EMAIL || patient?.email || '',
      adresse: patient?.ADRESSE || patient?.adresse || '',
      groupe_sanguin: patient?.GROUPE_SANGUIN || patient?.groupe_sanguin || '',
      pathologies_principales: patient?.PATHOLOGIES_PRINCIPALES || patient?.pathologies_principales || '',
      antecedents_familiaux: patient?.ANTECEDENTS_FAMILIAUX || patient?.antecedents_familiaux || '',
      allergies: patient?.ALLERGIES || patient?.allergies || '',
      medecin_traitant: patient?.MEDECIN_TRAITANT || patient?.medecin_traitant || ''
    });
    setIsEditing(false);
    setSaveMessage('');
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

  return (
    <div className="patient-info">
      <div className="info-header">
        <h3>👤 Informations Patient</h3>
        <div className="header-actions">
          {saveMessage && (
            <span className={`save-message ${saveMessage.includes('✅') ? 'success' : 'error'}`}>
              {saveMessage}
            </span>
          )}
          {!isEditing ? (
            <button className="btn-edit" onClick={() => setIsEditing(true)}>
              ✏️ Modifier
            </button>
          ) : (
            <div className="edit-actions">
              <button className="btn-cancel" onClick={handleCancel} disabled={isSaving}>
                ❌ Annuler
              </button>
              <button className="btn-save" onClick={handleSave} disabled={isSaving}>
                {isSaving ? '⏳ Enregistrement...' : '💾 Enregistrer'}
              </button>
            </div>
          )}
        </div>
      </div>

      {!isEditing ? (
        /* MODE LECTURE */
        <div className="info-view">
          <div className="info-section">
            <h4>📋 Identité</h4>
            <div className="info-grid">
              <div className="info-item">
                <span className="label">Nom complet :</span>
                <span className="value">{formData.nom} {formData.prenom}</span>
              </div>
              <div className="info-item">
                <span className="label">Âge :</span>
                <span className="value">{calculateAge(formData.date_naissance)} ans</span>
              </div>
              <div className="info-item">
                <span className="label">Date de naissance :</span>
                <span className="value">
                  {formData.date_naissance ? new Date(formData.date_naissance).toLocaleDateString('fr-FR') : 'Non renseignée'}
                </span>
              </div>
              <div className="info-item">
                <span className="label">Sexe :</span>
                <span className="value">{formData.sexe === 'M' ? 'Masculin' : formData.sexe === 'F' ? 'Féminin' : 'Non renseigné'}</span>
              </div>
              <div className="info-item">
                <span className="label">Groupe sanguin :</span>
                <span className="value">{formData.groupe_sanguin || 'Non renseigné'}</span>
              </div>
            </div>
          </div>

          <div className="info-section">
            <h4>📞 Contact</h4>
            <div className="info-grid">
              <div className="info-item">
                <span className="label">Téléphone :</span>
                <span className="value">{formData.telephone || 'Non renseigné'}</span>
              </div>
              <div className="info-item">
                <span className="label">Email :</span>
                <span className="value">{formData.email || 'Non renseigné'}</span>
              </div>
              <div className="info-item full-width">
                <span className="label">Adresse :</span>
                <span className="value">{formData.adresse || 'Non renseignée'}</span>
              </div>
            </div>
          </div>

          <div className="info-section medical">
            <h4>🏥 Informations Médicales</h4>
            <div className="info-grid">
              <div className="info-item full-width">
                <span className="label">Pathologies principales :</span>
                <span className="value medical-text">
                  {formData.pathologies_principales || 'Aucune pathologie signalée'}
                </span>
              </div>
              <div className="info-item full-width">
                <span className="label">Antécédents familiaux :</span>
                <span className="value medical-text">
                  {formData.antecedents_familiaux || 'Aucun antécédent signalé'}
                </span>
              </div>
              <div className="info-item full-width alert">
                <span className="label">⚠️ Allergies :</span>
                <span className="value medical-text">
                  {formData.allergies || 'Aucune allergie connue'}
                </span>
              </div>
              <div className="info-item full-width">
                <span className="label">Médecin traitant :</span>
                <span className="value">{formData.medecin_traitant || 'Non renseigné'}</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* MODE ÉDITION */
        <div className="info-edit">
          <div className="form-section">
            <h4>📋 Identité</h4>
            <div className="form-grid">
              <div className="form-group">
                <label>Nom *</label>
                <input
                  type="text"
                  name="nom"
                  value={formData.nom}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Prénom *</label>
                <input
                  type="text"
                  name="prenom"
                  value={formData.prenom}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Date de naissance *</label>
                <input
                  type="date"
                  name="date_naissance"
                  value={formData.date_naissance}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Sexe *</label>
                <select
                  name="sexe"
                  value={formData.sexe}
                  onChange={handleChange}
                  required
                >
                  <option value="">Sélectionner</option>
                  <option value="M">Masculin</option>
                  <option value="F">Féminin</option>
                </select>
              </div>
              <div className="form-group">
                <label>Groupe sanguin</label>
                <select
                  name="groupe_sanguin"
                  value={formData.groupe_sanguin}
                  onChange={handleChange}
                >
                  <option value="">Sélectionner</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h4>📞 Contact</h4>
            <div className="form-grid">
              <div className="form-group">
                <label>Téléphone</label>
                <input
                  type="tel"
                  name="telephone"
                  value={formData.telephone}
                  onChange={handleChange}
                  placeholder="06 12 34 56 78"
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="patient@example.com"
                />
              </div>
              <div className="form-group full-width">
                <label>Adresse complète</label>
                <textarea
                  name="adresse"
                  value={formData.adresse}
                  onChange={handleChange}
                  rows="2"
                  placeholder="Numéro, rue, code postal, ville"
                />
              </div>
            </div>
          </div>

          <div className="form-section medical-section">
            <h4>🏥 Informations Médicales</h4>
            <div className="form-grid">
              <div className="form-group full-width">
                <label>Pathologies principales</label>
                <textarea
                  name="pathologies_principales"
                  value={formData.pathologies_principales}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Diabète type 2, HTA, Asthme..."
                />
                <small>Séparer par des virgules</small>
              </div>
              <div className="form-group full-width">
                <label>Antécédents familiaux</label>
                <textarea
                  name="antecedents_familiaux"
                  value={formData.antecedents_familiaux}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Père : diabète, Mère : cancer du sein..."
                />
              </div>
              <div className="form-group full-width alert-field">
                <label>⚠️ Allergies</label>
                <textarea
                  name="allergies"
                  value={formData.allergies}
                  onChange={handleChange}
                  rows="2"
                  placeholder="Pénicilline, Pollen, Arachides..."
                />
                <small className="warning-text">⚠️ Information critique pour la sécurité du patient</small>
              </div>
              <div className="form-group full-width">
                <label>Médecin traitant</label>
                <input
                  type="text"
                  name="medecin_traitant"
                  value={formData.medecin_traitant}
                  onChange={handleChange}
                  placeholder="Dr. Nom Prénom"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientInfo;