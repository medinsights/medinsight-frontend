// frontend/src/components/patient/ModalCoordonnees.jsx
import React, { useState, useEffect } from 'react';
import './ModalCoordonnees.css';

const ModalCoordonnees = ({ isOpen, onClose, patient, onSave }) => {
  const [formData, setFormData] = useState({
    telephone: '',
    email: '',
    adresse: ''
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (patient) {
      setFormData({
        telephone: patient.TELEPHONE || patient.telephone || '',
        email: patient.EMAIL || patient.email || '',
        adresse: patient.ADRESSE || patient.adresse || ''
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
        alert('✅ Coordonnées mises à jour avec succès !');
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
      <div className="modal-content modal-coordonnees" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>📞 Coordonnées du Patient</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="coordonnees-form">
          <div className="form-sections">
            
            {/* Téléphone */}
            <div className="form-group">
              <label>📱 Téléphone</label>
              <input
                type="tel"
                name="telephone"
                value={formData.telephone}
                onChange={handleChange}
                placeholder="Ex: 06 12 34 56 78"
              />
              <small>Format: 06 12 34 56 78 ou +33 6 12 34 56 78</small>
            </div>

            {/* Email */}
            <div className="form-group">
              <label>✉️ Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Ex: patient@example.com"
              />
            </div>

            {/* Adresse Complète */}
            <div className="form-group">
              <label>🏠 Adresse Complète</label>
              <textarea
                name="adresse"
                value={formData.adresse}
                onChange={handleChange}
                rows="4"
                placeholder="Ex: 123 Rue de la République&#10;Appartement 4B&#10;75001 Paris&#10;France"
              />
              <small>Numéro, rue, code postal, ville</small>
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

export default ModalCoordonnees;