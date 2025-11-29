import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL, API_BASE_URL_PROD, NODE_ENV } from './env';

// Get base URL based on environment
const getBaseURL = () => {
    if (NODE_ENV === 'production') {
        return API_BASE_URL_PROD || 'https://your-production-api.com';
    }
    return API_BASE_URL || 'http://localhost:3000';
};

// Create axios instance
const api = axios.create({
    baseURL: getBaseURL(),
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor
api.interceptors.request.use(
    async (config) => {
        // Get token from AsyncStorage
        const token = await AsyncStorage.getItem('authToken');

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // Handle 401 Unauthorized - token expired or invalid
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            // Clear stored token
            await AsyncStorage.removeItem('authToken');
            await AsyncStorage.removeItem('userData');

            // You can dispatch logout action here or navigate to login
            // This will be handled by AuthContext
        }

        // Handle network errors
        if (!error.response) {
            console.error('Network Error:', error.message);
        }

        return Promise.reject(error);
    }
);

export default api;

