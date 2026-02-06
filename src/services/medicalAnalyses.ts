/**
 * Medical Analyses Service
 * Handles all medical analysis-related API calls to Spring Boot service via Kong Gateway
 */
import axiosInstance from './axios';
import { API_ENDPOINTS } from '../config/api';

/**
 * Medical Analysis entity matching Java model from patient-service
 */
export interface MedicalAnalysis {
  id?: string;
  patientId: string;
  analysisType: string; // e.g., "blood", "urine", "imaging", "biopsy"
  analysisName: string;
  testDate: string; // ISO datetime
  resultDate?: string; // ISO datetime
  results?: string; // JSON or text results
  interpretation?: string;
  normalRange?: string;
  abnormalFindings?: string;
  technician?: string;
  laboratoryName?: string;
  status?: 'PENDING' | 'COMPLETED' | 'REVIEWED';
  priority?: 'ROUTINE' | 'URGENT' | 'STAT';
  notes?: string;
  fileUrl?: string; // URL to PDF/image file
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
}

/**
 * Medical Analysis Create Request DTO
 */
export interface MedicalAnalysisCreateRequest {
  patientId: string;
  analysisType: string;
  analysisName: string;
  testDate: string;
  resultDate?: string;
  results?: string;
  interpretation?: string;
  normalRange?: string;
  abnormalFindings?: string;
  technician?: string;
  laboratoryName?: string;
  status?: 'PENDING' | 'COMPLETED' | 'REVIEWED';
  priority?: 'ROUTINE' | 'URGENT' | 'STAT';
  notes?: string;
  fileUrl?: string;
}

/**
 * Medical Analysis Update Request DTO
 */
export interface MedicalAnalysisUpdateRequest extends Partial<Omit<MedicalAnalysisCreateRequest, 'patientId'>> {}

/**
 * List all medical analyses
 */
export const listMedicalAnalyses = async (): Promise<MedicalAnalysis[]> => {
  const response = await axiosInstance.get<MedicalAnalysis[]>(API_ENDPOINTS.MEDICAL_ANALYSES);
  return response.data;
};

/**
 * Get medical analyses by patient ID
 * @param patientId Patient UUID
 */
export const getMedicalAnalysesByPatient = async (patientId: string): Promise<MedicalAnalysis[]> => {
  const response = await axiosInstance.get<MedicalAnalysis[]>(API_ENDPOINTS.MEDICAL_ANALYSES_PATIENT(patientId));
  return response.data;
};

/**
 * Get a specific medical analysis by ID
 * @param id Medical Analysis UUID
 */
export const getMedicalAnalysis = async (id: string): Promise<MedicalAnalysis> => {
  const response = await axiosInstance.get<MedicalAnalysis>(`${API_ENDPOINTS.MEDICAL_ANALYSES}/${id}`);
  return response.data;
};

/**
 * Create new medical analysis
 * @param data Medical analysis creation data
 */
export const createMedicalAnalysis = async (data: MedicalAnalysisCreateRequest): Promise<MedicalAnalysis> => {
  const response = await axiosInstance.post<MedicalAnalysis>(API_ENDPOINTS.MEDICAL_ANALYSES, data);
  return response.data;
};

/**
 * Update existing medical analysis
 * @param id Medical Analysis UUID
 * @param data Updated medical analysis data
 */
export const updateMedicalAnalysis = async (id: string, data: MedicalAnalysisUpdateRequest): Promise<MedicalAnalysis> => {
  const response = await axiosInstance.put<MedicalAnalysis>(`${API_ENDPOINTS.MEDICAL_ANALYSES}/${id}`, data);
  return response.data;
};

/**
 * Delete a medical analysis
 * @param id Medical Analysis UUID
 */
export const deleteMedicalAnalysis = async (id: string): Promise<void> => {
  await axiosInstance.delete(`${API_ENDPOINTS.MEDICAL_ANALYSES}/${id}`);
};

/**
 * Get pending medical analyses by patient ID
 * @param patientId Patient UUID
 */
export const getPendingAnalysesByPatient = async (patientId: string): Promise<MedicalAnalysis[]> => {
  const analyses = await getMedicalAnalysesByPatient(patientId);
  return analyses.filter(a => a.status === 'PENDING');
};

/**
 * Get medical analyses by type
 * @param patientId Patient UUID
 * @param analysisType Type of analysis (e.g., "blood", "urine")
 */
export const getAnalysesByType = async (patientId: string, analysisType: string): Promise<MedicalAnalysis[]> => {
  const analyses = await getMedicalAnalysesByPatient(patientId);
  return analyses.filter(a => a.analysisType.toLowerCase() === analysisType.toLowerCase());
};

/**
 * Mark analysis as reviewed
 * @param id Medical Analysis UUID
 */
export const markAsReviewed = async (id: string): Promise<MedicalAnalysis> => {
  return await updateMedicalAnalysis(id, { status: 'REVIEWED' });
};
