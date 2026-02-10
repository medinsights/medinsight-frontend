// frontend/src/components/patient/AddPatient.jsx
import React, { useState } from 'react';
import './AddPatient.css';

const AddPatient = ({ onAddPatient }) => {  // ✅ Correct
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    sexe: '',
    date_naissance: '',
    telephone: '',
    email: '',
    adresse: '',
    groupe_sanguin: '',
    pathologies_principales: '',
    antecedents_familiaux: '',
    allergies: 'Aucune allergie connue',
    medecin_traitant: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      console.log('📤 Envoi création patient:', formData);

      const response = await fetch('http://localhost:8000/api/patients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erreur création patient');
      }

      const result = await response.json();
      console.log('✅ Patient créé:', result);

      alert('✅ Patient créé avec succès !');

      // ✅ Appeler callback avec le patient créé
      if (onAddPatient) {
        onAddPatient(result.patient);
      }

      // Réinitialiser formulaire
      setFormData({
        nom: '',
        prenom: '',
        sexe: '',
        date_naissance: '',
        telephone: '',
        email: '',
        adresse: '',
        groupe_sanguin: '',
        pathologies_principales: '',
        antecedents_familiaux: '',
        allergies: 'Aucune allergie connue',
        medecin_traitant: ''
      });

    } catch (error) {
      console.error('❌ Erreur:', error);
      alert(`❌ Erreur: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="add-patient-form">
      <div className="form-header">
        <h2>➕ Nouveau Patient</h2>
        <p className="form-subtitle">Remplissez les informations du patient</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-section">
          <h3>👤 Identité</h3>
          <div className="form-grid">
            <div className="form-row">
              <label>Nom *</label>
              <input 
                type="text" 
                name="nom" 
                value={formData.nom} 
                onChange={handleChange} 
                required 
                placeholder="Ex: DUPONT"
              />
            </div>

            <div className="form-row">
              <label>Prénom *</label>
              <input 
                type="text" 
                name="prenom" 
                value={formData.prenom} 
                onChange={handleChange} 
                required 
                placeholder="Ex: Jean"
              />
            </div>

            <div className="form-row">
              <label>Sexe *</label>
              <select name="sexe" value={formData.sexe} onChange={handleChange} required>
                <option value="">Sélectionner</option>
                <option value="M">Masculin</option>
                <option value="F">Féminin</option>
              </select>
            </div>

            <div className="form-row">
              <label>Date de naissance</label>
              <input 
                type="date" 
                name="date_naissance" 
                value={formData.date_naissance} 
                onChange={handleChange} 
              />
            </div>

            <div className="form-row">
              <label>Groupe Sanguin</label>
              <select name="groupe_sanguin" value={formData.groupe_sanguin} onChange={handleChange}>
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
          <h3>📞 Contact</h3>
          <div className="form-grid">
            <div className="form-row">
              <label>Téléphone</label>
              <input 
                type="tel" 
                name="telephone" 
                value={formData.telephone} 
                onChange={handleChange} 
                placeholder="Ex: 06 12 34 56 78"
              />
            </div>

            <div className="form-row">
              <label>Email</label>
              <input 
                type="email" 
                name="email" 
                value={formData.email} 
                onChange={handleChange} 
                placeholder="Ex: patient@example.com"
              />
            </div>

            <div className="form-row full-width">
              <label>Adresse</label>
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

        <div className="form-section medical">
          <h3>🏥 Informations Médicales</h3>
          <div className="form-grid">
            <div className="form-row full-width">
              <label>Pathologies Principales</label>
              <textarea 
                name="pathologies_principales" 
                value={formData.pathologies_principales} 
                onChange={handleChange}
                rows="2"
                placeholder="Ex: Diabète type 2, Hypertension..."
              />
              <small>Séparez les pathologies par des virgules</small>
            </div>

            <div className="form-row full-width">
              <label>Antécédents Familiaux</label>
              <textarea 
                name="antecedents_familiaux" 
                value={formData.antecedents_familiaux} 
                onChange={handleChange}
                rows="2"
                placeholder="Ex: Père : diabète, Mère : HTA..."
              />
            </div>

            <div className="form-row full-width alert-row">
              <label>⚠️ Allergies</label>
              <textarea 
                name="allergies" 
                value={formData.allergies} 
                onChange={handleChange}
                rows="2"
                placeholder="Ex: Pénicilline, Arachides..."
              />
              <small className="warning-text">⚠️ Information critique</small>
            </div>

            <div className="form-row full-width">
              <label>Médecin Traitant</label>
              <input 
                type="text" 
                name="medecin_traitant" 
                value={formData.medecin_traitant} 
                onChange={handleChange}
                placeholder="Ex: Dr. Martin Dupont"
              />
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button 
            type="submit" 
            className="btn-submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? '⏳ Création...' : '✅ Créer Patient'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddPatient;