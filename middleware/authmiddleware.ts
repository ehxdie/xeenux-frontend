import axios from 'axios';
import { refreshToken } from '@/api/auth';

const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_API_URL,
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle token refresh
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshTokenValue = localStorage.getItem('refreshToken');

                // Call your existing auth utility function
                const response = await refreshToken({ refreshToken: refreshTokenValue });

                const { token } = response;
                localStorage.setItem('token', token);

                originalRequest.headers.Authorization = `Bearer ${token}`;
                return apiClient(originalRequest);
            } catch (error) {
                localStorage.removeItem('token');
                localStorage.removeItem('refreshToken');
                localStorage.removeItem('user');
                window.location.href = '/login';
                return Promise.reject(error);
            }
        }

        return Promise.reject(error);
    }
);

export default apiClient;