/**
 * Axios Instance with JWT Interceptors
 * Handles automatic token refresh on 401 errors
 */
import axios from 'axios';
import type { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { API_ENDPOINTS } from '../config/api';

// Create axios instance
const axiosInstance = axios.create({
  withCredentials: true, // Required for cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Track if we're currently refreshing
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

/**
 * Process queued requests after token refresh
 */
const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

/**
 * Get access token from memory
 */
export const getAccessToken = (): string | null => {
  return sessionStorage.getItem('access_token');
};

/**
 * Set access token in memory
 */
export const setAccessToken = (token: string | null): void => {
  if (token) {
    sessionStorage.setItem('access_token', token);
  } else {
    sessionStorage.removeItem('access_token');
  }
};

/**
 * Clear all auth data
 */
export const clearAuth = (): void => {
  setAccessToken(null);
  sessionStorage.removeItem('user');
};

/**
 * Request interceptor - attach access token
 */
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAccessToken();
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor - handle 401 and auto-refresh
 */
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    
    // If error is not 401 or request already retried, reject
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }
    
    // Don't retry refresh or login requests
    if (
      originalRequest.url === API_ENDPOINTS.REFRESH ||
      originalRequest.url === API_ENDPOINTS.LOGIN
    ) {
      clearAuth();
      window.location.href = '/login';
      return Promise.reject(error);
    }
    
    // If already refreshing, queue this request
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then(() => {
          return axiosInstance(originalRequest);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    }
    
    originalRequest._retry = true;
    isRefreshing = true;
    
    try {
      // Attempt to refresh token
      const response = await axios.post(
        API_ENDPOINTS.REFRESH,
        {},
        {
          withCredentials: true, // Send refresh token cookie
        }
      );
      
      const { access_token } = response.data;
      
      // Store new access token
      setAccessToken(access_token);
      
      // Update authorization header
      if (originalRequest.headers) {
        originalRequest.headers.Authorization = `Bearer ${access_token}`;
      }
      
      // Process queued requests
      processQueue(null, access_token);
      
      // Retry original request
      return axiosInstance(originalRequest);
    } catch (refreshError) {
      // Refresh failed - clear auth and redirect to login
      processQueue(refreshError as Error, null);
      clearAuth();
      window.location.href = '/login';
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default axiosInstance;
