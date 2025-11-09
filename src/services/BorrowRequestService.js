import apiClient from './apiClient';

// Constants
const REQUEST_ENDPOINTS = {
    BASE: '/api/requests',
    MY_REQUESTS: '/api/requests/my',
    PENDING: '/api/requests/pending',
    BY_ID: (id) => `/api/requests/${id}`,
    APPROVE: (id) => `/api/requests/${id}/approve`,
    REJECT: (id) => `/api/requests/${id}/reject`,
    RETURN: (id) => `/api/requests/${id}/return`
};

const REQUEST_STATUS = {
    PENDING: 'PENDING',
    APPROVED: 'APPROVED',
    REJECTED: 'REJECTED',
    RETURNED: 'RETURNED'
};

/**
 * Borrow Request Service
 * Handles all borrow request-related API operations
 */
class BorrowRequestService {
    /**
     * Create a new borrow request
     * @param {Object} requestData - Request data
     * @param {number} requestData.equipmentId - Equipment ID
     * @param {number} requestData.quantity - Requested quantity
     * @param {string} requestData.fromDate - Start date (YYYY-MM-DD)
     * @param {string} requestData.toDate - End date (YYYY-MM-DD)
     * @param {string} requestData.reason - Reason for borrowing
     * @returns {Promise} API response with created request
     */
    static async createBorrowRequest(requestData) {
        try {
            // Validate request data
            this.validateRequestData(requestData);

            const sanitizedData = this.sanitizeRequestData(requestData);
            return await apiClient.post(REQUEST_ENDPOINTS.BASE, sanitizedData);
        } catch (error) {
            console.error('❌ Failed to create borrow request:', error);
            throw error;
        }
    }

    /**
     * Get request by ID
     * @param {number|string} id - Request ID
     * @returns {Promise} API response with request details
     */
    static async getRequestById(id) {
        try {
            if (!id) {
                throw new Error('Request ID is required');
            }

            return await apiClient.get(REQUEST_ENDPOINTS.BY_ID(id));
        } catch (error) {
            console.error(`❌ Failed to fetch request with ID ${id}:`, error);
            throw error;
        }
    }

    /**
     * Get current user's requests
     * @returns {Promise} API response with user's requests
     */
    static async getMyRequests() {
        try {
            return await apiClient.get(REQUEST_ENDPOINTS.MY_REQUESTS);
        } catch (error) {
            console.error('❌ Failed to fetch user requests:', error);
            throw error;
        }
    }

    /**
     * Get pending requests (admin/staff only)
     * @returns {Promise} API response with pending requests
     */
    static async getPendingRequests() {
        try {
            return await apiClient.get(REQUEST_ENDPOINTS.PENDING);
        } catch (error) {
            console.error('❌ Failed to fetch pending requests:', error);
            throw error;
        }
    }

    /**
     * Get all requests with optional filters (admin/staff only)
     * @param {Object} filters - Filter options
     * @param {string} filters.status - Filter by request status
     * @param {number} filters.userId - Filter by user ID
     * @returns {Promise} API response with filtered requests
     */
    static async getAllRequests(filters = {}) {
        try {
            const { status, userId } = filters;
            const params = new URLSearchParams();

            // Build query parameters
            if (status && Object.values(REQUEST_STATUS).includes(status)) {
                params.append('status', status);
            }

            if (userId) {
                params.append('userId', String(userId));
            }

            const queryString = params.toString();
            const url = queryString
                ? `${REQUEST_ENDPOINTS.BASE}?${queryString}`
                : REQUEST_ENDPOINTS.BASE;

            return await apiClient.get(url);
        } catch (error) {
            console.error('❌ Failed to fetch requests:', error);
            throw error;
        }
    }

    /**
     * Approve a borrow request (admin/staff only)
     * @param {number|string} id - Request ID
     * @param {Object} approvalData - Approval data
     * @param {number} approvalData.approvedBy - ID of approver
     * @param {string} approvalData.remarks - Approval remarks
     * @returns {Promise} API response with approved request
     */
    static async approveRequest(id, approvalData) {
        try {
            if (!id) {
                throw new Error('Request ID is required for approval');
            }

            // Validate approval data
            this.validateApprovalData(approvalData);

            const sanitizedData = this.sanitizeApprovalData(approvalData);
            return await apiClient.put(REQUEST_ENDPOINTS.APPROVE(id), sanitizedData);
        } catch (error) {
            console.error(`❌ Failed to approve request with ID ${id}:`, error);
            throw error;
        }
    }

    /**
     * Reject a borrow request (admin/staff only)
     * @param {number|string} id - Request ID
     * @param {Object} rejectionData - Rejection data
     * @param {string} rejectionData.remarks - Rejection reason
     * @returns {Promise} API response with rejected request
     */
    static async rejectRequest(id, rejectionData) {
        try {
            if (!id) {
                throw new Error('Request ID is required for rejection');
            }

            const sanitizedData = {
                remarks: rejectionData.remarks?.trim() || 'Request rejected'
            };

            return await apiClient.put(REQUEST_ENDPOINTS.REJECT(id), sanitizedData);
        } catch (error) {
            console.error(`❌ Failed to reject request with ID ${id}:`, error);
            throw error;
        }
    }

