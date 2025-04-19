import axios from "axios";

// Create an API client factory function
const createApiClient = (token?: string) =>
    axios.create({
        baseURL: process.env.NEXT_PUBLIC_BACKEND_API_URL, // Set this in your .env.local
        headers: {
            Authorization: token ? `Bearer ${token}` : undefined,
        },
    });

// Get User Profile
export const getUserProfile = async (token: string) => {
    const apiClient = createApiClient(token);
    const response = await apiClient.get("/users/me");
    return response.data;
};

// Update User Profile
export const updateUserProfile = async (
    token: string,
    data: { name?: string; phone?: string; walletAddress?: string }
) => {
    const apiClient = createApiClient(token);
    const response = await apiClient.patch("/users/me", data);
    return response.data;
};

// Get Dashboard
export const getDashboard = async (token: string) => {
    const apiClient = createApiClient(token);
    const response = await apiClient.get("/users/dashboard");
    return response.data;
};

// Get Binary Tree
export const getBinaryTree = async (token: string) => {
    const apiClient = createApiClient(token);
    const response = await apiClient.get("/users/binary-tree");
    return response.data;
};

// Get Team Members
export const getTeamMembers = async (
    token: string,
    level: number,
    page: number,
    limit: number
) => {
    const apiClient = createApiClient(token);
    const response = await apiClient.get(`/users/team/${level}`, {
        params: { page, limit },
    });
    return response.data;
};

// Get Activities
export const getActivities = async (
    token: string,
    type: number,
    page: number,
    limit: number
) => {
    const apiClient = createApiClient(token);
    const response = await apiClient.get("/users/activities", {
        params: { type, page, limit },
    });
    return response.data;
};

// Get User Packages
export const getUserPackages = async (token: string) => {
    const apiClient = createApiClient(token);
    const response = await apiClient.get("/users/packages");
    return response.data;
};