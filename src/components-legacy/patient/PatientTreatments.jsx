// frontend/src/components/patient/PatientTreatments.jsx
import React, { useState, useEffect } from 'react';
import './PatientTreatments.css';

const PatientTreatments = ({ patient, patientId }) => {
  const [treatments, setTreatments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTreatment, setEditingTreatment] = useState(null);
  const [formData, setFormData] = useState({
    medicament: '',
    dosage: '',
    frequence: '',
    voie_administration: 'Orale',
    indication: '',
    date_debut: new Date().toISOString().split('T')[0],
    date_fin: '',
    notes: ''
  });

  useEffect(() => {
    fetchTreatments();
  }, [patientId]);

  const fetchTreatments = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/patients/${patientId}/traitements`);
      const data = await response.json();
      setTreatments(data || []);
    } catch (error) {
      console.error('Erreur chargement traitements:', error);
      setTreatments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.medicament || !formData.dosage) {
      alert('Veuillez remplir les champs obligatoires');
      return;
    }

    try {
      const url = editingTreatment
        ? `http://localhost:8000/api/traitements/${editingTreatment.id}`
        : 'http://localhost:8000/api/traitements';
      
      const method = editingTreatment ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patient_id: patientId,
          ...formData
        })
      });

      if (response.ok) {
        alert(`✅ Traitement ${editingTreatment ? 'modifié' : 'ajouté'} avec succès !`);
        resetForm();
        fetchTreatments();
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('❌ Erreur lors de l\'enregistrement');
    }
  };

  const handleEdit = (treatment) => {
    setEditingTreatment(treatment);
    setFormData({
      medicament: treatment.medicament || '',
      dosage: treatment.dosage || '',
      frequence: treatment.frequence || '',
      voie_administration: treatment.voie_administration || 'Orale',
      indication: treatment.indication || '',
      date_debut: treatment.date_debut || '',
      date_fin: treatment.date_fin || '',
      notes: treatment.notes || ''
    });
    setShowAddForm(true);
  };

  const handleStop = async (treatmentId) => {
    if (!confirm('Voulez-vous vraiment arrêter ce traitement ?')) return;

    try {
      const response = await fetch(`http://localhost:8000/api/traitements/${treatmentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          statut: 'Arrêté',
          date_fin: new Date().toISOString().split('T')[0]
        })
      });

      if (response.ok) {
        alert('✅ Traitement arrêté');
        fetchTreatments();
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      medicament: '',
      dosage: '',
      frequence: '',
      voie_administration: 'Orale',
      indication: '',
      date_debut: new Date().toISOString().split('T')[0],
      date_fin: '',
      notes: ''
    });
    setEditingTreatment(null);
    setShowAddForm(false);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('fr-FR');
  };

  const calculateDuration = (dateDebut, dateFin) => {
    if (!dateDebut) return '';
    const start = new Date(dateDebut);
    const end = dateFin ? new Date(dateFin) : new Date();
    const days = Math.floor((end - start) / (1000 * 60 * 60 * 24));
    
    if (days < 30) return `${days} jour${days > 1 ? 's' : ''}`;
    if (days < 365) {
      const months = Math.floor(days / 30);
      return `${months} mois`;
    }
    const years = Math.floor(days / 365);
    return `${years} an${years > 1 ? 's' : ''}`;
  };

  const activeTreatments = treatments.filter(t => t.statut !== 'Arrêté');
  const stoppedTreatments = treatments.filter(t => t.statut === 'Arrêté');

  if (loading) {
    return (
      <div className="treatments-loading">
        <div className="spinner"></div>
        <p>Chargement des traitements...</p>
      </div>
    );
  }

  return (
    <div className="patient-treatments">
      {/* Header */}
      <div className="treatments-header">
        <div>
          <h3>💊 Traitements Médicamenteux</h3>
          <p>Gestion des prescriptions actives et historique</p>
        </div>
        <button
          className="btn-add-treatment"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? '❌ Annuler' : '➕ Nouveau Traitement'}
        </button>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="treatment-form-card">
          <h4>{editingTreatment ? '✏️ Modifier le traitement' : '➕ Ajouter un traitement'}</h4>
          
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label>Médicament *</label>
                <input
                  type="text"
                  name="medicament"
                  value={formData.medicament}
                  onChange={handleInputChange}
                  placeholder="Ex: Metformine"
                  required
                />
              </div>

              <div className="form-group">
                <label>Dosage *</label>
                <input
                  type="text"
                  name="dosage"
                  value={formData.dosage}
                  onChange={handleInputChange}
                  placeholder="Ex: 850mg"
                  required
                />
              </div>

              <div className="form-group">
                <label>Fréquence</label>
                <input
                  type="text"
                  name="frequence"
                  value={formData.frequence}
                  onChange={handleInputChange}
                  placeholder="Ex: 2 fois/jour"
                />
              </div>

              <div className="form-group">
                <label>Voie d'administration</label>
                <select
                  name="voie_administration"
                  value={formData.voie_administration}
                  onChange={handleInputChange}
                >
                  <option value="Orale">Orale</option>
                  <option value="Injectable">Injectable</option>
                  <option value="Cutanée">Cutanée</option>
                  <option value="Inhalation">Inhalation</option>
                  <option value="Autre">Autre</option>
                </select>
              </div>

              <div className="form-group full-width">
                <label>Indication</label>
                <input
                  type="text"
                  name="indication"
                  value={formData.indication}
                  onChange={handleInputChange}
                  placeholder="Ex: Diabète type 2"
                />
              </div>

              <div className="form-group">
                <label>Date de début</label>
                <input
                  type="date"
                  name="date_debut"
                  value={formData.date_debut}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>Date de fin (optionnel)</label>
                <input
                  type="date"
                  name="date_fin"
                  value={formData.date_fin}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group full-width">
                <label>Notes</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Observations, effets secondaires, etc."
                  rows="3"
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="button" onClick={resetForm} className="btn-cancel">
                Annuler
              </button>
              <button type="submit" className="btn-submit">
                {editingTreatment ? '✅ Enregistrer' : '➕ Ajouter'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Active Treatments */}
      <div className="treatments-section">
        <div className="section-header">
          <h4>🟢 Traitements Actifs</h4>
          <span className="count-badge">{activeTreatments.length}</span>
        </div>

        {activeTreatments.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">💊</span>
            <p>Aucun traitement actif</p>
          </div>
        ) : (
          <div className="treatments-grid">
            {activeTreatments.map(treatment => (
              <div key={treatment.id} className="treatment-card active">
                <div className="treatment-header">
                  <div className="treatment-title">
                    <h5>{treatment.medicament}</h5>
                    <span className="dosage-badge">{treatment.dosage}</span>
                  </div>
                  <div className="treatment-actions">
                    <button
                      className="action-icon edit"
                      onClick={() => handleEdit(treatment)}
                      title="Modifier"
                    >
                      ✏️
                    </button>
                    <button
                      className="action-icon stop"
                      onClick={() => handleStop(treatment.id)}
                      title="Arrêter"
                    >
                      ⏹️
                    </button>
                  </div>
                </div>

                <div className="treatment-details">
                  {treatment.frequence && (
                    <div className="detail-item">
                      <span className="detail-icon">📋</span>
                      <span>{treatment.frequence}</span>
                    </div>
                  )}
                  {treatment.voie_administration && (
                    <div className="detail-item">
                      <span className="detail-icon">💉</span>
                      <span>{treatment.voie_administration}</span>
                    </div>
                  )}
                  {treatment.indication && (
                    <div className="detail-item indication">
                      <span className="detail-icon">🎯</span>
                      <span>{treatment.indication}</span>
                    </div>
                  )}
                </div>

                <div className="treatment-footer">
                  <span className="date-info">
                    📅 Depuis le {formatDate(treatment.date_debut)}
                  </span>
                  <span className="duration-badge">
                    {calculateDuration(treatment.date_debut, treatment.date_fin)}
                  </span>
                </div>

                {treatment.notes && (
                  <div className="treatment-notes">
                    <strong>📝 Notes :</strong> {treatment.notes}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Stopped Treatments */}
      {stoppedTreatments.length > 0 && (
        <div className="treatments-section">
          <div className="section-header">
            <h4>⚪ Traitements Arrêtés</h4>
            <span className="count-badge">{stoppedTreatments.length}</span>
          </div>

          <div className="treatments-grid">
            {stoppedTreatments.map(treatment => (
              <div key={treatment.id} className="treatment-card stopped">
                <div className="treatment-header">
                  <div className="treatment-title">
                    <h5>{treatment.medicament}</h5>
                    <span className="dosage-badge">{treatment.dosage}</span>
                  </div>
                  <span className="stopped-badge">Arrêté</span>
                </div>

                <div className="treatment-details">
                  {treatment.indication && (
                    <div className="detail-item">
                      <span className="detail-icon">🎯</span>
                      <span>{treatment.indication}</span>
                    </div>
                  )}
                </div>

                <div className="treatment-footer">
                  <span className="date-info">
                    Du {formatDate(treatment.date_debut)} au {formatDate(treatment.date_fin)}
                  </span>
                  <span className="duration-badge">
                    {calculateDuration(treatment.date_debut, treatment.date_fin)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientTreatments;