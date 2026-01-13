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
};

export default KONG_GATEWAY_URL;
