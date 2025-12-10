/**
 * Authentication Service
 * Handles all auth-related API calls
 */
import axiosInstance, { setAccessToken, clearAuth } from './axios';
import { API_ENDPOINTS } from '../config/api';

export interface User {
  id: string;
  email: string;
  username: string;
  role: string;
  email_verified: boolean;
  date_joined: string;
  last_login: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  username: string;
  password: string;
  password_confirm: string;
}

export interface LoginResponse {
  message: string;
  access_token: string;
  user: User;
}

export interface RegisterResponse {
  message: string;
  user: User;
}

export interface MeResponse {
  user: User;
}

/**
 * Register a new user
 */
export const register = async (data: RegisterData): Promise<RegisterResponse> => {
  const response = await axiosInstance.post<RegisterResponse>(
    API_ENDPOINTS.REGISTER,
    data
  );
  return response.data;
};

/**
 * Login user
 * Returns access token and sets refresh token cookie
 */
export const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  const response = await axiosInstance.post<LoginResponse>(
    API_ENDPOINTS.LOGIN,
    credentials
  );
  
  // Store access token in memory
  if (response.data.access_token) {
    setAccessToken(response.data.access_token);
  }
  
  return response.data;
};

/**
 * Logout current session
 */
export const logout = async (): Promise<void> => {
  try {
    await axiosInstance.post(API_ENDPOINTS.LOGOUT);
  } finally {
    clearAuth();
  }
};

/**
 * Logout all sessions
 */
export const logoutAll = async (): Promise<void> => {
  try {
    await axiosInstance.post(API_ENDPOINTS.LOGOUT_ALL);
  } finally {
    clearAuth();
  }
};

/**
 * Get current user information
 */
export const getCurrentUser = async (): Promise<User> => {
  const response = await axiosInstance.get<MeResponse>(API_ENDPOINTS.ME);
  return response.data.user;
};

/**
 * Verify email with token
 */
export const verifyEmail = async (token: string): Promise<{ message: string }> => {
  const response = await axiosInstance.post(API_ENDPOINTS.VERIFY_EMAIL, { token });
  return response.data;
};

/**
 * Change password
 */
export const changePassword = async (data: {
  old_password: string;
  new_password: string;
  new_password_confirm: string;
}): Promise<{ message: string }> => {
  const response = await axiosInstance.post(API_ENDPOINTS.CHANGE_PASSWORD, data);
  return response.data;
};
