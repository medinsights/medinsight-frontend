/**
 * API Configuration and Axios Instance
 * Centralized configuration for all API calls through Kong Gateway
 */

const KONG_GATEWAY_URL = import.meta.env.VITE_KONG_GATEWAY_URL || 'http://localhost:8000';

export const API_ENDPOINTS = {
  // Authentication (via Kong → Django Auth Service)
  LOGIN: `${KONG_GATEWAY_URL}/auth/login`,
  REGISTER: `${KONG_GATEWAY_URL}/auth/register`,
  REFRESH: `${KONG_GATEWAY_URL}/auth/refresh`,
  LOGOUT: `${KONG_GATEWAY_URL}/auth/logout`,
  LOGOUT_ALL: `${KONG_GATEWAY_URL}/auth/logout-all`,
  ME: `${KONG_GATEWAY_URL}/auth/me`,
  VERIFY_EMAIL: `${KONG_GATEWAY_URL}/auth/verify-email`,
  CHANGE_PASSWORD: `${KONG_GATEWAY_URL}/auth/change-password`,
  
  // Health Checks
  AUTH_HEALTH: `${KONG_GATEWAY_URL}/auth/health`,
  
  // Patient Management (via Kong → Spring Boot Patient Service)
  PATIENTS: `${KONG_GATEWAY_URL}/api/patients`,
  PATIENTS_SEARCH: `${KONG_GATEWAY_URL}/api/patients/search`,
  PATIENTS_STATS: `${KONG_GATEWAY_URL}/api/patients/stats/count`,
  
  // Vital Signs (via Kong → Spring Boot Patient Service)
  VITAL_SIGNS: `${KONG_GATEWAY_URL}/api/vital-signs`,
  VITAL_SIGNS_PATIENT: (patientId: string) => `${KONG_GATEWAY_URL}/api/vital-signs/patients/${patientId}`,
  
  // Treatments (via Kong → Spring Boot Patient Service)
  TREATMENTS: `${KONG_GATEWAY_URL}/api/treatments`,
  TREATMENTS_PATIENT: (patientId: string) => `${KONG_GATEWAY_URL}/api/treatments/patients/${patientId}`,
  
  // Consultations (via Kong → Spring Boot Patient Service)
  CONSULTATIONS: `${KONG_GATEWAY_URL}/api/consultations`,
  CONSULTATIONS_PATIENT: (patientId: string) => `${KONG_GATEWAY_URL}/api/consultations/patients/${patientId}`,
  
  // Medical Analyses (via Kong → Spring Boot Patient Service)
  MEDICAL_ANALYSES: `${KONG_GATEWAY_URL}/api/medical-analyses`,
  MEDICAL_ANALYSES_PATIENT: (patientId: string) => `${KONG_GATEWAY_URL}/api/medical-analyses/patients/${patientId}`,
  
  // Cardiovascular Exams (via Kong → Spring Boot Patient Service)
  CARDIOVASCULAR_EXAMS: `${KONG_GATEWAY_URL}/api/cardiovascular-exams`,
  CARDIOVASCULAR_EXAMS_PATIENT: (patientId: string) => `${KONG_GATEWAY_URL}/api/cardiovascular-exams/patients/${patientId}`,
  
  // AI Chatbot Medical (via Kong → FastAPI Chatbot Service)
  CHATBOT_HEALTH: `${KONG_GATEWAY_URL}/api/chatbot/health`,
  CHATBOT_CHAT: `${KONG_GATEWAY_URL}/api/chatbot/chat`,
  CHATBOT_ANALYZE: `${KONG_GATEWAY_URL}/api/chatbot/analyze-document`,
  CHATBOT_RECOMMENDATIONS: (patientId: string) => `${KONG_GATEWAY_URL}/api/chatbot/patients/${patientId}/recommandations`,
  
  // Patient-specific endpoints (via Spring Boot Patient Service)
  PATIENT_BY_ID: (patientId: string) => `${KONG_GATEWAY_URL}/api/patients/${patientId}`,
  PATIENT_ANALYSES: (patientId: string) => `${KONG_GATEWAY_URL}/api/medical-analyses/patients/${patientId}`,
  PATIENT_TREATMENTS: (patientId: string) => `${KONG_GATEWAY_URL}/api/treatments/patients/${patientId}`,
  PATIENT_CONSULTATIONS: (patientId: string) => `${KONG_GATEWAY_URL}/api/consultations/patients/${patientId}`,
  PATIENT_VITAL_SIGNS: (patientId: string) => `${KONG_GATEWAY_URL}/api/vital-signs/patients/${patientId}`,
  PATIENT_CARDIOVASCULAR: (patientId: string) => `${KONG_GATEWAY_URL}/api/cardiovascular-exams/patients/${patientId}`,
};

export default KONG_GATEWAY_URL;
