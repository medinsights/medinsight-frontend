// frontend/src/pages/PatientsList.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AddPatient from '../components/patient/AddPatient';
import './PatientsList.css';

const PatientsList = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPathology, setFilterPathology] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false); // toggle affichage formulaire

  useEffect(() => {
    fetchPatients();
  }, []);

  useEffect(() => {
    filterAndSortPatients();
  }, [searchTerm, filterPathology, sortBy, patients]);

  // Récupération des patients depuis l'API
  const fetchPatients = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/patients');
      const data = await response.json();
      setPatients(data || []);
    } catch (error) {
      console.error('Erreur chargement patients:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour ajouter un patient depuis le formulaire
  const handleAddPatient = (newPatient) => {
    setPatients(prev => [newPatient, ...prev]);
    setShowForm(false); // cacher le formulaire après ajout
  };

  const filterAndSortPatients = () => {
    let filtered = [...patients];

    // Filtre recherche
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(patient =>
        patient.nom?.toLowerCase().includes(searchLower) ||
        patient.prenom?.toLowerCase().includes(searchLower) ||
        patient.pathologies_principales?.toLowerCase().includes(searchLower) ||
        patient.telephone?.includes(searchTerm)
      );
    }

    // Filtre pathologie
    if (filterPathology !== 'all') {
      filtered = filtered.filter(patient =>
        patient.pathologies_principales?.toLowerCase().includes(filterPathology.toLowerCase())
      );
    }

    // Tri
    if (sortBy === 'recent') {
      filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    } else if (sortBy === 'name') {
      filtered.sort((a, b) => (a.nom || '').localeCompare(b.nom || ''));
    } else if (sortBy === 'age') {
      filtered.sort((a, b) => (a.date_naissance || '').localeCompare(b.date_naissance || ''));
    }

    setFilteredPatients(filtered);
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

  const allPathologies = [...new Set(
    patients
      .filter(p => p.pathologies_principales)
      .flatMap(p => p.pathologies_principales.split(',').map(path => path.trim()))
  )];

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="patients-list-page">
      {/* Header */}
      <div className="page-header">
        <div className="header-content">
          <div>
            <h1>👥 Mes Patients</h1>
            <p>{patients.length} patient{patients.length > 1 ? 's' : ''} suivi{patients.length > 1 ? 's' : ''}</p>
          </div>
          <button
            className="btn-new-patient"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? '❌ Annuler' : '➕ Nouveau Patient'}
          </button>
        </div>
      </div>

      {/* Formulaire Nouveau Patient */}
      {showForm && (
        <AddPatient onAddPatient={handleAddPatient} />
      )}

      {/* Filters Bar */}
      <div className="filters-section">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Rechercher par nom, prénom, pathologie, téléphone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button className="clear-search" onClick={() => setSearchTerm('')}>
              ❌
            </button>
          )}
        </div>

        <div className="filters-row">
          <div className="filter-group">
            <label>🏥 Pathologie :</label>
            <select value={filterPathology} onChange={(e) => setFilterPathology(e.target.value)}>
              <option value="all">Toutes</option>
              {allPathologies.map(path => (
                <option key={path} value={path}>{path}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>📊 Trier par :</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="recent">Plus récent</option>
              <option value="name">Nom (A-Z)</option>
              <option value="age">Âge</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="results-info">
        <span className="results-count">
          📋 {filteredPatients.length} patient{filteredPatients.length > 1 ? 's' : ''} affiché{filteredPatients.length > 1 ? 's' : ''}
        </span>
        {(searchTerm || filterPathology !== 'all') && (
          <button className="btn-reset-filters" onClick={() => {
            setSearchTerm('');
            setFilterPathology('all');
          }}>
            Réinitialiser les filtres
          </button>
        )}
      </div>

      {/* Patients Grid */}
      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Chargement des patients...</p>
        </div>
      ) : filteredPatients.length === 0 ? (
        <div className="empty-state">
          {searchTerm || filterPathology !== 'all' ? (
            <>
              <span className="empty-icon">🔍</span>
              <h3>Aucun patient trouvé</h3>
              <p>Essayez de modifier vos critères de recherche</p>
            </>
          ) : (
            <>
              <span className="empty-icon">📋</span>
              <h3>Aucun patient enregistré</h3>
              <p>Cliquez sur "Nouveau Patient" pour commencer</p>
            </>
          )}
        </div>
      ) : (
        <div className="patients-grid">
          {filteredPatients.map(patient => (
            <div
              key={patient.id}
              className="patient-card"
              onClick={() => navigate(`/patients/${patient.id}`)}
            >
              {/* Header */}
              <div className="card-header">
                <div className="patient-avatar">
                  {patient.sexe === 'M' ? '👨' : patient.sexe === 'F' ? '👩' : '👤'}
                </div>
                <div className="patient-main-info">
                  <div className="patient-name">{patient.nom} {patient.prenom}</div>
                  <div className="patient-id">#{patient.id.toString().padStart(3, '0')}</div>
                </div>
                <div className="patient-age-badge">{calculateAge(patient.date_naissance)} ans</div>
              </div>

              {/* Info */}
              <div className="card-info">
                {patient.date_naissance && (
                  <div className="info-row">
                    <span className="info-icon">🎂</span>
                    <span>{formatDate(patient.date_naissance)}</span>
                  </div>
                )}
                {patient.telephone && (
                  <div className="info-row">
                    <span className="info-icon">📞</span>
                    <span>{patient.telephone}</span>
                  </div>
                )}
                {patient.email && (
                  <div className="info-row">
                    <span className="info-icon">📧</span>
                    <span className="info-email">{patient.email}</span>
                  </div>
                )}
              </div>

              {/* Pathologies */}
              {patient.pathologies_principales && (
                <div className="pathologies-section">
                  <div className="pathologies-label">🏥 Pathologies</div>
                  <div className="pathologies-tags">
                    {patient.pathologies_principales.split(',').slice(0, 2).map((path, idx) => (
                      <span key={idx} className="pathology-tag">{path.trim()}</span>
                    ))}
                    {patient.pathologies_principales.split(',').length > 2 && (
                      <span className="pathology-tag more">
                        +{patient.pathologies_principales.split(',').length - 2}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Allergies */}
              {patient.allergies && patient.allergies !== 'Aucune allergie connue' && (
                <div className="allergies-section">
                  <span className="alert-icon">⚠️</span>
                  <span className="allergies-text">Allergies: {patient.allergies}</span>
                </div>
              )}

              {/* Footer */}
              <div className="card-footer">
                <span className="footer-date">📅 Créé le {formatDate(patient.created_at)}</span>
                <button className="btn-view-dossier">📋 Voir dossier →</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PatientsList;
