/**
 * Patient Service
 * Handles all patient-related API calls
 */

import ApiService from './api.service';
import { API_ENDPOINTS } from '../config/api.config';

export interface Patient {
  id?: number;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  bloodType?: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  allergies?: string[];
  chronicDiseases?: string[];
  currentMedications?: string[];
  insuranceNumber?: string;
  socialSecurityNumber?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
  
  // French aliases for compatibility with Chatbot-Copie data
  nom?: string;
  prenom?: string;
  date_naissance?: string;
  sexe?: string;
  telephone?: string;
  adresse?: string;
  pathologies_principales?: string;
  antecedents_familiaux?: string;
  medecin_traitant?: string;
}

export interface VitalSigns {
  id?: number;
  patientId: number;
  date: string;
  systolicBP?: number;
  diastolicBP?: number;
  heartRate?: number;
  temperature?: number;
  weight?: number;
  height?: number;
  bmi?: number;
  oxygenSaturation?: number;
  respiratoryRate?: number;
  glucose?: number;
  notes?: string;
  createdAt?: string;
  
  // French aliases
  tension_systolique?: number;
  tension_diastolique?: number;
  frequence_cardiaque?: number;
  poids?: number;
  taille?: number;
  saturation_oxygene?: number;
}

export interface Treatment {
  id?: number;
  patientId: number;
  medication: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate?: string;
  reason: string;
  prescribedBy?: string;
  status?: 'active' | 'completed' | 'discontinued';
  notes?: string;
  createdAt?: string;
  
  // French aliases
  medicament?: string;
  frequence?: string;
  date_debut?: string;
  date_fin?: string;
  indication?: string;
  statut?: string;
  voie_administration?: string;
}

export interface Consultation {
  id?: number;
  patientId: number;
  date: string;
  reason: string;
  symptoms?: string;
  diagnosis?: string;
  treatment?: string;
  notes?: string;
  doctorName?: string;
  followUpDate?: string;
  createdAt?: string;
  
  // French aliases
  date_consultation: string;
  motif?: string;
  examen_clinique?: string;
  diagnostic?: string;
  prescription?: string;
  remarques?: string;
  prochain_rdv?: string;
}

export interface MedicalAnalysis {
  id?: number;
  patientId: number;
  analysisType: string;
  date: string;
  results?: any;
  interpretation?: string;
  notes?: string;
  laboratoryName?: string;
  createdAt?: string;
  
  // French aliases
  type_analyse?: string;
  date_analyse: string;
  resultats?: any;
  alertes?: any;
}

export class PatientService {
  /**
   * Get all patients
   */
  static async getAll(): Promise<Patient[]> {
    return ApiService.get<Patient[]>(API_ENDPOINTS.patients.list);
  }

  /**
   * Get patient by ID
   */
  static async getById(id: string | number): Promise<Patient> {
    return ApiService.get<Patient>(API_ENDPOINTS.patients.get(id));
  }

  /**
   * Create new patient
   */
  static async create(patient: Patient): Promise<Patient> {
    return ApiService.post<Patient>(API_ENDPOINTS.patients.create, patient);
  }

  /**
   * Update patient
   */
  static async update(id: string | number, patient: Partial<Patient>): Promise<Patient> {
    return ApiService.put<Patient>(API_ENDPOINTS.patients.update(id), patient);
  }

  /**
   * Delete patient
   */
  static async delete(id: string | number): Promise<void> {
    return ApiService.delete(API_ENDPOINTS.patients.delete(id));
  }

  /**
   * Search patients
   */
  static async search(query: string): Promise<Patient[]> {
    return ApiService.get<Patient[]>(`${API_ENDPOINTS.patients.search}?q=${query}`);
  }

  // ============================================================================
  // VITAL SIGNS (CONSTANTES VITALES)
  // ============================================================================

  /**
   * Get all vital signs for a patient
   */
  static async getVitalSigns(patientId: string | number): Promise<VitalSigns[]> {
    return ApiService.get<VitalSigns[]>(API_ENDPOINTS.vitalSigns.list(patientId));
  }

  /**
   * Create vital signs
   */
  static async createVitalSigns(patientId: string | number, vitalSigns: VitalSigns): Promise<VitalSigns> {
    return ApiService.post<VitalSigns>(API_ENDPOINTS.vitalSigns.create(patientId), vitalSigns);
  }

