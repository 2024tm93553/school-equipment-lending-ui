import axios from 'axios';
import { getToken } from './AuthService';

// Constants
const API_CONFIG = {
    BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:8080',
    TIMEOUT: 15000, // 15 seconds
    HEADERS: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
};

const HTTP_STATUS = {
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500
};

/**
 * Create axios instance with default configuration
 */
const apiClient = axios.create({
    baseURL: API_CONFIG.BASE_URL,
    timeout: API_CONFIG.TIMEOUT,
    headers: API_CONFIG.HEADERS
});

/**
 * Request interceptor to add authorization token
 */
apiClient.interceptors.request.use(
    (config) => {
        const token = getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Log request in development
        if (process.env.NODE_ENV === 'development') {
            console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
        }

        return config;
    },
    (error) => {
        console.error('❌ Request interceptor error:', error);
        return Promise.reject(error);
    }
);

/**
 * Response interceptor to handle common errors
 */
apiClient.interceptors.response.use(
    (response) => {
        // Log response in development
        if (process.env.NODE_ENV === 'development') {
            console.log(`✅ API Response: ${response.status} ${response.config.url}`);
        }
        return response;
    },
    (error) => {
        const { response, request, message } = error;

        // Handle different error scenarios
        if (response) {
            // Server responded with error status
            const { status, data } = response;

            switch (status) {
                case HTTP_STATUS.UNAUTHORIZED:
                    handleUnauthorizedError();
                    break;
                case HTTP_STATUS.FORBIDDEN:
                    console.warn('⚠️ Access forbidden:', data?.message || 'Insufficient permissions');
                    break;
                case HTTP_STATUS.NOT_FOUND:
                    console.warn('⚠️ Resource not found:', error.config?.url);
                    break;
                case HTTP_STATUS.INTERNAL_SERVER_ERROR:
                    console.error('❌ Server error:', data?.message || 'Internal server error');
                    break;
                default:
                    console.error(`❌ HTTP Error ${status}:`, data?.message || message);
            }
        } else if (request) {
            // Network error
            console.error('❌ Network error:', message);
        } else {
            // Request setup error
            console.error('❌ Request setup error:', message);
        }

        return Promise.reject(error);
    }
);

/**
 * Handle unauthorized access by clearing tokens and redirecting to login
 */
const handleUnauthorizedError = () => {
    console.warn('⚠️ Unauthorized access - redirecting to login');

    // Clear all stored tokens
    localStorage.clear();
    sessionStorage.clear();

    // Redirect to login page
    if (window.location.pathname !== '/login') {
        window.location.href = '/login';
    }
};

export default apiClient;
