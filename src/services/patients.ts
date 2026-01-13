/**
 * Patient Service
 * Handles all patient-related API calls to Spring Boot service via Kong Gateway
 */
import axiosInstance from './axios';
import { API_ENDPOINTS } from '../config/api';

/**
 * Patient entity matching Java model from patient-service
 */
export interface Patient {
  id?: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string; // ISO date string (YYYY-MM-DD)
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  bloodGroup?: string;
  allergies?: string;
  chronicDiseases?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  notes?: string;
  active?: boolean;
  createdAt?: string; // ISO datetime
  updatedAt?: string; // ISO datetime
  createdBy?: string; // UUID of user who created
  updatedBy?: string; // UUID of user who updated
}

/**
 * Patient Create Request DTO
 */
export interface PatientCreateRequest {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  bloodGroup?: string;
  allergies?: string;
  chronicDiseases?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  notes?: string;
}

/**
 * Patient Update Request DTO
 */
export interface PatientUpdateRequest extends Partial<PatientCreateRequest> {}

/**
 * List all patients for the authenticated user
 * @param activeOnly Filter only active patients
 */
export const listPatients = async (activeOnly?: boolean): Promise<Patient[]> => {
  const params = activeOnly !== undefined ? { activeOnly } : {};
  const response = await axiosInstance.get<Patient[]>(API_ENDPOINTS.PATIENTS, { params });
  return response.data;
};

/**
 * Get a specific patient by ID
 * @param id Patient UUID
 */
export const getPatient = async (id: string): Promise<Patient> => {
  const response = await axiosInstance.get<Patient>(`${API_ENDPOINTS.PATIENTS}/${id}`);
  return response.data;
};

/**
 * Search patients by name or email
 * @param query Search term
 */
export const searchPatients = async (query: string): Promise<Patient[]> => {
  const response = await axiosInstance.get<Patient[]>(API_ENDPOINTS.PATIENTS_SEARCH, {
    params: { query }
  });
  return response.data;
};

/**
 * Create a new patient
 * @param data Patient creation data
 */
export const createPatient = async (data: PatientCreateRequest): Promise<Patient> => {
  const response = await axiosInstance.post<Patient>(API_ENDPOINTS.PATIENTS, data);
  return response.data;
};

/**
 * Update an existing patient
 * @param id Patient UUID
 * @param data Patient update data
 */
export const updatePatient = async (id: string, data: PatientUpdateRequest): Promise<Patient> => {
  const response = await axiosInstance.put<Patient>(`${API_ENDPOINTS.PATIENTS}/${id}`, data);
  return response.data;
};

/**
 * Delete a patient permanently
 * @param id Patient UUID
 */
export const deletePatient = async (id: string): Promise<void> => {
  await axiosInstance.delete(`${API_ENDPOINTS.PATIENTS}/${id}`);
};

/**
 * Deactivate a patient (soft delete)
 * @param id Patient UUID
 */
export const deactivatePatient = async (id: string): Promise<void> => {
  await axiosInstance.patch(`${API_ENDPOINTS.PATIENTS}/${id}/deactivate`);
};

/**
 * Get count of active patients for the authenticated user
 */
export const countActivePatients = async (): Promise<number> => {
  const response = await axiosInstance.get<number>(API_ENDPOINTS.PATIENTS_STATS);
  return response.data;
};

/**
 * Utility: Calculate age from date of birth
 */
export const calculateAge = (dateOfBirth: string): number => {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
};

/**
 * Utility: Format date for display
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
};

/**
 * Utility: Get full name
 */
export const getFullName = (patient: Patient): string => {
  return `${patient.firstName} ${patient.lastName}`;
};
