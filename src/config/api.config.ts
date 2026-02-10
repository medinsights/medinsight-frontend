/**
 * API Configuration
 * Central configuration for all API calls through Kong Gateway
 */

// Kong Gateway Base URL
export const API_BASE_URL = import.meta.env.VITE_KONG_GATEWAY_URL || 'http://localhost:8000';

// API Endpoints
export const API_ENDPOINTS = {
  // Auth Service
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    me: '/auth/me',
    refresh: '/auth/refresh',
    logout: '/auth/logout',
    logoutAll: '/auth/logout-all',
    verifyEmail: '/auth/verify-email',
    changePassword: '/auth/change-password',
    health: '/auth/health',
  },

  // Patient Service
  patients: {
    list: '/api/patients',
    get: (id: string | number) => `/api/patients/${id}`,
    create: '/api/patients',
    update: (id: string | number) => `/api/patients/${id}`,
    delete: (id: string | number) => `/api/patients/${id}`,
    search: '/api/patients/search',
    count: '/api/patients/stats/count',
    deactivate: (id: string | number) => `/api/patients/${id}/deactivate`,
    completeProfile: (id: string | number) => `/api/patients/${id}/complete-profile`,
    health: '/api/patients/health',
  },

  // Vital Signs (Constantes Vitales)
  vitalSigns: {
    list: (patientId: string | number) => `/api/vital-signs/patients/${patientId}`,
    listFrench: (patientId: string | number) => `/api/vital-signs/patients/${patientId}/constantes`,
    get: (id: string | number) => `/api/vital-signs/${id}`,
    create: (patientId: string | number) => `/api/vital-signs/patients/${patientId}`,
    createFrench: (patientId: string | number) => `/api/vital-signs/patients/${patientId}/constantes`,
    latest: (patientId: string | number) => `/api/vital-signs/patients/${patientId}/latest`,
    delete: (id: string | number) => `/api/vital-signs/${id}`,
    count: (patientId: string | number) => `/api/vital-signs/patients/${patientId}/count`,
  },

  // Treatments (Traitements)
  treatments: {
    list: (patientId: string | number) => `/api/treatments/patients/${patientId}`,
    listFrench: (patientId: string | number) => `/api/treatments/patients/${patientId}/traitements`,
    get: (id: string | number) => `/api/treatments/${id}`,
    create: (patientId: string | number) => `/api/treatments/patients/${patientId}`,
    update: (id: string | number) => `/api/treatments/${id}`,
    updateFrench: (id: string | number) => `/api/traitements/${id}`,
    delete: (id: string | number) => `/api/treatments/${id}`,
    active: (patientId: string | number) => `/api/treatments/patients/${patientId}/active`,
    count: (patientId: string | number) => `/api/treatments/patients/${patientId}/count`,
  },

  // Consultations
  consultations: {
    list: (patientId: string | number) => `/api/consultations/patients/${patientId}`,
    get: (id: string | number) => `/api/consultations/${id}`,
    create: (patientId: string | number) => `/api/consultations/patients/${patientId}`,
    update: (id: string | number) => `/api/consultations/${id}`,
    delete: (id: string | number) => `/api/consultations/${id}`,
    latest: (patientId: string | number) => `/api/consultations/patients/${patientId}/latest`,
  },

  // Medical Analyses (Analyses Médicales)
  medicalAnalyses: {
    list: (patientId: string | number) => `/api/medical-analyses/patients/${patientId}`,
    listFrench: (patientId: string | number) => `/api/medical-analyses/patients/${patientId}/analyses`,
    get: (id: string | number) => `/api/medical-analyses/${id}`,
    create: (patientId: string | number) => `/api/medical-analyses/patients/${patientId}`,
    update: (id: string | number) => `/api/medical-analyses/${id}`,
    delete: (id: string | number) => `/api/medical-analyses/${id}`,
    withAlerts: (patientId: string | number) => `/api/medical-analyses/patients/${patientId}/alerts`,
  },

  // Cardiovascular Exams
  cardiovascularExams: {
    list: (patientId: string | number) => `/api/cardiovascular-exams/patients/${patientId}`,
    get: (id: string | number) => `/api/cardiovascular-exams/${id}`,
    create: (patientId: string | number) => `/api/cardiovascular-exams/patients/${patientId}`,
    update: (id: string | number) => `/api/cardiovascular-exams/${id}`,
    delete: (id: string | number) => `/api/cardiovascular-exams/${id}`,
  },

  // Medical History
  medicalHistory: {
    list: (patientId: string | number) => `/api/medical-history/patients/${patientId}`,
    get: (id: string | number) => `/api/medical-history/${id}`,
    create: (patientId: string | number) => `/api/medical-history/patients/${patientId}`,
    update: (id: string | number) => `/api/medical-history/${id}`,
    delete: (id: string | number) => `/api/medical-history/${id}`,
  },

  // Medical Alerts
  medicalAlerts: {
    list: (patientId: string | number) => `/api/patients/${patientId}/alerts`,
    get: (id: string | number) => `/api/alerts/${id}`,
    create: (patientId: string | number) => `/api/patients/${patientId}/alerts`,
    active: (patientId: string | number) => `/api/patients/${patientId}/alerts/active`,
    bySeverity: (patientId: string | number, severity: string) => `/api/patients/${patientId}/alerts/severity/${severity}`,
    resolve: (id: string | number) => `/api/alerts/${id}/resolve`,
    dismiss: (id: string | number) => `/api/alerts/${id}/dismiss`,
    delete: (id: string | number) => `/api/alerts/${id}`,
    count: (patientId: string | number) => `/api/patients/${patientId}/alerts/count`,
  },

  // Chat Conversations
  conversations: {
    list: (patientId: string | number) => `/api/conversations/patients/${patientId}`,
    get: (id: string | number) => `/api/conversations/${id}`,
    getBySession: (sessionId: string) => `/api/conversations/session/${sessionId}`,
    create: (patientId: string | number) => `/api/conversations/patients/${patientId}`,
    addMessage: (id: string | number) => `/api/conversations/${id}/messages`,
    archive: (id: string | number) => `/api/conversations/${id}/archive`,
    delete: (id: string | number) => `/api/conversations/${id}`,
    count: (patientId: string | number) => `/api/conversations/patients/${patientId}/count`,
  },

  // Chatbot Medical (AI)
  chatbot: {
    health: '/api/chatbot/health',
    chat: '/api/chat',
    analyzeImage: '/api/chat/analyze-image',
    generateCharts: (patientId: string | number) => `/api/chat/charts/${patientId}`,
    generateReport: (patientId: string | number) => `/api/chat/reports/patient/${patientId}`,
    recommendations: (patientId: string | number) => `/api/patients/${patientId}/recommandations`,
    analyzeDocument: '/api/analyze-document',
  },
} as const;

// Export type for type-safe endpoint access
export type ApiEndpoints = typeof API_ENDPOINTS;
