/**
 * API Configuration and Endpoints
 * Centralized configuration for all API calls through Kong Gateway
 * 
 * IMPORTANT: All endpoints route through Kong Gateway (http://localhost:8000)
 * which handles JWT authentication, CORS, and service routing
 * 
 * Kong Gateway Routes:
 * - /auth/*          → Django Auth Service (port 8001)
 * - /api/patients/*  → Spring Boot Patient Service (port 8080)
 * - /api/chat/*      → FastAPI Chatbot Service (port 8002)
 */

// Kong Gateway Base URL - configured via environment variable
const KONG_GATEWAY_URL = import.meta.env.VITE_KONG_GATEWAY_URL || 'http://localhost:8000';

/**
 * Comprehensive API Endpoints
 * All endpoints automatically include JWT tokens via axios interceptor
 */
export const API_ENDPOINTS = {
  //=============================================================================
  // AUTHENTICATION SERVICE (Django) - via Kong Gateway
  //=============================================================================
  // Public endpoints (no JWT required)
  LOGIN: `${KONG_GATEWAY_URL}/auth/login`,
  REGISTER: `${KONG_GATEWAY_URL}/auth/register`,
  AUTH_HEALTH: `${KONG_GATEWAY_URL}/auth/health`,
  
  // Protected endpoints (JWT required)
  ME: `${KONG_GATEWAY_URL}/auth/me`,
  REFRESH: `${KONG_GATEWAY_URL}/auth/refresh`,
  LOGOUT: `${KONG_GATEWAY_URL}/auth/logout`,
  LOGOUT_ALL: `${KONG_GATEWAY_URL}/auth/logout-all`,
  VERIFY_EMAIL: `${KONG_GATEWAY_URL}/auth/verify-email`,
  CHANGE_PASSWORD: `${KONG_GATEWAY_URL}/auth/change-password`,
  
  //=============================================================================
  // PATIENT SERVICE (Spring Boot) - via Kong Gateway
  //=============================================================================
  // Patient CRUD
  PATIENTS: `${KONG_GATEWAY_URL}/api/patients`,
  PATIENTS_SEARCH: `${KONG_GATEWAY_URL}/api/patients/search`,
  PATIENTS_STATS: `${KONG_GATEWAY_URL}/api/patients/stats/count`,
  PATIENTS_HEALTH: `${KONG_GATEWAY_URL}/api/patients/health`,
  PATIENT_BY_ID: (patientId: string | number) => `${KONG_GATEWAY_URL}/api/patients/${patientId}`,
  PATIENT_DEACTIVATE: (patientId: string | number) => `${KONG_GATEWAY_URL}/api/patients/${patientId}/deactivate`,
  
  // Vital Signs (Constantes Vitales)
  VITAL_SIGNS: `${KONG_GATEWAY_URL}/api/vital-signs`,
  VITAL_SIGNS_PATIENT: (patientId: string | number) => `${KONG_GATEWAY_URL}/api/vital-signs/patients/${patientId}`,
  VITAL_SIGNS_LATEST: (patientId: string | number) => `${KONG_GATEWAY_URL}/api/vital-signs/patients/${patientId}/latest`,
  VITAL_SIGNS_BY_ID: (id: string | number) => `${KONG_GATEWAY_URL}/api/vital-signs/${id}`,
  
  // Treatments (Traitements)
  TREATMENTS: `${KONG_GATEWAY_URL}/api/treatments`,
  TREATMENTS_PATIENT: (patientId: string | number) => `${KONG_GATEWAY_URL}/api/treatments/patients/${patientId}`,
  TREATMENTS_ACTIVE: (patientId: string | number) => `${KONG_GATEWAY_URL}/api/treatments/patients/${patientId}/active`,
  TREATMENTS_BY_ID: (id: string | number) => `${KONG_GATEWAY_URL}/api/treatments/${id}`,
  
  // French alias (Kong transforms /api/traitements → /api/treatments)
  TRAITEMENTS: `${KONG_GATEWAY_URL}/api/traitements`,
  TRAITEMENTS_PATIENT: (patientId: string | number) => `${KONG_GATEWAY_URL}/api/traitements/patients/${patientId}`,
  
  // Consultations
  CONSULTATIONS: `${KONG_GATEWAY_URL}/api/consultations`,
  CONSULTATIONS_PATIENT: (patientId: string | number) => `${KONG_GATEWAY_URL}/api/consultations/patients/${patientId}`,
  CONSULTATIONS_BY_ID: (id: string | number) => `${KONG_GATEWAY_URL}/api/consultations/${id}`,
  
  // Medical Analyses (Analyses Biologiques)
  MEDICAL_ANALYSES: `${KONG_GATEWAY_URL}/api/medical-analyses`,
  MEDICAL_ANALYSES_PATIENT: (patientId: string | number) => `${KONG_GATEWAY_URL}/api/medical-analyses/patients/${patientId}`,
  MEDICAL_ANALYSES_BY_ID: (id: string | number) => `${KONG_GATEWAY_URL}/api/medical-analyses/${id}`,
  
  // Cardiovascular Exams
  CARDIOVASCULAR_EXAMS: `${KONG_GATEWAY_URL}/api/cardiovascular-exams`,
  CARDIOVASCULAR_EXAMS_PATIENT: (patientId: string | number) => `${KONG_GATEWAY_URL}/api/cardiovascular-exams/patients/${patientId}`,
  CARDIOVASCULAR_EXAMS_BY_ID: (id: string | number) => `${KONG_GATEWAY_URL}/api/cardiovascular-exams/${id}`,
  
  // Medical History
  MEDICAL_HISTORY: `${KONG_GATEWAY_URL}/api/medical-history`,
  MEDICAL_HISTORY_PATIENT: (patientId: string | number) => `${KONG_GATEWAY_URL}/api/medical-history/patients/${patientId}`,
  
  // Medical Alerts
  MEDICAL_ALERTS_PATIENT: (patientId: string | number) => `${KONG_GATEWAY_URL}/api/patients/${patientId}/alerts`,
  
  // Conversations (Chat History)
  CONVERSATIONS: `${KONG_GATEWAY_URL}/api/conversations`,
  CONVERSATIONS_PATIENT: (patientId: string | number) => `${KONG_GATEWAY_URL}/api/conversations/patients/${patientId}`,
  
  //=============================================================================
  // CHATBOT SERVICE (FastAPI) - via Kong Gateway
  //=============================================================================
  // AI Chat & Medical Assistant
  CHATBOT_HEALTH: `${KONG_GATEWAY_URL}/api/chatbot/health`,
  CHATBOT_CHAT: `${KONG_GATEWAY_URL}/api/chat`,
  CHATBOT_ANALYZE_IMAGE: `${KONG_GATEWAY_URL}/api/chat/analyze-image`,
  CHATBOT_CHARTS: `${KONG_GATEWAY_URL}/api/chat/charts`,
  CHATBOT_ANALYZE: `${KONG_GATEWAY_URL}/api/chatbot/analyze-document`,
  CHATBOT_RECOMMENDATIONS: (patientId: string | number) => `${KONG_GATEWAY_URL}/api/chatbot/patients/${patientId}/recommandations`,
  CHATBOT_GENERATE_CHARTS: (patientId: string | number) => `${KONG_GATEWAY_URL}/api/chat/charts/${patientId}`,
  CHATBOT_GENERATE_REPORT: (patientId: string | number) => `${KONG_GATEWAY_URL}/api/chatbot/patients/${patientId}/report`,
  
  //=============================================================================
  // Legacy Compatibility Endpoints (from Chatbot-Copie)
  //=============================================================================
  // These maintain backwards compatibility with the old frontend structure
  PATIENT_ANALYSES: (patientId: string | number) => `${KONG_GATEWAY_URL}/api/medical-analyses/patients/${patientId}`,
  PATIENT_TREATMENTS: (patientId: string | number) => `${KONG_GATEWAY_URL}/api/treatments/patients/${patientId}`,
  PATIENT_CONSULTATIONS: (patientId: string | number) => `${KONG_GATEWAY_URL}/api/consultations/patients/${patientId}`,
  PATIENT_VITAL_SIGNS: (patientId: string | number) => `${KONG_GATEWAY_URL}/api/vital-signs/patients/${patientId}`,
  PATIENT_CARDIOVASCULAR: (patientId: string | number) => `${KONG_GATEWAY_URL}/api/cardiovascular-exams/patients/${patientId}`,
};

/**
 * Export Kong Gateway URL for direct access if needed
 */
export default KONG_GATEWAY_URL;

/**
 * SECURITY NOTES:
 * ================
 * 
 * 1. JWT Authentication:
 *    - Access tokens are automatically injected via axios interceptor
 *    - Refresh tokens are stored in HttpOnly cookies (sent automatically)
 *    - 401 errors trigger automatic token refresh and request retry
 * 
 * 2. CORS Configuration:
 *    - Kong Gateway handles CORS for all services
 *    - Frontend origins: localhost:5173, localhost:3000, localhost:4200
 *    - Credentials: true (for cookie-based refresh tokens)
 * 
 * 3. Rate Limiting (enforced by Kong):
 *    - Auth endpoints: 5-10 requests/minute
 *    - Data endpoints: 60-100 requests/minute
 *    - AI endpoints: 10-20 requests/minute
 * 
 * 4. Request Size Limits:
 *    - Standard requests: 10MB
 *    - Image uploads: 25MB
 *    - Document uploads: 25MB
 */
