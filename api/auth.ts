import axios from "axios";

const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_API_URL, // Set in your .env.local
});

// Register a new user
export const registerUser = async (data: {
    name: string;
    email: string;
    phone: string;
    password: string;
    walletAddress: string;
    referrerId: number;
    position: number; // 0 for left, 1 for right
}) => {
    const response = await apiClient.post("/auth/register", data);
    return response.data;
};

// Login user
export const loginUser = async (data: {
    email: string;
    password: string;
}) => {
    const response = await apiClient.post("/auth/login", data);
    return response.data;
};

// Refresh token
export const refreshToken = async (data: { refreshToken: string | null }) => {
    const response = await apiClient.post("/auth/refresh-token", data);
    return response.data;
};

// Forgot password
export const forgotPassword = async (data: { email: string }) => {
    const response = await apiClient.post("/auth/forgot-password", data);
    return response.data;
};

// Reset password
export const resetPassword = async (token: string, data: { password: string }) => {
    const response = await apiClient.post(`/auth/reset-password/${token}`, data);
    return response.data;
};

// Update password (requires JWT)
export const updatePassword = async (
    data: { currentPassword: string; newPassword: string },
    token: string
) => {
    const response = await apiClient.patch("/auth/update-password", data, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};