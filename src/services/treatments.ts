/**
 * Treatments Service
 * Handles all treatment-related API calls to Spring Boot service via Kong Gateway
 */
import axiosInstance from './axios';
import { API_ENDPOINTS } from '../config/api';

/**
 * Treatment entity matching Java model from patient-service
 */
export interface Treatment {
  id?: string;
  patientId: string;
  treatmentName: string;
  description?: string;
  prescribedBy?: string; // Doctor name
  prescriptionDate: string; // ISO datetime
  startDate: string; // ISO datetime
  endDate?: string; // ISO datetime
  dosage?: string;
  frequency?: string;
  route?: string; // e.g., "oral", "intravenous", "topical"
  status?: 'ACTIVE' | 'COMPLETED' | 'DISCONTINUED';
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
}

/**
 * Treatment Create Request DTO
 */
export interface TreatmentCreateRequest {
  patientId: string;
  treatmentName: string;
  description?: string;
  prescribedBy?: string;
  prescriptionDate: string;
  startDate: string;
  endDate?: string;
  dosage?: string;
  frequency?: string;
  route?: string;
  status?: 'ACTIVE' | 'COMPLETED' | 'DISCONTINUED';
  notes?: string;
}

/**
 * Treatment Update Request DTO
 */
export interface TreatmentUpdateRequest extends Partial<Omit<TreatmentCreateRequest, 'patientId'>> {}

/**
 * List all treatments
 */
export const listTreatments = async (): Promise<Treatment[]> => {
  const response = await axiosInstance.get<Treatment[]>(API_ENDPOINTS.TREATMENTS);
  return response.data;
};

/**
 * Get treatments by patient ID
 * @param patientId Patient UUID
 */
export const getTreatmentsByPatient = async (patientId: string): Promise<Treatment[]> => {
  const response = await axiosInstance.get<Treatment[]>(API_ENDPOINTS.TREATMENTS_PATIENT(patientId));
  return response.data;
};

/**
 * Get active treatments by patient ID
 * @param patientId Patient UUID
 */
export const getActiveTreatmentsByPatient = async (patientId: string): Promise<Treatment[]> => {
  const response = await axiosInstance.get<Treatment[]>(`${API_ENDPOINTS.TREATMENTS_PATIENT(patientId)}/active`);
  return response.data;
};

/**
 * Get a specific treatment by ID
 * @param id Treatment UUID
 */
export const getTreatment = async (id: string): Promise<Treatment> => {
  const response = await axiosInstance.get<Treatment>(`${API_ENDPOINTS.TREATMENTS}/${id}`);
  return response.data;
};

/**
 * Create new treatment
 * @param data Treatment creation data
 */
export const createTreatment = async (data: TreatmentCreateRequest): Promise<Treatment> => {
  const response = await axiosInstance.post<Treatment>(API_ENDPOINTS.TREATMENTS, data);
  return response.data;
};

/**
 * Update existing treatment
 * @param id Treatment UUID
 * @param data Updated treatment data
 */
export const updateTreatment = async (id: string, data: TreatmentUpdateRequest): Promise<Treatment> => {
  const response = await axiosInstance.put<Treatment>(`${API_ENDPOINTS.TREATMENTS}/${id}`, data);
  return response.data;
};

/**
 * Delete a treatment
 * @param id Treatment UUID
 */
export const deleteTreatment = async (id: string): Promise<void> => {
  await axiosInstance.delete(`${API_ENDPOINTS.TREATMENTS}/${id}`);
};

/**
 * Discontinue a treatment
 * @param id Treatment UUID
 */
export const discontinueTreatment = async (id: string): Promise<Treatment> => {
  return await updateTreatment(id, { status: 'DISCONTINUED', endDate: new Date().toISOString() });
};

/**
 * Complete a treatment
 * @param id Treatment UUID
 */
export const completeTreatment = async (id: string): Promise<Treatment> => {
  return await updateTreatment(id, { status: 'COMPLETED', endDate: new Date().toISOString() });
};
