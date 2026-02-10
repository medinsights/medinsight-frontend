import React, { useState, useEffect } from 'react';
import { PatientService } from '../../services/patient.service';
import type { Patient, Consultation } from '../../services/patient.service';

interface PatientConsultationsProps {
  patient: Patient;
  patientId: string;
  onUpdate: () => void;
}

const PatientConsultations: React.FC<PatientConsultationsProps> = ({ patientId }) => {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [expandedConsult, setExpandedConsult] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    motif: '', examen_clinique: '', diagnostic: '', prescription: '', remarques: ''
  });

  useEffect(() => {
    fetchConsultations();
  }, [patientId]);

  const fetchConsultations = async () => {
    try {
      const id = typeof patientId === 'string' ? parseInt(patientId) : patientId;
      const data = await PatientService.getConsultations(id);
      setConsultations(data || []);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.motif) {
      alert('Le motif est obligatoire');
      return;
    }
    try {
      const id = typeof patientId === 'string' ? parseInt(patientId) : patientId;
      await PatientService.createConsultation(id, {
        ...formData,
        date_consultation: new Date().toISOString().split('T')[0]
      } as Consultation);
      alert('✅ Consultation ajoutée !');
      setFormData({ motif: '', examen_clinique: '', diagnostic: '', prescription: '', remarques: '' });
      setShowAddForm(false);
      fetchConsultations();
    } catch (error) {
      alert('❌ Erreur');
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h3 style={{ color: '#f1f5f9', margin: 0 }}>🩺 Consultations</h3>
          <p style={{ color: '#94a3b8', fontSize: '14px', margin: '5px 0 0 0' }}>{consultations.length} consultation(s)</p>
        </div>
        <button onClick={() => setShowAddForm(!showAddForm)} style={{
          background: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px',
          padding: '10px 20px', cursor: 'pointer', fontWeight: '600'
        }}>
          {showAddForm ? 'Annuler' : '+ Nouvelle Consultation'}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleSubmit} style={{ background: '#1e293b', borderRadius: '12px', padding: '20px', marginBottom: '20px', border: '1px solid #334155' }}>
          <div style={{ display: 'grid', gap: '15px' }}>
            <input type="text" placeholder="Motif de consultation *" value={formData.motif}
              onChange={e => setFormData({...formData, motif: e.target.value})} required
              style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '6px', padding: '10px', color: '#f1f5f9' }}
            />
            <textarea placeholder="Examen clinique" value={formData.examen_clinique}
              onChange={e => setFormData({...formData, examen_clinique: e.target.value})} rows={3}
              style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '6px', padding: '10px', color: '#f1f5f9', resize: 'vertical' }}
            />
            <input type="text" placeholder="Diagnostic" value={formData.diagnostic}
              onChange={e => setFormData({...formData, diagnostic: e.target.value})}
              style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '6px', padding: '10px', color: '#f1f5f9' }}
            />
            <textarea placeholder="Prescription" value={formData.prescription}
              onChange={e => setFormData({...formData, prescription: e.target.value})} rows={2}
              style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '6px', padding: '10px', color: '#f1f5f9', resize: 'vertical' }}
            />
            <textarea placeholder="Remarques" value={formData.remarques}
              onChange={e => setFormData({...formData, remarques: e.target.value})} rows={2}
              style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '6px', padding: '10px', color: '#f1f5f9', resize: 'vertical' }}
            />
          </div>
          <button type="submit" style={{ marginTop: '15px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', padding: '10px 20px', cursor: 'pointer', fontWeight: '600' }}>
            Enregistrer
          </button>
        </form>
      )}

      {loading ? (
        <p style={{ color: '#94a3b8', textAlign: 'center', padding: '40px 0' }}>Chargement...</p>
      ) : consultations.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <p style={{ color: '#94a3b8', fontSize: '16px' }}>Aucune consultation enregistrée</p>
        </div>
      ) : (
        <div style={{ position: 'relative' }}>
          {/* Timeline */}
          <div style={{ position: 'absolute', left: '20px', top: '10px', bottom: '10px', width: '2px', background: '#334155' }}></div>
          
          <div style={{ display: 'grid', gap: '20px', paddingLeft: '50px' }}>
            {consultations.map((consult) => (
              <div key={consult.id} style={{ position: 'relative' }}>
                {/* Timeline dot */}
                <div style={{ position: 'absolute', left: '-42px', top: '10px', width: '16px', height: '16px', background: '#3b82f6', borderRadius: '50%', border: '3px solid #0f172a' }}></div>
                
                <div style={{ background: '#1e293b', borderRadius: '12px', padding: '20px', border: '1px solid #334155' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '10px' }}>
                    <div>
                      <h4 style={{ color: '#f1f5f9', margin: 0, fontSize: '16px' }}>{consult.motif}</h4>
                      <span style={{ color: '#64748b', fontSize: '14px' }}>{formatDate(consult.date_consultation)}</span>
                    </div>
                    <button onClick={() => setExpandedConsult(expandedConsult === consult.id ? null : (consult.id ?? null))} style={{
                      background: '#334155', color: '#cbd5e1', border: 'none', borderRadius: '6px',
                      padding: '6px 12px', cursor: 'pointer', fontSize: '14px'
                    }}>
                      {expandedConsult === consult.id ? '▲' : '▼'}
                    </button>
                  </div>
                  
                  {expandedConsult === consult.id && (
                    <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px solid #334155' }}>
                      {consult.examen_clinique && (
                        <div style={{ marginBottom: '12px' }}>
                          <strong style={{ color: '#94a3b8', fontSize: '14px' }}>Examen clinique:</strong>
                          <p style={{ color: '#cbd5e1', margin: '5px 0 0 0', lineHeight: '1.6' }}>{consult.examen_clinique}</p>
                        </div>
                      )}
                      {consult.diagnostic && (
                        <div style={{ marginBottom: '12px' }}>
                          <strong style={{ color: '#94a3b8', fontSize: '14px' }}>Diagnostic:</strong>
                          <p style={{ color: '#cbd5e1', margin: '5px 0 0 0' }}>{consult.diagnostic}</p>
                        </div>
                      )}
                      {consult.prescription && (
                        <div style={{ marginBottom: '12px' }}>
                          <strong style={{ color: '#94a3b8', fontSize: '14px' }}>Prescription:</strong>
                          <p style={{ color: '#cbd5e1', margin: '5px 0 0 0', lineHeight: '1.6' }}>{consult.prescription}</p>
                        </div>
                      )}
                      {consult.remarques && (
                        <div>
                          <strong style={{ color: '#94a3b8', fontSize: '14px' }}>Remarques:</strong>
                          <p style={{ color: '#cbd5e1', margin: '5px 0 0 0' }}>{consult.remarques}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientConsultations;
