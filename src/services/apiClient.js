import axios from 'axios';
import { getToken } from './AuthService';

const apiClient = axios.create({
    baseURL: 'http://localhost:8080',
    headers: {
        'Content-Type': 'application/json'
    }
});

apiClient.interceptors.request.use(
    (config) => {
        const token = getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response?.status === 401) {
            localStorage.clear();
            sessionStorage.clear();
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default apiClient;
