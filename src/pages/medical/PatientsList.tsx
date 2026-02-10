/**
 * Patients List Page
 * Displays all patients with search, filter, and sort capabilities
 * Migrated from Chatbot-Medical-Copie with Kong Gateway integration
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PatientService, type Patient } from '../../services/patient.service';
import './PatientsList.css';

const PatientsList: React.FC = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPathology, setFilterPathology] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchPatients();
  }, []);

  useEffect(() => {
    filterAndSortPatients();
  }, [searchTerm, filterPathology, sortBy, patients]);

  const fetchPatients = async () => {
    try {
      const data = await PatientService.getAll();
      setPatients(data || []);
    } catch (error) {
      console.error('Erreur chargement patients:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPatient = async (newPatient: Patient) => {
    try {
      const created = await PatientService.create(newPatient);
      setPatients(prev => [created, ...prev]);
      setShowForm(false);
    } catch (error) {
      console.error('Erreur ajout patient:', error);
      alert('Erreur lors de l\'ajout du patient');
    }
  };

  const filterAndSortPatients = () => {
    let filtered = [...patients];

    // Filtre recherche
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(patient =>
        patient.lastName?.toLowerCase().includes(searchLower) ||
        patient.firstName?.toLowerCase().includes(searchLower) ||
        patient.chronicDiseases?.some(d => d.toLowerCase().includes(searchLower)) ||
        patient.phone?.includes(searchTerm)
      );
    }

    // Filtre pathologie
    if (filterPathology !== 'all') {
      filtered = filtered.filter(patient =>
        patient.chronicDiseases?.some(d => 
          d.toLowerCase().includes(filterPathology.toLowerCase())
        )
      );
    }

    // Tri
    if (sortBy === 'recent') {
      filtered.sort((a, b) => 
        new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime()
      );
    } else if (sortBy === 'name') {
      filtered.sort((a, b) => (a.lastName || '').localeCompare(b.lastName || ''));
    } else if (sortBy === 'age') {
      filtered.sort((a, b) => (a.dateOfBirth || '').localeCompare(b.dateOfBirth || ''));
    }

    setFilteredPatients(filtered);
  };

  const calculateAge = (dateOfBirth?: string): number | string => {
    if (!dateOfBirth) return '?';
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const allPathologies = [...new Set(
    patients
      .filter(p => p.chronicDiseases && p.chronicDiseases.length > 0)
      .flatMap(p => p.chronicDiseases || [])
  )];

  const formatDate = (dateStr?: string): string => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="patients-list-page">
        <div className="loading">⏳ Chargement des patients...</div>
      </div>
    );
  }

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

      {/* Add Patient Form */}
      {showForm && (
        <AddPatientForm onAdd={handleAddPatient} />
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
              <option value="name">Nom</option>
              <option value="age">Âge</option>
            </select>
          </div>

          <div className="results-count">
            {filteredPatients.length} résultat{filteredPatients.length > 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {/* Patients Cards */}
      <div className="patients-grid">
        {filteredPatients.length === 0 ? (
          <div className="no-results">
            <p>😕 Aucun patient trouvé</p>
            {searchTerm && <button onClick={() => setSearchTerm('')}>Réinitialiser la recherche</button>}
          </div>
        ) : (
          filteredPatients.map((patient) => (
            <div
              key={patient.id}
              className="patient-card"
              onClick={() => navigate(`/patients/${patient.id}`)}
            >
              <div className="patient-header">
                <div className="patient-avatar">
                  {patient.gender === 'M' ? '👨‍⚕️' : '👩‍⚕️'}
                </div>
                <div className="patient-name">
                  <h3>{patient.lastName} {patient.firstName}</h3>
                  <p className="patient-age">{calculateAge(patient.dateOfBirth)} ans</p>
                </div>
              </div>

              <div className="patient-info">
                <div className="info-row">
                  <span className="info-label">📅 Date naissance :</span>
                  <span>{formatDate(patient.dateOfBirth)}</span>
                </div>

                <div className="info-row">
                  <span className="info-label">🩸 Groupe sanguin :</span>
                  <span>{patient.bloodType || 'Non renseigné'}</span>
                </div>

                <div className="info-row">
                  <span className="info-label">📞 Téléphone :</span>
                  <span>{patient.phone || 'Non renseigné'}</span>
                </div>

                {patient.chronicDiseases && patient.chronicDiseases.length > 0 && (
                  <div className="pathologies-tags">
                    {patient.chronicDiseases.map((path, idx) => (
                      <span key={idx} className="pathology-tag">
                        {path}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="card-footer">
                <span className="last-update">
                  Dernière mise à jour : {formatDate(patient.updatedAt || patient.createdAt)}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// Add Patient Form Component
interface AddPatientFormProps {
  onAdd: (patient: Patient) => void;
}

const AddPatientForm: React.FC<AddPatientFormProps> = ({ onAdd }) => {
  const [formData, setFormData] = useState<Partial<Patient>>({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: 'M',
    bloodType: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    postalCode: '',
    emergencyContact: '',
    emergencyPhone: '',
    allergies: [],
    chronicDiseases: [],
    currentMedications: [],
    insuranceNumber: '',
    socialSecurityNumber: '',
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.dateOfBirth) {
      alert('Veuillez remplir les champs obligatoires');
      return;
    }
    onAdd(formData as Patient);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="add-patient-form">
      <h2>➕ Nouveau Patient</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label>Nom *</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Prénom *</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Date de naissance *</label>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Sexe</label>
            <select name="gender" value={formData.gender} onChange={handleChange}>
              <option value="M">Homme</option>
              <option value="F">Femme</option>
            </select>
          </div>

          <div className="form-group">
            <label>Groupe sanguin</label>
            <input
              type="text"
              name="bloodType"
              value={formData.bloodType}
              onChange={handleChange}
              placeholder="ex: O+"
            />
          </div>

          <div className="form-group">
            <label>Téléphone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="ex: 06 12 34 56 78"
            />
          </div>

          <div className="form-group full-width">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="email@exemple.fr"
            />
          </div>

          <div className="form-group full-width">
            <label>Adresse</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Ville</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Code postal</label>
            <input
              type="text"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-submit">
            ✅ Créer le patient
          </button>
        </div>
      </form>
    </div>
  );
};

export default PatientsList;