    /**
     * Mark request as returned (admin/staff only)
     * @param {number|string} id - Request ID
     * @param {Object} returnData - Return data
     * @param {string} returnData.returnDate - Return date (YYYY-MM-DD)
     * @param {string} returnData.conditionAfterUse - Equipment condition after use
     * @returns {Promise} API response with returned request
     */
    static async markAsReturned(id, returnData) {
        try {
            if (!id) {
                throw new Error('Request ID is required for return');
            }

            // Validate return data
            this.validateReturnData(returnData);

            const sanitizedData = this.sanitizeReturnData(returnData);
            return await apiClient.put(REQUEST_ENDPOINTS.RETURN(id), sanitizedData);
        } catch (error) {
            console.error(`❌ Failed to mark request ${id} as returned:`, error);
            throw error;
        }
    }

    /**
     * Validate request data
     * @param {Object} data - Request data to validate
     * @throws {Error} If validation fails
     */
    static validateRequestData(data) {
        const requiredFields = ['equipmentId', 'quantity', 'fromDate', 'toDate'];
        const missingFields = requiredFields.filter(field =>
            data[field] === undefined || data[field] === null || data[field] === ''
        );

        if (missingFields.length > 0) {
            throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
        }

        // Validate quantity
        if (data.quantity < 1) {
            throw new Error('Quantity must be at least 1');
        }

        // Validate dates
        const fromDate = new Date(data.fromDate);
        const toDate = new Date(data.toDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (fromDate < today) {
            throw new Error('From date cannot be in the past');
        }

        if (toDate <= fromDate) {
            throw new Error('To date must be after from date');
        }
    }

    /**
     * Sanitize request data
     * @param {Object} data - Request data to sanitize
     * @returns {Object} Sanitized request data
     */
    static sanitizeRequestData(data) {
        return {
            equipmentId: parseInt(data.equipmentId, 10),
            quantity: parseInt(data.quantity, 10),
            fromDate: data.fromDate,
            toDate: data.toDate,
            reason: data.reason?.trim() || ''
        };
    }

    /**
     * Validate approval data
     * @param {Object} data - Approval data to validate
     * @throws {Error} If validation fails
     */
    static validateApprovalData(data) {
        if (!data.approvedBy) {
            throw new Error('Approver ID is required');
        }
    }

    /**
     * Sanitize approval data
     * @param {Object} data - Approval data to sanitize
     * @returns {Object} Sanitized approval data
     */
    static sanitizeApprovalData(data) {
        return {
            approvedBy: parseInt(data.approvedBy, 10),
            remarks: data.remarks?.trim() || 'Request approved'
        };
    }

    /**
     * Validate return data
     * @param {Object} data - Return data to validate
     * @throws {Error} If validation fails
     */
    static validateReturnData(data) {
        if (!data.returnDate) {
            throw new Error('Return date is required');
        }

        const returnDate = new Date(data.returnDate);
        const today = new Date();

        if (returnDate > today) {
            throw new Error('Return date cannot be in the future');
        }
    }

    /**
     * Sanitize return data
     * @param {Object} data - Return data to sanitize
     * @returns {Object} Sanitized return data
     */
    static sanitizeReturnData(data) {
        return {
            returnDate: data.returnDate,
            conditionAfterUse: data.conditionAfterUse?.trim() || 'No condition notes provided'
        };
    }

    /**
     * Get requests by status
     * @param {string} status - Request status
     * @returns {Promise} API response with filtered requests
     */
    static async getRequestsByStatus(status) {
        if (!Object.values(REQUEST_STATUS).includes(status)) {
            throw new Error(`Invalid status: ${status}`);
        }

        return this.getAllRequests({ status });
    }

    /**
     * Get user's requests by status
     * @param {number} userId - User ID
     * @param {string} status - Request status (optional)
     * @returns {Promise} API response with user's filtered requests
     */
    static async getUserRequests(userId, status = null) {
        if (!userId) {
            throw new Error('User ID is required');
        }

        const filters = { userId };
        if (status && Object.values(REQUEST_STATUS).includes(status)) {
            filters.status = status;
        }

        return this.getAllRequests(filters);
    }
}

// Export individual functions for backward compatibility
export const createBorrowRequest = BorrowRequestService.createBorrowRequest;
export const getRequestById = BorrowRequestService.getRequestById;
export const getMyRequests = BorrowRequestService.getMyRequests;
export const getPendingRequests = BorrowRequestService.getPendingRequests;
export const getAllRequests = (status = null, userId = null) =>
    BorrowRequestService.getAllRequests({ status, userId });
export const approveRequest = BorrowRequestService.approveRequest;
export const rejectRequest = BorrowRequestService.rejectRequest;
export const markAsReturned = BorrowRequestService.markAsReturned;

// Export constants
export { REQUEST_STATUS };

// Export the class for modern usage
export default BorrowRequestService;
