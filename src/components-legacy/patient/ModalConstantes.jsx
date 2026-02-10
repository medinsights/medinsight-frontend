// frontend/src/components/patient/ModalConstantes.jsx
import React, { useState, useEffect } from 'react';
import './ModalConstantes.css';

const ModalConstantes = ({ isOpen, onClose, patient, constantes, onSave }) => {
  const [formData, setFormData] = useState({
    poids: '',
    taille: '',
    tension_systolique: '',
    tension_diastolique: '',
    frequence_cardiaque: '',
    temperature: '',
    saturation_oxygene: '',
    date_mesure: new Date().toISOString().split('T')[0]
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (constantes) {
      setFormData({
        poids: constantes.poids || '',
        taille: constantes.taille || '',
        tension_systolique: constantes.tension_systolique || '',
        tension_diastolique: constantes.tension_diastolique || '',
        frequence_cardiaque: constantes.frequence_cardiaque || '',
        temperature: constantes.temperature || '',
        saturation_oxygene: constantes.saturation_oxygene || '',
        date_mesure: constantes.date_mesure || new Date().toISOString().split('T')[0]
      });
    }
  }, [constantes]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateIMC = () => {
    if (formData.poids && formData.taille) {
      const tailleM = formData.taille / 100;
      const imc = (formData.poids / (tailleM * tailleM)).toFixed(1);
      return imc;
    }
    return '-';
  };

  const getIMCCategory = (imc) => {
    if (!imc || imc === '-') return '';
    const imcNum = parseFloat(imc);
    if (imcNum < 18.5) return 'Insuffisance pondérale';
    if (imcNum < 25) return 'Poids normal';
    if (imcNum < 30) return 'Surpoids';
    return 'Obésité';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch('http://localhost:8000/api/constantes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          patient_id: patient.id,
          ...formData,
          poids: parseFloat(formData.poids) || null,
          taille: parseInt(formData.taille) || null,
          tension_systolique: parseInt(formData.tension_systolique) || null,
          tension_diastolique: parseInt(formData.tension_diastolique) || null,
          frequence_cardiaque: parseInt(formData.frequence_cardiaque) || null,
          temperature: parseFloat(formData.temperature) || null,
          saturation_oxygene: parseInt(formData.saturation_oxygene) || null
        })
      });

      if (response.ok) {
        alert('✅ Constantes enregistrées avec succès !');
        onSave();
        onClose();
      } else {
        const error = await response.json();
        alert(`❌ Erreur: ${error.error || 'Enregistrement échoué'}`);
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('❌ Erreur lors de l\'enregistrement');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  const imc = calculateIMC();
  const imcCategory = getIMCCategory(imc);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>📊 Modifier les Constantes Vitales</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="constantes-form">
          <div className="form-grid">
            {/* Date */}
            <div className="form-group full-width">
              <label>📅 Date de mesure</label>
              <input
                type="date"
                name="date_mesure"
                value={formData.date_mesure}
                onChange={handleChange}
                required
              />
            </div>

            {/* Poids */}
            <div className="form-group">
              <label>⚖️ Poids (kg)</label>
              <input
                type="number"
                step="0.1"
                name="poids"
                value={formData.poids}
                onChange={handleChange}
                placeholder="Ex: 75.5"
              />
            </div>

            {/* Taille */}
            <div className="form-group">
              <label>📏 Taille (cm)</label>
              <input
                type="number"
                name="taille"
                value={formData.taille}
                onChange={handleChange}
                placeholder="Ex: 175"
              />
            </div>

            {/* IMC Calculé */}
            {imc !== '-' && (
              <div className="form-group full-width">
                <div className="imc-display">
                  <span className="imc-label">📈 IMC Calculé:</span>
                  <span className="imc-value">{imc}</span>
                  <span className="imc-category">({imcCategory})</span>
                </div>
              </div>
            )}

            {/* Tension Systolique */}
            <div className="form-group">
              <label>💓 Tension Systolique (mmHg)</label>
              <input
                type="number"
                name="tension_systolique"
                value={formData.tension_systolique}
                onChange={handleChange}
                placeholder="Ex: 120"
              />
            </div>

            {/* Tension Diastolique */}
            <div className="form-group">
              <label>💓 Tension Diastolique (mmHg)</label>
              <input
                type="number"
                name="tension_diastolique"
                value={formData.tension_diastolique}
                onChange={handleChange}
                placeholder="Ex: 80"
              />
            </div>

            {/* Fréquence Cardiaque */}
            <div className="form-group">
              <label>❤️ Fréquence Cardiaque (bpm)</label>
              <input
                type="number"
                name="frequence_cardiaque"
                value={formData.frequence_cardiaque}
                onChange={handleChange}
                placeholder="Ex: 72"
              />
            </div>

            {/* Température */}
            <div className="form-group">
              <label>🌡️ Température (°C)</label>
              <input
                type="number"
                step="0.1"
                name="temperature"
                value={formData.temperature}
                onChange={handleChange}
                placeholder="Ex: 36.7"
              />
            </div>

            {/* Saturation */}
            <div className="form-group">
              <label>🫁 Saturation O₂ (%)</label>
              <input
                type="number"
                name="saturation_oxygene"
                value={formData.saturation_oxygene}
                onChange={handleChange}
                placeholder="Ex: 98"
                min="0"
                max="100"
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

export default ModalConstantes;