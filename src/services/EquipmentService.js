import apiClient from './apiClient';

// Constants
const EQUIPMENT_ENDPOINTS = {
    BASE: '/api/equipment',
    BY_ID: (id) => `/api/equipment/${id}`
};

/**
 * Equipment Service
 * Handles all equipment-related API operations
 */
class EquipmentService {
    /**
     * Get all equipment with optional filters
     * @param {Object} filters - Filter options
     * @param {string} filters.category - Filter by equipment category
     * @param {boolean} filters.availableOnly - Show only available equipment
     * @param {string} filters.search - Search by name or description
     * @returns {Promise} API response with equipment list
     */
    static async getAllEquipment(filters = {}) {
        try {
            const { category, availableOnly, search } = filters;
            const params = new URLSearchParams();

            // Build query parameters
            if (category?.trim()) {
                params.append('category', category.trim());
            }

            if (availableOnly !== undefined && availableOnly !== null) {
                params.append('availableOnly', String(availableOnly));
            }

            if (search?.trim()) {
                params.append('search', search.trim());
            }

            const queryString = params.toString();
            const url = queryString
                ? `${EQUIPMENT_ENDPOINTS.BASE}?${queryString}`
                : EQUIPMENT_ENDPOINTS.BASE;

            return await apiClient.get(url);
        } catch (error) {
            console.error('❌ Failed to fetch equipment:', error);
            throw error;
        }
    }

    /**
     * Get equipment by ID
     * @param {number|string} id - Equipment ID
     * @returns {Promise} API response with equipment details
     */
    static async getEquipmentById(id) {
        try {
            if (!id) {
                throw new Error('Equipment ID is required');
            }

            return await apiClient.get(EQUIPMENT_ENDPOINTS.BY_ID(id));
        } catch (error) {
            console.error(`❌ Failed to fetch equipment with ID ${id}:`, error);
            throw error;
        }
    }

    /**
     * Add new equipment
     * @param {Object} equipmentData - Equipment data
     * @param {string} equipmentData.name - Equipment name
     * @param {string} equipmentData.category - Equipment category
     * @param {string} equipmentData.condition - Equipment condition
     * @param {string} equipmentData.description - Equipment description
     * @param {number} equipmentData.totalQuantity - Total quantity
     * @param {number} equipmentData.availableQuantity - Available quantity
     * @param {boolean} equipmentData.availability - Availability status
     * @returns {Promise} API response with created equipment
     */
    static async addEquipment(equipmentData) {
        try {
            // Validate required fields
            this.validateEquipmentData(equipmentData);

            const sanitizedData = this.sanitizeEquipmentData(equipmentData);
            return await apiClient.post(EQUIPMENT_ENDPOINTS.BASE, sanitizedData);
        } catch (error) {
            console.error('❌ Failed to add equipment:', error);
            throw error;
        }
    }

    /**
     * Update existing equipment
     * @param {number|string} id - Equipment ID
     * @param {Object} equipmentData - Updated equipment data
     * @returns {Promise} API response with updated equipment
     */
    static async updateEquipment(id, equipmentData) {
        try {
            if (!id) {
                throw new Error('Equipment ID is required for update');
            }

            // Validate required fields
            this.validateEquipmentData(equipmentData);

            const sanitizedData = this.sanitizeEquipmentData(equipmentData);
            return await apiClient.put(EQUIPMENT_ENDPOINTS.BY_ID(id), sanitizedData);
        } catch (error) {
            console.error(`❌ Failed to update equipment with ID ${id}:`, error);
            throw error;
        }
    }

    /**
     * Delete equipment
     * @param {number|string} id - Equipment ID
     * @returns {Promise} API response
     */
    static async deleteEquipment(id) {
        try {
            if (!id) {
                throw new Error('Equipment ID is required for deletion');
            }

            return await apiClient.delete(EQUIPMENT_ENDPOINTS.BY_ID(id));
        } catch (error) {
            console.error(`❌ Failed to delete equipment with ID ${id}:`, error);
            throw error;
        }
    }

    /**
     * Validate equipment data
     * @param {Object} data - Equipment data to validate
     * @throws {Error} If validation fails
     */
    static validateEquipmentData(data) {
        const requiredFields = ['name', 'category', 'condition'];
        const missingFields = requiredFields.filter(field => !data[field]?.trim());

        if (missingFields.length > 0) {
            throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
        }

        // Validate quantities
        if (data.totalQuantity !== undefined && data.totalQuantity < 1) {
            throw new Error('Total quantity must be at least 1');
        }

        if (data.availableQuantity !== undefined && data.availableQuantity < 0) {
            throw new Error('Available quantity cannot be negative');
        }

        if (data.totalQuantity && data.availableQuantity &&
            data.availableQuantity > data.totalQuantity) {
            throw new Error('Available quantity cannot exceed total quantity');
        }
    }

    /**
     * Sanitize equipment data
     * @param {Object} data - Equipment data to sanitize
     * @returns {Object} Sanitized equipment data
     */
    static sanitizeEquipmentData(data) {
        return {
            name: data.name?.trim(),
            category: data.category?.trim(),
            condition: data.condition?.trim(),
            description: data.description?.trim() || '',
            totalQuantity: parseInt(data.totalQuantity, 10) || 1,
            availableQuantity: parseInt(data.availableQuantity, 10) || 1,
            availability: Boolean(data.availability)
        };
    }

    /**
     * Get available equipment only
     * @returns {Promise} API response with available equipment
     */
    static async getAvailableEquipment() {
        return this.getAllEquipment({ availableOnly: true });
    }

    /**
     * Search equipment by name or description
     * @param {string} searchTerm - Search term
     * @returns {Promise} API response with search results
     */
    static async searchEquipment(searchTerm) {
        if (!searchTerm?.trim()) {
            throw new Error('Search term is required');
        }

        return this.getAllEquipment({ search: searchTerm.trim() });
    }

    /**
     * Get equipment by category
     * @param {string} category - Equipment category
     * @returns {Promise} API response with category equipment
     */
    static async getEquipmentByCategory(category) {
        if (!category?.trim()) {
            throw new Error('Category is required');
        }

        return this.getAllEquipment({ category: category.trim() });
    }
}

// Export individual functions for backward compatibility
export const getAllEquipment = EquipmentService.getAllEquipment;
export const getEquipmentById = EquipmentService.getEquipmentById;
export const addEquipment = EquipmentService.addEquipment;
export const updateEquipment = EquipmentService.updateEquipment;
export const deleteEquipment = EquipmentService.deleteEquipment;

// Export the class for modern usage
export default EquipmentService;
