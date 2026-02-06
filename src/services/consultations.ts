/**
 * Consultations Service
 * Handles all consultation-related API calls to Spring Boot service via Kong Gateway
 */
import axiosInstance from './axios';
import { API_ENDPOINTS } from '../config/api';

/**
 * Consultation entity matching Java model from patient-service
 */
export interface Consultation {
  id?: string;
  patientId: string;
  consultationDate: string; // ISO datetime
  consultationType?: string; // e.g., "routine", "follow-up", "emergency"
  chiefComplaint?: string;
  presentIllnessHistory?: string;
  physicalExamination?: string;
  diagnosis?: string;
  treatmentPlan?: string;
  prescriptions?: string;
  notes?: string;
  doctorName?: string;
  speciality?: string;
  followUpDate?: string; // ISO datetime
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
}

/**
 * Consultation Create Request DTO
 */
export interface ConsultationCreateRequest {
  patientId: string;
  consultationDate: string;
  consultationType?: string;
  chiefComplaint?: string;
  presentIllnessHistory?: string;
  physicalExamination?: string;
  diagnosis?: string;
  treatmentPlan?: string;
  prescriptions?: string;
  notes?: string;
  doctorName?: string;
  speciality?: string;
  followUpDate?: string;
}

/**
 * Consultation Update Request DTO
 */
export interface ConsultationUpdateRequest extends Partial<Omit<ConsultationCreateRequest, 'patientId'>> {}

/**
 * List all consultations
 */
export const listConsultations = async (): Promise<Consultation[]> => {
  const response = await axiosInstance.get<Consultation[]>(API_ENDPOINTS.CONSULTATIONS);
  return response.data;
};

/**
 * Get consultations by patient ID
 * @param patientId Patient UUID
 */
export const getConsultationsByPatient = async (patientId: string): Promise<Consultation[]> => {
  const response = await axiosInstance.get<Consultation[]>(API_ENDPOINTS.CONSULTATIONS_PATIENT(patientId));
  return response.data;
};

/**
 * Get a specific consultation by ID
 * @param id Consultation UUID
 */
export const getConsultation = async (id: string): Promise<Consultation> => {
  const response = await axiosInstance.get<Consultation>(`${API_ENDPOINTS.CONSULTATIONS}/${id}`);
  return response.data;
};

/**
 * Create new consultation
 * @param data Consultation creation data
 */
export const createConsultation = async (data: ConsultationCreateRequest): Promise<Consultation> => {
  const response = await axiosInstance.post<Consultation>(API_ENDPOINTS.CONSULTATIONS, data);
  return response.data;
};

/**
 * Update existing consultation
 * @param id Consultation UUID
 * @param data Updated consultation data
 */
export const updateConsultation = async (id: string, data: ConsultationUpdateRequest): Promise<Consultation> => {
  const response = await axiosInstance.put<Consultation>(`${API_ENDPOINTS.CONSULTATIONS}/${id}`, data);
  return response.data;
};

/**
 * Delete a consultation
 * @param id Consultation UUID
 */
export const deleteConsultation = async (id: string): Promise<void> => {
  await axiosInstance.delete(`${API_ENDPOINTS.CONSULTATIONS}/${id}`);
};

/**
 * Get latest consultation for a patient
 * @param patientId Patient UUID
 */
export const getLatestConsultation = async (patientId: string): Promise<Consultation | null> => {
  const consultations = await getConsultationsByPatient(patientId);
  if (consultations.length === 0) return null;
  
  // Sort by consultation date descending and return the most recent
  return consultations.sort((a, b) => 
    new Date(b.consultationDate).getTime() - new Date(a.consultationDate).getTime()
  )[0];
};

/**
 * Get consultations by date range
 * @param patientId Patient UUID
 * @param startDate Start date (ISO string)
 * @param endDate End date (ISO string)
 */
export const getConsultationsByDateRange = async (
  patientId: string,
  startDate: string,
  endDate: string
): Promise<Consultation[]> => {
  const consultations = await getConsultationsByPatient(patientId);
  return consultations.filter(c => {
    const date = new Date(c.consultationDate);
    return date >= new Date(startDate) && date <= new Date(endDate);
  });
};
