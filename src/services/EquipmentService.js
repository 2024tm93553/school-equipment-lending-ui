import apiClient from './apiClient';

const EQUIPMENT_API_PATH = '/api/equipment';

export const getAllEquipment = (filters = {}) => {
    const { category, availableOnly, search } = filters;
    const params = new URLSearchParams();

    if (category) params.append('category', category);
    if (availableOnly !== undefined) params.append('availableOnly', availableOnly);
    if (search) params.append('search', search);

    const queryString = params.toString();
    const url = queryString ? `${EQUIPMENT_API_PATH}?${queryString}` : EQUIPMENT_API_PATH;

    return apiClient.get(url);
};

export const getEquipmentById = (id) => apiClient.get(`${EQUIPMENT_API_PATH}/${id}`);
export const addEquipment = (equipment) => apiClient.post(EQUIPMENT_API_PATH, equipment);
export const updateEquipment = (id, equipment) => apiClient.put(`${EQUIPMENT_API_PATH}/${id}`, equipment);
export const deleteEquipment = (id) => apiClient.delete(`${EQUIPMENT_API_PATH}/${id}`);
