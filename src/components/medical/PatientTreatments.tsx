import React, { useState, useEffect } from 'react';
import { PatientService } from '../../services/patient.service';
import type { Patient, Treatment } from '../../services/patient.service';

interface PatientTreatmentsProps {
  patient: Patient;
  patientId: string;
  onUpdate: () => void;
}

const PatientTreatments: React.FC<PatientTreatmentsProps> = ({ patientId }) => {
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({ medicament: '', dosage: '', frequence: '', indication: '' });

  useEffect(() => {
    fetchTreatments();
  }, [patientId]);

  const fetchTreatments = async () => {
    try {
      const id = typeof patientId === 'string' ? parseInt(patientId) : patientId;
      const data = await PatientService.getTreatments(id);
      setTreatments(data || []);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.medicament || !formData.dosage) {
      alert('Veuillez remplir les champs obligatoires');
      return;
    }
    try {
      const id = typeof patientId === 'string' ? parseInt(patientId) : patientId;
      await PatientService.createTreatment(id, { ...formData, statut: 'Actif' } as Treatment);
      alert('✅ Traitement ajouté !');
      setFormData({ medicament: '', dosage: '', frequence: '', indication: '' });
      setShowAddForm(false);
      fetchTreatments();
    } catch (error) {
      alert('❌ Erreur');
    }
  };

  const activeTreatments = treatments.filter(t => t.statut !== 'Arrêté');
  const stoppedTreatments = treatments.filter(t => t.statut === 'Arrêté');

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ color: '#f1f5f9' }}>💊 Traitements</h3>
        <button onClick={() => setShowAddForm(!showAddForm)} style={{
          background: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px',
          padding: '10px 20px', cursor: 'pointer', fontWeight: '600'
        }}>
          {showAddForm ? 'Annuler' : '+ Ajouter'}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleSubmit} style={{ background: '#1e293b', borderRadius: '12px', padding: '20px', marginBottom: '20px', border: '1px solid #334155' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <input type="text" placeholder="Médicament *" value={formData.medicament}
              onChange={e => setFormData({...formData, medicament: e.target.value})} required
              style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '6px', padding: '10px', color: '#f1f5f9' }}
            />
            <input type="text" placeholder="Dosage *" value={formData.dosage}
              onChange={e => setFormData({...formData, dosage: e.target.value})} required
              style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '6px', padding: '10px', color: '#f1f5f9' }}
            />
            <input type="text" placeholder="Fréquence" value={formData.frequence}
              onChange={e => setFormData({...formData, frequence: e.target.value})}
              style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '6px', padding: '10px', color: '#f1f5f9' }}
            />
            <input type="text" placeholder="Indication" value={formData.indication}
              onChange={e => setFormData({...formData, indication: e.target.value})}
              style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '6px', padding: '10px', color: '#f1f5f9' }}
            />
          </div>
          <button type="submit" style={{ marginTop: '15px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', padding: '10px 20px', cursor: 'pointer' }}>
            Enregistrer
          </button>
        </form>
      )}

      <div style={{ marginBottom: '30px' }}>
        <h4 style={{ color: '#22c55e', marginBottom: '15px' }}>✅ Traitements Actifs ({activeTreatments.length})</h4>
        {loading ? <p style={{ color: '#94a3b8' }}>Chargement...</p> : activeTreatments.length === 0 ? (
          <p style={{ color: '#94a3b8' }}>Aucun traitement actif</p>
        ) : (
          <div style={{ display: 'grid', gap: '10px' }}>
            {activeTreatments.map(t => (
              <div key={t.id} style={{ background: '#1e293b', borderRadius: '8px', padding: '15px', border: '1px solid #334155' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#f1f5f9', fontWeight: '600' }}>💊 {t.medicament}</span>
                  <span style={{ color: '#3b82f6' }}>{t.dosage}</span>
                </div>
                {t.frequence && <p style={{ color: '#94a3b8', fontSize: '14px', margin: '5px 0 0 0' }}>Fréquence: {t.frequence}</p>}
              </div>
            ))}
          </div>
        )}
      </div>

      {stoppedTreatments.length > 0 && (
        <div>
          <h4 style={{ color: '#94a3b8', marginBottom: '15px' }}>📋 Historique ({stoppedTreatments.length})</h4>
          <div style={{ display: 'grid', gap: '10px' }}>
            {stoppedTreatments.map(t => (
              <div key={t.id} style={{ background: '#0f172a', borderRadius: '8px', padding: '15px', border: '1px solid #1e293b', opacity: 0.7 }}>
                <span style={{ color: '#cbd5e1' }}>💊 {t.medicament} - {t.dosage}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientTreatments;
