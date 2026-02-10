// frontend/src/components/patient/PatientConsultationsAmeliore.jsx
/**
 * PAGE CONSULTATIONS AMÉLIORÉE
 * 
 * Nouvelles fonctionnalités:
 * - Recherche & filtres avancés
 * - Statistiques en temps réel
 * - Templates de consultation
 * - Assistant IA pour génération
 * - Export PDF professionnel
 * - Timeline visuelle
 */

import React, { useState, useEffect } from 'react';
import SearchBar from '../common/Searchbar';
import StatsWidget from '../common/Statswidget';
import StatusBadge from '../common/Statusbadge';
import './PatientConsultations.css';

const PatientConsultationsAmeliore = ({ patient, patientId }) => {
  // ============================================================================
  // ÉTATS
  // ============================================================================
  
  const [consultations, setConsultations] = useState([]);
  const [filteredConsultations, setFilteredConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [expandedConsult, setExpandedConsult] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [generatingAI, setGeneratingAI] = useState(false);
  
  const [formData, setFormData] = useState({
    date_consultation: new Date().toISOString().split('T')[0],
    motif: '',
    examen_clinique: '',
    diagnostic: '',
    prescription: '',
    remarques: '',
    prochain_rdv: ''
  });

  // ============================================================================
  // TEMPLATES DE CONSULTATION
  // ============================================================================
  
  const templates = {
    'suivi_diabete': {
      name: 'Suivi Diabète',
      icon: '🩸',
      motif: 'Suivi diabète type 2',
      examen_clinique: `Constantes vitales:
- TA: 
- Poids: 
- IMC: 
- Examen des pieds: Normal
- Sensibilité: Conservée`,
      diagnostic: 'Diabète type 2 en cours d\'équilibration',
      prescription: `Bilan biologique à renouveler:
- HbA1c
- Glycémie à jeun
- Bilan lipidique
- Créatininémie`,
      remarques: 'Revoir dans 3 mois avec les résultats des analyses'
    },
    'controle_ta': {
      name: 'Contrôle Tension',
      icon: '💓',
      motif: 'Contrôle tension artérielle',
      examen_clinique: `Mesure tensionnelle:
- TA au repos: 
- Fréquence cardiaque: 
- Auscultation cardiaque: Normal`,
      diagnostic: 'Hypertension artérielle',
      prescription: '',
      remarques: 'Surveillance tensionnelle à domicile'
    },
    'bilan_annuel': {
      name: 'Bilan Annuel',
      icon: '📋',
      motif: 'Bilan de santé annuel',
      examen_clinique: `Examen clinique complet:
- Constantes: TA, FC, Poids, Taille
- Auscultation cardio-pulmonaire: Normal
- Examen abdominal: Normal
- Examen neurologique: Normal`,
      diagnostic: 'Bilan de santé',
      prescription: `Prescriptions:
- Bilan biologique complet
- ECG de repos`,
      remarques: 'Revoir avec les résultats des examens'
    },
    'renouvellement': {
      name: 'Renouvellement Ordonnance',
      icon: '💊',
      motif: 'Renouvellement d\'ordonnance',
      examen_clinique: 'État général stable',
      diagnostic: 'Renouvellement de traitement',
      prescription: 'Renouvellement de l\'ordonnance habituelle',
      remarques: 'Prochaine consultation dans 3 mois'
    }
  };

  // ============================================================================
  // CHARGEMENT DONNÉES
  // ============================================================================
  
  useEffect(() => {
    fetchConsultations();
  }, [patientId]);

  useEffect(() => {
    setFilteredConsultations(consultations);
  }, [consultations]);

  const fetchConsultations = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/patients/${patientId}/consultations`);
      const data = await response.json();
      setConsultations(data || []);
    } catch (error) {
      console.error('Erreur chargement consultations:', error);
      setConsultations([]);
    } finally {
      setLoading(false);
    }
  };

  // ============================================================================
  // CALCUL DES STATISTIQUES
  // ============================================================================
  
  const calculateStats = () => {
    if (consultations.length === 0) {
      return [
        { label: 'Total', value: 0, icon: '🩺' },
        { label: 'Ce mois', value: 0, icon: '📅' },
        { label: 'Fréquence', value: '-', icon: '⏱️' }
      ];
    }

    const now = new Date();
    const thisMonth = consultations.filter(c => {
      const date = new Date(c.date_consultation);
      return date.getMonth() === now.getMonth() && 
             date.getFullYear() === now.getFullYear();
    }).length;

    // Calculer fréquence moyenne
    const dates = consultations.map(c => new Date(c.date_consultation)).sort((a, b) => a - b);
    let avgDays = 0;
    if (dates.length > 1) {
      const intervals = [];
      for (let i = 1; i < dates.length; i++) {
        const diff = Math.floor((dates[i] - dates[i-1]) / (1000 * 60 * 60 * 24));
        intervals.push(diff);
      }
      avgDays = Math.floor(intervals.reduce((a, b) => a + b, 0) / intervals.length);
    }
    
    const frequence = avgDays === 0 ? 'N/A' : 
                     avgDays < 30 ? `${avgDays}j` : 
                     avgDays < 365 ? `${Math.floor(avgDays / 30)}m` : 
                     `${Math.floor(avgDays / 365)}a`;

    // Motifs les plus fréquents
    const motifCounts = {};
    consultations.forEach(c => {
      const motif = c.motif || 'Non spécifié';
      motifCounts[motif] = (motifCounts[motif] || 0) + 1;
    });
    
    const topMotif = Object.entries(motifCounts).sort((a, b) => b[1] - a[1])[0];

    return [
      { 
        label: 'Total', 
        value: consultations.length, 
        icon: '🩺',
        subtitle: 'consultations'
      },
      { 
        label: 'Ce mois', 
        value: thisMonth, 
        icon: '📅',
        trend: thisMonth > 0 ? 'stable' : 'down'
      },
      { 
        label: 'Fréquence', 
        value: frequence, 
        icon: '⏱️',
        subtitle: 'moyenne'
      },
      { 
        label: 'Motif principal', 
        value: topMotif ? topMotif[1] : 0, 
        icon: '📋',
        subtitle: topMotif ? topMotif[0].substring(0, 20) + '...' : 'N/A'
      }
    ];
  };

  // ============================================================================
  // RECHERCHE & FILTRES
  // ============================================================================
  
  const handleSearch = ({ term, filters }) => {
    let results = [...consultations];

    // Recherche par terme
    if (term) {
      const searchTerm = term.toLowerCase();
      results = results.filter(c =>
        c.motif?.toLowerCase().includes(searchTerm) ||
        c.diagnostic?.toLowerCase().includes(searchTerm) ||
        c.examen_clinique?.toLowerCase().includes(searchTerm)
      );
    }

    // Filtres par date
    if (filters.date_start) {
      results = results.filter(c => new Date(c.date_consultation) >= new Date(filters.date_start));
    }
    if (filters.date_end) {
      results = results.filter(c => new Date(c.date_consultation) <= new Date(filters.date_end));
    }

    // Filtre par type (motif)
    if (filters.type) {
      results = results.filter(c => c.motif?.toLowerCase().includes(filters.type.toLowerCase()));
    }

    setFilteredConsultations(results);
  };

  const searchFilters = [
    {
      key: 'date',
      label: 'Période',
      type: 'daterange'
    },
    {
      key: 'type',
      label: 'Type de consultation',
      type: 'select',
      options: [
        { value: 'suivi', label: 'Suivi' },
        { value: 'contrôle', label: 'Contrôle' },
        { value: 'bilan', label: 'Bilan' },
        { value: 'urgence', label: 'Urgence' }
      ]
    }
  ];

  // ============================================================================
  // GESTION DU FORMULAIRE
  // ============================================================================
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const applyTemplate = (templateKey) => {
    const template = templates[templateKey];
    if (template) {
      setFormData(prev => ({
        ...prev,
        motif: template.motif,
        examen_clinique: template.examen_clinique,
        diagnostic: template.diagnostic,
        prescription: template.prescription,
        remarques: template.remarques
      }));
      setSelectedTemplate(templateKey);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.motif) {
      alert('Veuillez remplir le motif de consultation');
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/consultations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patient_id: patientId,
          ...formData
        })
      });

      if (response.ok) {
        alert('✅ Consultation enregistrée avec succès !');
        resetForm();
        fetchConsultations();
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('❌ Erreur lors de l\'enregistrement');
    }
  };

  const resetForm = () => {
    setFormData({
      date_consultation: new Date().toISOString().split('T')[0],
      motif: '',
      examen_clinique: '',
      diagnostic: '',
      prescription: '',
      remarques: '',
      prochain_rdv: ''
    });
    setShowAddForm(false);
    setSelectedTemplate(null);
    setShowAIAssistant(false);
  };

  // ============================================================================
  // ASSISTANT IA
  // ============================================================================
  
  const generateWithAI = async (field) => {
    setGeneratingAI(true);
    
    try {
      // TODO: Intégrer avec l'API de génération IA
      // Pour l'instant, simuler une génération
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (field === 'compte_rendu') {
        const generated = `Compte-rendu de consultation du ${formatDate(formData.date_consultation)}

Motif: ${formData.motif}

Examen clinique:
${formData.examen_clinique || 'À compléter'}

Diagnostic retenu:
${formData.diagnostic || 'À compléter'}

Prescription:
${formData.prescription || 'Aucune prescription'}

Remarques:
${formData.remarques || 'RAS'}

Prochain rendez-vous: ${formData.prochain_rdv ? formatDate(formData.prochain_rdv) : 'À définir'}`;

        // Pour l'instant, juste afficher
        alert('Compte-rendu généré :\n\n' + generated);
      }
      
    } catch (error) {
      console.error('Erreur génération IA:', error);
      alert('❌ Erreur lors de la génération');
    } finally {
      setGeneratingAI(false);
    }
  };

  // ============================================================================
  // FONCTIONS UTILITAIRES
  // ============================================================================
  
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const exportToPDF = (consultation) => {
    alert('Export PDF - À implémenter avec jsPDF');
    // TODO: Intégrer jsPDF
  };

  // ============================================================================
  // RENDU
  // ============================================================================
  
  if (loading) {
    return (
      <div className="consultations-loading">
        <div className="spinner"></div>
        <p>Chargement des consultations...</p>
      </div>
    );
  }

  return (
    <div className="patient-consultations-ameliore">
      {/* Stats Widget */}
      <StatsWidget stats={calculateStats()} />

      {/* Header avec actions */}
      <div className="consultations-header">
        <div className="header-info">
          <h3>🩺 Historique des Consultations</h3>
          <p>Comptes-rendus et suivi médical de {patient.nom} {patient.prenom}</p>
        </div>
        
        <div className="header-actions">
          <button
            className="btn-add-consultation"
            onClick={() => setShowAddForm(!showAddForm)}
          >
            {showAddForm ? '❌ Annuler' : '➕ Nouvelle Consultation'}
          </button>
        </div>
      </div>

      {/* Barre de recherche */}
      <SearchBar
        placeholder="Rechercher par motif, diagnostic..."
        onSearch={handleSearch}
        filters={searchFilters}
      />

      {/* Formulaire d'ajout */}
      {showAddForm && (
        <div className="consultation-form-card">
          <div className="form-header">
            <h4>➕ Nouvelle Consultation</h4>
            
            {/* Templates */}
            <div className="templates-bar">
              <span className="templates-label">Templates:</span>
              {Object.entries(templates).map(([key, template]) => (
                <button
                  key={key}
                  className={`template-btn ${selectedTemplate === key ? 'active' : ''}`}
                  onClick={() => applyTemplate(key)}
                  title={template.name}
                >
                  {template.icon} {template.name}
                </button>
              ))}
            </div>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label>Date de consultation *</label>
                <input
                  type="date"
                  name="date_consultation"
                  value={formData.date_consultation}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Prochain RDV</label>
                <input
                  type="date"
                  name="prochain_rdv"
                  value={formData.prochain_rdv}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group full-width">
                <label>Motif de consultation *</label>
                <input
                  type="text"
                  name="motif"
                  value={formData.motif}
                  onChange={handleInputChange}
                  placeholder="Ex: Suivi diabète, Douleurs thoraciques..."
                  required
                />
              </div>

              <div className="form-group full-width">
                <div className="field-header">
                  <label>Examen clinique</label>
                  {showAIAssistant && (
                    <button
                      type="button"
                      className="btn-ai-small"
                      onClick={() => generateWithAI('examen')}
                      disabled={generatingAI}
                    >
                      🤖 Suggérer
                    </button>
                  )}
                </div>
                <textarea
                  name="examen_clinique"
                  value={formData.examen_clinique}
                  onChange={handleInputChange}
                  placeholder="Constantes vitales, examen physique..."
                  rows="4"
                />
              </div>

              <div className="form-group full-width">
                <div className="field-header">
                  <label>Diagnostic</label>
                  {showAIAssistant && (
                    <button
                      type="button"
                      className="btn-ai-small"
                      onClick={() => generateWithAI('diagnostic')}
                      disabled={generatingAI}
                    >
                      🤖 Suggérer
                    </button>
                  )}
                </div>
                <textarea
                  name="diagnostic"
                  value={formData.diagnostic}
                  onChange={handleInputChange}
                  placeholder="Diagnostic retenu..."
                  rows="3"
                />
              </div>

              <div className="form-group full-width">
                <label>Prescription</label>
                <textarea
                  name="prescription"
                  value={formData.prescription}
                  onChange={handleInputChange}
                  placeholder="Médicaments prescrits, examens complémentaires..."
                  rows="4"
                />
              </div>

              <div className="form-group full-width">
                <label>Remarques</label>
                <textarea
                  name="remarques"
                  value={formData.remarques}
                  onChange={handleInputChange}
                  placeholder="Observations complémentaires..."
                  rows="3"
                />
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn-ai-assistant"
                onClick={() => setShowAIAssistant(!showAIAssistant)}
              >
                {showAIAssistant ? '❌ Fermer' : '🤖 Assistant IA'}
              </button>
              
              {showAIAssistant && (
                <button
                  type="button"
                  className="btn-generate-cr"
                  onClick={() => generateWithAI('compte_rendu')}
                  disabled={generatingAI}
                >
                  {generatingAI ? '⏳ Génération...' : '📝 Générer compte-rendu'}
                </button>
              )}
              
              <div style={{ flex: 1 }}></div>
              
              <button type="button" onClick={resetForm} className="btn-cancel">
                Annuler
              </button>
              <button type="submit" className="btn-submit">
                ✅ Enregistrer
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Liste des consultations */}
      {filteredConsultations.length === 0 ? (
        <div className="empty-consultations">
          <span className="empty-icon">🩺</span>
          <h4>
            {consultations.length === 0 
              ? 'Aucune consultation enregistrée' 
              : 'Aucun résultat'}
          </h4>
          <p>
            {consultations.length === 0
              ? 'Ajoutez la première consultation pour ce patient'
              : 'Essayez de modifier vos critères de recherche'}
          </p>
        </div>
      ) : (
        <div className="consultations-timeline">
          {filteredConsultations.map((consult) => (
            <div
              key={consult.id}
              className={`consultation-card ${expandedConsult === consult.id ? 'expanded' : ''}`}
            >
              {/* Header */}
              <div
                className="consultation-header"
                onClick={() => setExpandedConsult(
                  expandedConsult === consult.id ? null : consult.id
                )}
              >
                <div className="consult-date-badge">
                  <span className="date-icon">📅</span>
                  <span className="date-text">{formatDate(consult.date_consultation)}</span>
                </div>

                <div className="consult-info">
                  <h4>{consult.motif}</h4>
                  {consult.diagnostic && (
                    <span className="diagnostic-preview">
                      📋 {consult.diagnostic.substring(0, 60)}
                      {consult.diagnostic.length > 60 ? '...' : ''}
                    </span>
                  )}
                </div>

                <button className="expand-btn">
                  {expandedConsult === consult.id ? '▼' : '▶'}
                </button>
              </div>

              {/* Expanded Content */}
              {expandedConsult === consult.id && (
                <div className="consultation-content">
                  {consult.examen_clinique && (
                    <div className="content-section">
                      <h5>🔍 Examen Clinique</h5>
                      <div className="section-text">{consult.examen_clinique}</div>
                    </div>
                  )}

                  {consult.diagnostic && (
                    <div className="content-section diagnostic">
                      <h5>📋 Diagnostic</h5>
                      <div className="section-text">{consult.diagnostic}</div>
                    </div>
                  )}

                  {consult.prescription && (
                    <div className="content-section prescription">
                      <h5>💊 Prescription</h5>
                      <div className="section-text">{consult.prescription}</div>
                    </div>
                  )}

                  {consult.remarques && (
                    <div className="content-section">
                      <h5>📝 Remarques</h5>
                      <div className="section-text">{consult.remarques}</div>
                    </div>
                  )}

                  {consult.prochain_rdv && (
                    <div className="next-appointment">
                      <span className="appointment-icon">📆</span>
                      <span>Prochain RDV : {formatDate(consult.prochain_rdv)}</span>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="consultation-actions">
                    <button 
                      className="action-btn"
                      onClick={() => exportToPDF(consult)}
                    >
                      📄 Exporter PDF
                    </button>
                    <button className="action-btn">
                      🖨️ Imprimer
                    </button>
                    <button className="action-btn">
                      📧 Envoyer au patient
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PatientConsultationsAmeliore;