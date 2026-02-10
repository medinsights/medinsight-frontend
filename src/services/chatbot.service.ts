/**
 * Chatbot Service
 * Handles all AI chatbot and medical assistant API calls
 */

import ApiService from './api.service';
import { API_ENDPOINTS } from '../config/api.config';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: string;
  sources?: string[];  // Changed from object array to string array
}

export interface ChatRequest {
  patient_id?: string | number;
  message: string;
  session_id?: string;
  use_rag?: boolean;
}

export interface ChatResponse {
  response: string;
  sources?: any[];
  conversation_id?: number;
  session_id?: string;
}

export interface DocumentAnalysisRequest {
  file: File;
  patient_id: string | number;
  type_analyse?: string;
}

export interface ImageAnalysisResult {
  analysis: string;
  confidence?: number;
  predictions?: any;
  interpretation?: string;
}

export interface Recommendation {
  alertes_critiques?: string[];
  alertes_surveillance?: string[];
  recommandations_traitements?: string[];
  actions_prioritaires?: string[];
  score_risque?: number;
}

export class ChatbotService {
  /**
   * Send chat message to AI assistant
   */
  static async chat(request: ChatRequest): Promise<ChatResponse> {
    return ApiService.post<ChatResponse>(API_ENDPOINTS.chatbot.chat, request);
  }

  /**
   * Analyze medical document (OCR + AI)
   */
  static async analyzeDocument(file: File, patientId: string | number, typeAnalyse = 'Bilan sanguin'): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('patient_id', patientId.toString());
    formData.append('type_analyse', typeAnalyse);

    return ApiService.uploadFile(API_ENDPOINTS.chatbot.analyzeDocument, formData);
  }

  /**
   * Analyze medical image (X-ray, etc.) using TensorFlow CNN
   */
  static async analyzeImage(file: File): Promise<ImageAnalysisResult> {
    const formData = new FormData();
    formData.append('file', file);

    return ApiService.uploadFile<ImageAnalysisResult>(
      API_ENDPOINTS.chatbot.analyzeImage,
      formData
    );
  }

  /**
   * Generate evolution charts for patient
   */
  static async generateCharts(patientId: string | number): Promise<Blob> {
    const response = await ApiService.get(
      API_ENDPOINTS.chatbot.generateCharts(patientId),
      { responseType: 'blob' }
    );
    return response;
  }

  /**
   * Generate PDF medical report for patient
   */
  static async generateReport(patientId: string | number): Promise<Blob> {
    const response = await ApiService.get(
      API_ENDPOINTS.chatbot.generateReport(patientId),
      { responseType: 'blob' }
    );
    return response;
  }

  /**
   * Get AI recommendations for patient
   */
  static async getRecommendations(patientId: string | number): Promise<Recommendation> {
    return ApiService.get<Recommendation>(
      API_ENDPOINTS.chatbot.recommendations(patientId)
    );
  }

  /**
   * Check chatbot service health
   */
  static async checkHealth(): Promise<{ status: string }> {
    return ApiService.get(API_ENDPOINTS.chatbot.health);
  }
}

export default ChatbotService;
