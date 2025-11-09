import apiClient from './apiClient';

const REQUESTS_API_PATH = '/api/requests';

export const createBorrowRequest = (requestData) =>
    apiClient.post(REQUESTS_API_PATH, requestData);

export const getMyRequests = () =>
    apiClient.get(`${REQUESTS_API_PATH}/my`);

export const getAllRequests = (status = null, userId = null) => {
    let url = REQUESTS_API_PATH;
    const params = new URLSearchParams();

    if (status) params.append('status', status);
    if (userId) params.append('userId', userId);

    if (params.toString()) {
        url += `?${params.toString()}`;
    }

    return apiClient.get(url);
};

export const approveRequest = (id, approvalData) =>
    apiClient.put(`${REQUESTS_API_PATH}/${id}/approve`, approvalData);

export const rejectRequest = (id, rejectionData) =>
    apiClient.put(`${REQUESTS_API_PATH}/${id}/reject`, rejectionData);

export const markAsReturned = (id, returnData) =>
    apiClient.put(`${REQUESTS_API_PATH}/${id}/return`, returnData);
