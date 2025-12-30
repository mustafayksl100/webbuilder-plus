import axios from 'axios';
import { useAuthStore } from '../store/authStore';

// API Base URL - Production uses Render, Development uses Vite proxy
const API_BASE_URL = import.meta.env.PROD
    ? 'https://webbuilder-plus.onrender.com/api'
    : '/api';

// Create axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = useAuthStore.getState().token;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle 401 Unauthorized and 403 Forbidden
        if (error.response?.status === 401 || error.response?.status === 403) {
            console.log('Session expired or invalid, logging out...');
            useAuthStore.getState().logout();
            window.location.href = '/login';
        }

        // Extract error message
        const message = error.response?.data?.message || error.message || 'Bir hata oluştu';
        error.message = message;

        return Promise.reject(error);
    }
);

export default api;
