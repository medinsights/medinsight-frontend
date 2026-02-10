// frontend/src/components/patient/ModalPathologies.jsx
import React, { useState, useEffect } from 'react';
import './ModalPathologies.css';

const ModalPathologies = ({ isOpen, onClose, patient, onSave }) => {
  const [formData, setFormData] = useState({
    pathologies_principales: '',
    antecedents_familiaux: '',
    allergies: '',
    medecin_traitant: '',
    groupe_sanguin: ''
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (patient) {
      setFormData({
        pathologies_principales: patient.PATHOLOGIES_PRINCIPALES || patient.pathologies_principales || '',
        antecedents_familiaux: patient.ANTECEDENTS_FAMILIAUX || patient.antecedents_familiaux || '',
        allergies: patient.ALLERGIES || patient.allergies || '',
        medecin_traitant: patient.MEDECIN_TRAITANT || patient.medecin_traitant || '',
        groupe_sanguin: patient.GROUPE_SANGUIN || patient.groupe_sanguin || ''
      });
    }
  }, [patient]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch(`http://localhost:8000/api/patients/${patient.id || patient.ID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert('✅ Informations médicales mises à jour avec succès !');
        onSave();
        onClose();
      } else {
        const error = await response.json();
        alert(`❌ Erreur: ${error.error || 'Mise à jour échouée'}`);
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('❌ Erreur lors de la mise à jour');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-pathologies" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>🏥 Informations Médicales</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="pathologies-form">
          <div className="form-sections">
            
            {/* Groupe Sanguin */}
            <div className="form-group">
              <label>🩸 Groupe Sanguin</label>
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

            {/* Pathologies Principales */}
            <div className="form-group">
              <label>🏥 Pathologies Principales</label>
              <textarea
                name="pathologies_principales"
                value={formData.pathologies_principales}
                onChange={handleChange}
                rows="4"
                placeholder="Ex: Diabète type 2, Hypertension artérielle, Asthme..."
              />
              <small>Séparez les pathologies par des virgules</small>
            </div>

            {/* Antécédents Familiaux */}
            <div className="form-group">
              <label>👨‍👩‍👧‍👦 Antécédents Familiaux</label>
              <textarea
                name="antecedents_familiaux"
                value={formData.antecedents_familiaux}
                onChange={handleChange}
                rows="3"
                placeholder="Ex: Père : diabète type 2, Mère : cancer du sein..."
              />
              <small>Maladies dans la famille proche</small>
            </div>

            {/* Allergies - IMPORTANT */}
            <div className="form-group alert-group">
              <label>⚠️ Allergies</label>
              <textarea
                name="allergies"
                value={formData.allergies}
                onChange={handleChange}
                rows="3"
                placeholder="Ex: Pénicilline, Arachides, Pollen..."
              />
              <small className="warning-text">
                ⚠️ Information critique pour la sécurité du patient
              </small>
            </div>

            {/* Médecin Traitant */}
            <div className="form-group">
              <label>👨‍⚕️ Médecin Traitant</label>
              <input
                type="text"
                name="medecin_traitant"
                value={formData.medecin_traitant}
                onChange={handleChange}
                placeholder="Ex: Dr. Martin Dupont"
              />
            </div>

          </div>

          <div className="modal-actions">
            <button
              type="button"
              onClick={onClose}
              className="btn-cancel"
              disabled={saving}
            >
              ❌ Annuler
            </button>
            <button
              type="submit"
              className="btn-save"
              disabled={saving}
            >
              {saving ? '⏳ Enregistrement...' : '✅ Enregistrer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalPathologies;