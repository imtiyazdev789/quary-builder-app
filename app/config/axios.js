import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Create axios instance
const api = axios.create({
    baseURL: process.env.EXPO_PUBLIC_API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

console.log('API Base URL:', process.env.EXPO_PUBLIC_API_BASE_URL);

// Request interceptor - adds auth token to requests
api.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor - handles 401 and network errors
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Handle 401 Unauthorized
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            await AsyncStorage.removeItem('authToken');
            await AsyncStorage.removeItem('userData');
        }

        // Log network errors
        if (!error.response) {
            console.error('Network Error:', error.message);
        }

        return Promise.reject(error);
    }
);

export default api;
