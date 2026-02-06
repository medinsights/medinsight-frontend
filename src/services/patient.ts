/**
 * Patient Service
 * Comprehensive patient data management through Kong Gateway
 */
import axiosInstance from './axios';
import { API_ENDPOINTS } from '../config/api';

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

export interface Patient {
  id: string;
  nom: string;
  prenom: string;
  dateNaissance: string;
  sexe: 'M' | 'F';
  numeroSecuriteSociale?: string;
  email?: string;
  telephone?: string;
  adresse?: string;
  groupeSanguin?: string;
  allergie?: string;
  pathologiesPrincipales?: string;
  antecedentsMedicaux?: string;
  medecinTraitant?: string;
  contactUrgence?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface VitalSigns {
  id?: string;
  patientId?: string;
  recordedAt: string;
  bloodPressureSystolic?: number;
  bloodPressureDiastolic?: number;
  heartRate?: number;
  temperature?: number;
  respiratoryRate?: number;
  oxygenSaturation?: number;
  weight?: number;
  height?: number;
  bmi?: number;
  glucoseLevel?: number;
  notes?: string;
  createdAt?: string;
}

export interface Consultation {
  id?: string;
  patientId?: string;
  consultationDate: string;
  reasonForVisit: string;
  symptoms?: string;
  physicalExamination?: string;
  diagnosis?: string;
  treatment?: string;
  prescriptions?: string;
  notes?: string;
  vitalSigns?: string;
  followUpInstructions?: string;
  nextAppointment?: string;
  status: string;
  createdAt?: string;
  createdBy?: string;
}

export interface Treatment {
  id?: string;
  patientId?: string;
  medicationName: string;
  dosage: string;
  frequency?: string;
  routeOfAdministration?: string;
  startDate: string;
  endDate?: string;
  durationDays?: number;
  status: 'ACTIVE' | 'COMPLETED' | 'DISCONTINUED' | 'PAUSED';
  indication?: string;
  sideEffects?: string;
  prescriberName?: string;
  notes?: string;
  createdAt?: string;
}

export interface MedicalAnalysis {
  id?: string;
  patientId?: string;
  analysisType: string;
  testName: string;
  testDate: string;
  results: any;
  normalRange?: string;
  isAbnormal: boolean;
  interpretation?: string;
  performedBy?: string;
  labName?: string;
  notes?: string;
  createdAt?: string;
}

export interface CardiovascularExam {
  id?: string;
  patientId?: string;
  examDate: string;
  examType: string;
  heartRate?: number;
  bloodPressureSystolic?: number;
  bloodPressureDiastolic?: number;
  rhythm?: string;
  findings?: string;
  isAbnormal: boolean;
  interpretation?: string;
  performedBy?: string;
  notes?: string;
  createdAt?: string;
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================
// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

export const calculateAge = (dateNaissance: string): number => {
  if (!dateNaissance) return 0;
  const today = new Date();
  const birthDate = new Date(dateNaissance);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};
// =============================================================================
// API FUNCTIONS
// =============================================================================

export const getPatientById = async (patientId: string): Promise<Patient> => {
  const response = await axiosInstance.get<Patient>(API_ENDPOINTS.PATIENT_BY_ID(patientId));
  return response.data;
};

export const getPatientAnalyses = async (patientId: string): Promise<MedicalAnalysis[]> => {
  const response = await axiosInstance.get<MedicalAnalysis[]>(API_ENDPOINTS.PATIENT_ANALYSES(patientId));
  return response.data;
};

export const getPatientTreatments = async (patientId: string): Promise<Treatment[]> => {
  const response = await axiosInstance.get<Treatment[]>(API_ENDPOINTS.PATIENT_TREATMENTS(patientId));
  return response.data;
};

export const getPatientConsultations = async (patientId: string): Promise<Consultation[]> => {
  const response = await axiosInstance.get<Consultation[]>(API_ENDPOINTS.PATIENT_CONSULTATIONS(patientId));
  return response.data;
};

export const getPatientVitalSigns = async (patientId: string): Promise<VitalSigns[]> => {
  const response = await axiosInstance.get<VitalSigns[]>(API_ENDPOINTS.PATIENT_VITAL_SIGNS(patientId));
  return response.data;
};

export const getPatientCardiovascularExams = async (patientId: string): Promise<CardiovascularExam[]> => {
  const response = await axiosInstance.get<CardiovascularExam[]>(API_ENDPOINTS.PATIENT_CARDIOVASCULAR(patientId));
  return response.data;
};

// Alias functions for consistency with naming conventions
export const getMedicalAnalysesByPatient = getPatientAnalyses;
export const getTreatmentsByPatient = getPatientTreatments;
export const getConsultationsByPatient = getPatientConsultations;
export const getVitalSignsByPatient = getPatientVitalSigns;
export const getCardiovascularExamsByPatient = getPatientCardiovascularExams;

/**
 * Get AI recommendations for a patient
 */
export const getPatientRecommendations = async (patientId: string) => {
  const response = await axiosInstance.get(API_ENDPOINTS.CHATBOT_RECOMMENDATIONS(patientId));
  return response.data;
};

/**
 * Build patient context for AI chat
 * Loads all patient data for context-aware conversations
 */
export const buildPatientContext = async (patientId: string) => {
  try {
    const [patient, analyses, treatments, consultations, vitalSigns] = await Promise.all([
      getPatientById(patientId),
      getPatientAnalyses(patientId).catch(() => []),
      getPatientTreatments(patientId).catch(() => []),
      getPatientConsultations(patientId).catch(() => []),
      getPatientVitalSigns(patientId).catch(() => [])
    ]);

    // Build context string for AI
    let context = `CONTEXTE PATIENT - ${patient.prenom} ${patient.nom}\n\n`;
    
    context += `📋 INFORMATIONS GÉNÉRALES:\n`;
    context += `- Âge: ${calculateAge(patient.dateNaissance)} ans\n`;
    context += `- Sexe: ${patient.sexe === 'M' ? 'Masculin' : 'Féminin'}\n`;
    if (patient.groupeSanguin) {
      context += `- Groupe sanguin: ${patient.groupeSanguin}\n`;
    }
    if (patient.pathologiesPrincipales) {
      context += `- Pathologies: ${patient.pathologiesPrincipales}\n`;
    }
    if (patient.allergie) {
      context += `- Allergies: ${patient.allergie}\n`;
    }
    context += `\n`;

    // Add recent vital signs
    if (vitalSigns && vitalSigns.length > 0) {
      context += `🩺 CONSTANTES RÉCENTES:\n`;
      const recent = vitalSigns[0];
      if (recent.bloodPressureSystolic) context += `- Tension: ${recent.bloodPressureSystolic}/${recent.bloodPressureDiastolic}\n`;
      if (recent.heartRate) context += `- FC: ${recent.heartRate} bpm\n`;
      if (recent.temperature) context += `- Température: ${recent.temperature}°C\n`;
      if (recent.oxygenSaturation) context += `- SpO2: ${recent.oxygenSaturation}%\n`;
      context += `\n`;
    }

    // Add active treatments
    if (treatments && treatments.length > 0) {
      context += `💊 TRAITEMENTS EN COURS:\n`;
      treatments.slice(0, 5).forEach((t: Treatment) => {
        context += `- ${t.medicationName}: ${t.dosage}\n`;
      });
      context += `\n`;
    }

    // Add recent analyses
    if (analyses && analyses.length > 0) {
      context += `🔬 ANALYSES RÉCENTES:\n`;
      analyses.slice(0, 3).forEach((a: MedicalAnalysis) => {
        context += `- ${a.analysisType} (${new Date(a.testDate).toLocaleDateString('fr-FR')})\n`;
        if (a.isAbnormal) context += `  ⚠️ Résultat anormal\n`;
      });
      context += `\n`;
    }

    return {
      patient,
      context,
      analyses,
      treatments,
      consultations,
      vitalSigns
    };
  } catch (error) {
    console.error('Error building patient context:', error);
    throw error;
  }
};
