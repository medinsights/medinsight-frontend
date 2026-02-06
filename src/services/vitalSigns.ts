/**
 * Vital Signs Service
 * Handles all vital signs-related API calls to Spring Boot service via Kong Gateway
 */
import axiosInstance from './axios';
import { API_ENDPOINTS } from '../config/api';

/**
 * Vital Signs entity matching Java model from patient-service
 */
export interface VitalSigns {
  id?: string;
  patientId: string;
  measurementDate: string; // ISO datetime
  bloodPressureSystolic?: number;
  bloodPressureDiastolic?: number;
  heartRate?: number; // bpm
  temperature?: number; // Celsius
  respiratoryRate?: number; // breaths/min
  oxygenSaturation?: number; // percentage
  weight?: number; // kg
  height?: number; // cm
  bmi?: number; // calculated
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
}

/**
 * Vital Signs Create Request DTO
 */
export interface VitalSignsCreateRequest {
  patientId: string;
  measurementDate: string;
  bloodPressureSystolic?: number;
  bloodPressureDiastolic?: number;
  heartRate?: number;
  temperature?: number;
  respiratoryRate?: number;
  oxygenSaturation?: number;
  weight?: number;
  height?: number;
  notes?: string;
}

/**
 * Vital Signs Update Request DTO
 */
export interface VitalSignsUpdateRequest extends Partial<Omit<VitalSignsCreateRequest, 'patientId'>> {}

/**
 * List all vital signs
 */
export const listVitalSigns = async (): Promise<VitalSigns[]> => {
  const response = await axiosInstance.get<VitalSigns[]>(API_ENDPOINTS.VITAL_SIGNS);
  return response.data;
};

/**
 * Get vital signs by patient ID
 * @param patientId Patient UUID
 */
export const getVitalSignsByPatient = async (patientId: string): Promise<VitalSigns[]> => {
  const response = await axiosInstance.get<VitalSigns[]>(API_ENDPOINTS.VITAL_SIGNS_PATIENT(patientId));
  return response.data;
};

/**
 * Get a specific vital signs record by ID
 * @param id Vital Signs UUID
 */
export const getVitalSigns = async (id: string): Promise<VitalSigns> => {
  const response = await axiosInstance.get<VitalSigns>(`${API_ENDPOINTS.VITAL_SIGNS}/${id}`);
  return response.data;
};

/**
 * Create new vital signs record
 * @param data Vital signs creation data
 */
export const createVitalSigns = async (data: VitalSignsCreateRequest): Promise<VitalSigns> => {
  const response = await axiosInstance.post<VitalSigns>(API_ENDPOINTS.VITAL_SIGNS, data);
  return response.data;
};

/**
 * Update existing vital signs record
 * @param id Vital Signs UUID
 * @param data Updated vital signs data
 */
export const updateVitalSigns = async (id: string, data: VitalSignsUpdateRequest): Promise<VitalSigns> => {
  const response = await axiosInstance.put<VitalSigns>(`${API_ENDPOINTS.VITAL_SIGNS}/${id}`, data);
  return response.data;
};

/**
 * Delete a vital signs record
 * @param id Vital Signs UUID
 */
export const deleteVitalSigns = async (id: string): Promise<void> => {
  await axiosInstance.delete(`${API_ENDPOINTS.VITAL_SIGNS}/${id}`);
};

/**
 * Get latest vital signs for a patient
 * @param patientId Patient UUID
 */
export const getLatestVitalSigns = async (patientId: string): Promise<VitalSigns | null> => {
  const vitalSigns = await getVitalSignsByPatient(patientId);
  if (vitalSigns.length === 0) return null;
  
  // Sort by measurement date descending and return the most recent
  return vitalSigns.sort((a, b) => 
    new Date(b.measurementDate).getTime() - new Date(a.measurementDate).getTime()
  )[0];
};
