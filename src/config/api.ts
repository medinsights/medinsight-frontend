/**
 * API Configuration and Axios Instance
 * Centralized configuration for all API calls
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export const API_ENDPOINTS = {
  // Authentication
  LOGIN: `${API_BASE_URL}/auth/login/`,
  REGISTER: `${API_BASE_URL}/auth/register/`,
  REFRESH: `${API_BASE_URL}/auth/refresh/`,
  LOGOUT: `${API_BASE_URL}/auth/logout/`,
  LOGOUT_ALL: `${API_BASE_URL}/auth/logout-all/`,
  ME: `${API_BASE_URL}/auth/me/`,
  VERIFY_EMAIL: `${API_BASE_URL}/auth/verify-email/`,
  CHANGE_PASSWORD: `${API_BASE_URL}/auth/change-password/`,
  
  // Health
  HEALTH: `${API_BASE_URL}/health/`,
};

export default API_BASE_URL;
