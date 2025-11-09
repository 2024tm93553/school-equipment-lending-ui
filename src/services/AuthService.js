import axios from 'axios';

// Constants
const AUTH_CONFIG = {
    BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:8080',
    ENDPOINTS: {
        SIGNUP: '/api/auth/signup',
        LOGIN: '/api/auth/login'
    }
};

const STORAGE_KEYS = {
    TOKEN: 'authToken',
    USER: 'authenticatedUser',
    USER_ROLE: 'userRole',
    USER_ID: 'userId',
    FULL_NAME: 'fullName'
};

/**
 * Authentication Service
 * Handles all authentication-related API calls and local storage operations
 */
class AuthService {
    /**
     * Register a new user
     * @param {Object} userData - User registration data
     * @param {string} userData.fullName - User's full name
     * @param {string} userData.username - Username
     * @param {string} userData.email - Email address
     * @param {string} userData.password - Password
     * @param {string} userData.role - User role (STUDENT, TEACHER)
     * @returns {Promise} API response
     */
    static async register(userData) {
        try {
            const response = await axios.post(
                `${AUTH_CONFIG.BASE_URL}${AUTH_CONFIG.ENDPOINTS.SIGNUP}`,
                userData,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
            return response;
        } catch (error) {
            console.error('❌ Registration failed:', error);
            throw error;
        }
    }

    /**
     * Login user with credentials
     * @param {string} username - Username
     * @param {string} password - Password
     * @returns {Promise} API response with user data and token
     */
    static async login(username, password) {
        try {
            const response = await axios.post(
                `${AUTH_CONFIG.BASE_URL}${AUTH_CONFIG.ENDPOINTS.LOGIN}`,
                { username, password },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
            return response;
        } catch (error) {
            console.error('❌ Login failed:', error);
            throw error;
        }
    }

    /**
     * Store authentication token in localStorage
     * @param {string} token - JWT token
     */
    static storeToken(token) {
        if (!token) {
            console.warn('⚠️ Attempted to store empty token');
            return;
        }
        localStorage.setItem(STORAGE_KEYS.TOKEN, token);
    }

    /**
     * Get authentication token from localStorage
     * @returns {string|null} JWT token or null if not found
     */
    static getToken() {
        return localStorage.getItem(STORAGE_KEYS.TOKEN);
    }

    /**
     * Store user information in sessionStorage
     * @param {Object} userInfo - User information object
     * @param {string} userInfo.username - Username
     * @param {string} userInfo.role - User role
     * @param {string} userInfo.fullName - Full name
     * @param {number} userInfo.userId - User ID
     */
    static saveUserInfo(userInfo) {
        const { username, role, fullName, userId } = userInfo;

        if (username) sessionStorage.setItem(STORAGE_KEYS.USER, username);
        if (role) localStorage.setItem(STORAGE_KEYS.USER_ROLE, role);
        if (fullName) localStorage.setItem(STORAGE_KEYS.FULL_NAME, fullName);
        if (userId) localStorage.setItem(STORAGE_KEYS.USER_ID, userId.toString());
    }

    /**
     * Get logged-in username
     * @returns {string|null} Username or null if not logged in
     */
    static getLoggedInUser() {
        return sessionStorage.getItem(STORAGE_KEYS.USER);
    }

    /**
     * Get user role
     * @returns {string|null} User role or null if not found
     */
    static getUserRole() {
        return localStorage.getItem(STORAGE_KEYS.USER_ROLE);
    }

    /**
     * Get user's full name
     * @returns {string|null} Full name or null if not found
     */
    static getFullName() {
        return localStorage.getItem(STORAGE_KEYS.FULL_NAME);
    }

    /**
     * Get user ID
     * @returns {number|null} User ID or null if not found
     */
    static getUserId() {
        const userId = localStorage.getItem(STORAGE_KEYS.USER_ID);
        return userId ? parseInt(userId, 10) : null;
    }

    /**
     * Check if user is logged in
     * @returns {boolean} True if user is logged in, false otherwise
     */
    static isUserLoggedIn() {
        const username = sessionStorage.getItem(STORAGE_KEYS.USER);
        const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
        return Boolean(username && token);
    }

    /**
     * Check if user has admin privileges
     * @returns {boolean} True if user is admin or teacher
     */
    static isAdmin() {
        const role = this.getUserRole();
        return role === 'ADMIN' || role === 'TEACHER';
    }

    /**
     * Check if user is a student
     * @returns {boolean} True if user is a student
     */
    static isStudent() {
        const role = this.getUserRole();
        return role === 'STUDENT';
    }

    /**
     * Logout user by clearing all stored data
     */
    static logout() {
        // Clear all authentication data
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER_ROLE);
        localStorage.removeItem(STORAGE_KEYS.FULL_NAME);
        localStorage.removeItem(STORAGE_KEYS.USER_ID);
        sessionStorage.removeItem(STORAGE_KEYS.USER);

        console.log('✅ User logged out successfully');
    }

    /**
     * Clear all storage (for complete cleanup)
     */
    static clearAllStorage() {
        localStorage.clear();
        sessionStorage.clear();
        console.log('✅ All storage cleared');
    }
}

// Export individual functions for backward compatibility
export const registerAPICall = AuthService.register;
export const loginAPICall = AuthService.login;
export const storeToken = AuthService.storeToken;
export const getToken = AuthService.getToken;
export const saveLoggedInUser = (username) => AuthService.saveUserInfo({ username });
export const getLoggedInUser = AuthService.getLoggedInUser;
export const isUserLoggedIn = AuthService.isUserLoggedIn;
export const logout = AuthService.logout;

// Export the class for modern usage
export default AuthService;
