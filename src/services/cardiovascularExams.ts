/**
 * Cardiovascular Exams Service
 * Handles all cardiovascular exam-related API calls to Spring Boot service via Kong Gateway
 */
import axiosInstance from './axios';
import { API_ENDPOINTS } from '../config/api';

/**
 * Cardiovascular Exam entity matching Java model from patient-service
 */
export interface CardiovascularExam {
  id?: string;
  patientId: string;
  examDate: string; // ISO datetime
  examType?: string; // e.g., "ECG", "Echocardiogram", "Stress Test", "Holter Monitor"
  heartRate?: number; // bpm
  systolicBP?: number; // mmHg
  diastolicBP?: number; // mmHg
  ecgFindings?: string;
  echoFindings?: string;
  ejectionFraction?: number; // percentage
  valvularAbnormalities?: string;
  chamberSizes?: string;
  wallMotionAbnormalities?: string;
  coronaryArteryStatus?: string;
  arrhythmias?: string;
  riskFactors?: string; // e.g., "smoking, diabetes, hypertension"
  interpretation?: string;
  recommendations?: string;
  performedBy?: string; // Cardiologist name
  notes?: string;
  fileUrl?: string; // URL to exam file (PDF/DICOM)
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
}

/**
 * Cardiovascular Exam Create Request DTO
 */
export interface CardiovascularExamCreateRequest {
  patientId: string;
  examDate: string;
  examType?: string;
  heartRate?: number;
  systolicBP?: number;
  diastolicBP?: number;
  ecgFindings?: string;
  echoFindings?: string;
  ejectionFraction?: number;
  valvularAbnormalities?: string;
  chamberSizes?: string;
  wallMotionAbnormalities?: string;
  coronaryArteryStatus?: string;
  arrhythmias?: string;
  riskFactors?: string;
  interpretation?: string;
  recommendations?: string;
  performedBy?: string;
  notes?: string;
  fileUrl?: string;
}

/**
 * Cardiovascular Exam Update Request DTO
 */
export interface CardiovascularExamUpdateRequest extends Partial<Omit<CardiovascularExamCreateRequest, 'patientId'>> {}

/**
 * List all cardiovascular exams
 */
export const listCardiovascularExams = async (): Promise<CardiovascularExam[]> => {
  const response = await axiosInstance.get<CardiovascularExam[]>(API_ENDPOINTS.CARDIOVASCULAR_EXAMS);
  return response.data;
};

/**
 * Get cardiovascular exams by patient ID
 * @param patientId Patient UUID
 */
export const getCardiovascularExamsByPatient = async (patientId: string): Promise<CardiovascularExam[]> => {
  const response = await axiosInstance.get<CardiovascularExam[]>(API_ENDPOINTS.CARDIOVASCULAR_EXAMS_PATIENT(patientId));
  return response.data;
};

/**
 * Get a specific cardiovascular exam by ID
 * @param id Cardiovascular Exam UUID
 */
export const getCardiovascularExam = async (id: string): Promise<CardiovascularExam> => {
  const response = await axiosInstance.get<CardiovascularExam>(`${API_ENDPOINTS.CARDIOVASCULAR_EXAMS}/${id}`);
  return response.data;
};

/**
 * Create new cardiovascular exam
 * @param data Cardiovascular exam creation data
 */
export const createCardiovascularExam = async (data: CardiovascularExamCreateRequest): Promise<CardiovascularExam> => {
  const response = await axiosInstance.post<CardiovascularExam>(API_ENDPOINTS.CARDIOVASCULAR_EXAMS, data);
  return response.data;
};

/**
 * Update existing cardiovascular exam
 * @param id Cardiovascular Exam UUID
 * @param data Updated cardiovascular exam data
 */
export const updateCardiovascularExam = async (id: string, data: CardiovascularExamUpdateRequest): Promise<CardiovascularExam> => {
  const response = await axiosInstance.put<CardiovascularExam>(`${API_ENDPOINTS.CARDIOVASCULAR_EXAMS}/${id}`, data);
  return response.data;
};

/**
 * Delete a cardiovascular exam
 * @param id Cardiovascular Exam UUID
 */
export const deleteCardiovascularExam = async (id: string): Promise<void> => {
  await axiosInstance.delete(`${API_ENDPOINTS.CARDIOVASCULAR_EXAMS}/${id}`);
};

/**
 * Get latest cardiovascular exam for a patient
 * @param patientId Patient UUID
 */
export const getLatestCardiovascularExam = async (patientId: string): Promise<CardiovascularExam | null> => {
  const exams = await getCardiovascularExamsByPatient(patientId);
  if (exams.length === 0) return null;
  
  // Sort by exam date descending and return the most recent
  return exams.sort((a, b) => 
    new Date(b.examDate).getTime() - new Date(a.examDate).getTime()
  )[0];
};

/**
 * Get cardiovascular exams by type
 * @param patientId Patient UUID
 * @param examType Type of exam (e.g., "ECG", "Echocardiogram")
 */
export const getExamsByType = async (patientId: string, examType: string): Promise<CardiovascularExam[]> => {
  const exams = await getCardiovascularExamsByPatient(patientId);
  return exams.filter(e => e.examType?.toLowerCase() === examType.toLowerCase());
};

/**
 * Get cardiovascular exam history with trend analysis
 * @param patientId Patient UUID
 * @param limit Maximum number of exams to return
 */
export const getExamHistory = async (patientId: string, limit: number = 10): Promise<CardiovascularExam[]> => {
  const exams = await getCardiovascularExamsByPatient(patientId);
  return exams
    .sort((a, b) => new Date(b.examDate).getTime() - new Date(a.examDate).getTime())
    .slice(0, limit);
};