  /**
   * Get latest vital signs
   */
  static async getLatestVitalSigns(patientId: string | number): Promise<VitalSigns> {
    return ApiService.get<VitalSigns>(API_ENDPOINTS.vitalSigns.latest(patientId));
  }

  /**
   * Delete vital signs
   */
  static async deleteVitalSigns(id: string | number): Promise<void> {
    return ApiService.delete(API_ENDPOINTS.vitalSigns.delete(id));
  }

  // ============================================================================
  // TREATMENTS (TRAITEMENTS)
  // ============================================================================

  /**
   * Get all treatments for a patient
   */
  static async getTreatments(patientId: string | number): Promise<Treatment[]> {
    return ApiService.get<Treatment[]>(API_ENDPOINTS.treatments.list(patientId));
  }

  /**
   * Get active treatments
   */
  static async getActiveTreatments(patientId: string | number): Promise<Treatment[]> {
    return ApiService.get<Treatment[]>(API_ENDPOINTS.treatments.active(patientId));
  }

  /**
   * Create treatment
   */
  static async createTreatment(patientId: string | number, treatment: Treatment): Promise<Treatment> {
    return ApiService.post<Treatment>(API_ENDPOINTS.treatments.create(patientId), treatment);
  }

  /**
   * Update treatment
   */
  static async updateTreatment(id: string | number, treatment: Partial<Treatment>): Promise<Treatment> {
    return ApiService.put<Treatment>(API_ENDPOINTS.treatments.update(id), treatment);
  }

  /**
   * Delete treatment
   */
  static async deleteTreatment(id: string | number): Promise<void> {
    return ApiService.delete(API_ENDPOINTS.treatments.delete(id));
  }

  // ============================================================================
  // CONSULTATIONS
  // ============================================================================

  /**
   * Get all consultations for a patient
   */
  static async getConsultations(patientId: string | number): Promise<Consultation[]> {
    return ApiService.get<Consultation[]>(API_ENDPOINTS.consultations.list(patientId));
  }

  /**
   * Get latest consultation
   */
  static async getLatestConsultation(patientId: string | number): Promise<Consultation> {
    return ApiService.get<Consultation>(API_ENDPOINTS.consultations.latest(patientId));
  }

  /**
   * Create consultation
   */
  static async createConsultation(patientId: string | number, consultation: Consultation): Promise<Consultation> {
    return ApiService.post<Consultation>(API_ENDPOINTS.consultations.create(patientId), consultation);
  }

  /**
   * Update consultation
   */
  static async updateConsultation(id: string | number, consultation: Partial<Consultation>): Promise<Consultation> {
    return ApiService.put<Consultation>(API_ENDPOINTS.consultations.update(id), consultation);
  }

  /**
   * Delete consultation
   */
  static async deleteConsultation(id: string | number): Promise<void> {
    return ApiService.delete(API_ENDPOINTS.consultations.delete(id));
  }

  // ============================================================================
  // MEDICAL ANALYSES
  // ============================================================================

  /**
   * Get all medical analyses for a patient
   */
  static async getMedicalAnalyses(patientId: string | number): Promise<MedicalAnalysis[]> {
    return ApiService.get<MedicalAnalysis[]>(API_ENDPOINTS.medicalAnalyses.list(patientId));
  }

  /**
   * Create medical analysis
   */
  static async createMedicalAnalysis(patientId: string | number, analysis: MedicalAnalysis): Promise<MedicalAnalysis> {
    return ApiService.post<MedicalAnalysis>(API_ENDPOINTS.medicalAnalyses.create(patientId), analysis);
  }

  /**
   * Update medical analysis
   */
  static async updateMedicalAnalysis(id: string | number, analysis: Partial<MedicalAnalysis>): Promise<MedicalAnalysis> {
    return ApiService.put<MedicalAnalysis>(API_ENDPOINTS.medicalAnalyses.update(id), analysis);
  }

  /**
   * Delete medical analysis
   */
  static async deleteMedicalAnalysis(id: string | number): Promise<void> {
    return ApiService.delete(API_ENDPOINTS.medicalAnalyses.delete(id));
  }
}

export default PatientService;
