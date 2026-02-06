/**
 * Chatbot Medical AI Service
 * Handles all AI-powered features: chat, document analysis, and recommendations
 * Communicates with FastAPI chatbot-medical service via Kong Gateway
 */
import axiosInstance from './axios';
import { API_ENDPOINTS } from '../config/api';

/**
 * Chat message interface
 */
export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
  sources?: string[]; // RAG sources if applicable
}

/**
 * Chat request
 */
export interface ChatRequest {
  message: string;
  conversationId?: string; // Optional: for maintaining conversation context
}

/**
 * Chat response from AI
 */
export interface ChatResponse {
  response: string;
  sources?: string[]; // Medical guidelines/references used
  conversationId?: string;
  timestamp: string;
}

/**
 * Document analysis request
 */
export interface DocumentAnalysisRequest {
  file: File;
  patient_id: string;
  type_analyse: string; // e.g., "blood_test", "radiology", "prescription"
}

/**
 * Document analysis result
 */
export interface DocumentAnalysisResult {
  success: boolean;
  filename: string;
  texte_ocr: string; // OCR extracted text
  interpretation_ia: string; // AI interpretation
  alertes: string[]; // Critical alerts
  recommandations: string[]; // AI recommendations
  donnees_structurees?: any; // Structured data extracted
  patient_id?: string;
  analysis_id?: string; // ID of created medical analysis record
}

/**
 * AI Recommendation
 */
export interface AIRecommendation {
  type: string; // e.g., "medication", "lifestyle", "follow_up"
  recommendation: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  reasoning: string;
}

/**
 * Patient AI Recommendations Response
 */
export interface PatientRecommendationsResponse {
  patient_id: string;
  recommendations: AIRecommendation[];
  generated_at: string;
  based_on: string[]; // Data sources used (e.g., "vital_signs", "consultations")
}

/**
 * Send a message to the AI chatbot
 * @param message User message
 * @param conversationId Optional conversation ID for context
 */
export const sendChatMessage = async (message: string, conversationId?: string): Promise<ChatResponse> => {
  const request: ChatRequest = {
    message,
    conversationId
  };
  
  const response = await axiosInstance.post<ChatResponse>(API_ENDPOINTS.CHATBOT_CHAT, request);
  return response.data;
};

/**
 * Send a patient-specific message with context
 * @param message User message
 * @param patientContext Patient medical context
 * @param conversationId Optional conversation ID
 */
export const sendPatientChatMessage = async (
  message: string, 
  patientContext: string,
  conversationId?: string
): Promise<ChatResponse> => {
  // Prepend patient context to the message for AI understanding
  const contextualMessage = `${patientContext}\n\nQUESTION DU MÉDECIN:\n${message}`;
  
  const request: ChatRequest = {
    message: contextualMessage,
    conversationId
  };
  
  const response = await axiosInstance.post<ChatResponse>(API_ENDPOINTS.CHATBOT_CHAT, request);
  return response.data;
};

/**
 * Analyze a medical document (PDF/image) with OCR and AI
 * @param file Document file (PDF or image)
 * @param patientId Patient UUID
 * @param analysisType Type of analysis
 */
export const analyzeDocument = async (
  file: File,
  patientId: string,
  analysisType: string
): Promise<DocumentAnalysisResult> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('patient_id', patientId);
  formData.append('type_analyse', analysisType);
  
  const response = await axiosInstance.post<DocumentAnalysisResult>(
    API_ENDPOINTS.CHATBOT_ANALYZE,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
  );
  
  return response.data;
};

/**
 * Get AI-powered recommendations for a patient
 * Based on their medical history, vital signs, treatments, etc.
 * @param patientId Patient UUID
 */
export const getPatientRecommendations = async (patientId: string): Promise<PatientRecommendationsResponse> => {
  const response = await axiosInstance.get<PatientRecommendationsResponse>(
    API_ENDPOINTS.CHATBOT_RECOMMENDATIONS(patientId)
  );
  return response.data;
};

/**
 * Check chatbot service health
 */
export const checkChatbotHealth = async (): Promise<{ status: string; message: string }> => {
  const response = await axiosInstance.get<{ status: string; message: string }>(
    API_ENDPOINTS.CHATBOT_HEALTH
  );
  return response.data;
};

/**
 * Start a new conversation (helper function)
 */
export const startNewConversation = async (initialMessage: string): Promise<ChatResponse> => {
  return await sendChatMessage(initialMessage);
};

/**
 * Continue an existing conversation (helper function)
 */
export const continueConversation = async (
  message: string,
  conversationId: string
): Promise<ChatResponse> => {
  return await sendChatMessage(message, conversationId);
};

/**
 * Common medical questions for quick access
 */
export const MEDICAL_QUICK_QUESTIONS = [
  "What are the symptoms of diabetes?",
  "How to manage hypertension?",
  "What are normal blood pressure values?",
  "Explain ECG results interpretation",
  "What are cardiovascular risk factors?",
  "How to interpret blood test results?",
  "What are the side effects of common medications?",
  "Emergency signs that require immediate attention"
];

/**
 * Document analysis types
 */
export const DOCUMENT_ANALYSIS_TYPES = [
  { value: 'blood_test', label: 'Blood Test' },
  { value: 'urine_test', label: 'Urine Test' },
  { value: 'radiology', label: 'Radiology Report' },
  { value: 'ecg', label: 'ECG Report' },
  { value: 'echocardiogram', label: 'Echocardiogram' },
  { value: 'prescription', label: 'Prescription' },
  { value: 'consultation_note', label: 'Consultation Note' },
  { value: 'other', label: 'Other Medical Document' }
];
