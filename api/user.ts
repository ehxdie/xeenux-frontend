import axios from "axios";

const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_API_URL, // Set this in your .env.local
});

// Get User Profile
export const getUserProfile = async () => {
    const response = await apiClient.get("/users/me");
    return response.data;
};

// Update User Profile
export const updateUserProfile = async (
    data: { name?: string; phone?: string; walletAddress?: string }
) => {
    const response = await apiClient.patch("/users/me", data);
    return response.data;
};

// Get Dashboard
export const getDashboard = async () => {
    const response = await apiClient.get("/users/dashboard");
    return response.data;
};

// Get Binary Tree
export const getBinaryTree = async () => {
    const response = await apiClient.get("/users/binary-tree");
    return response.data;
};

// Get Team Members
export const getTeamMembers = async (
    level: number,
    page: number,
    limit: number,
) => {
    const response = await apiClient.get(`/users/team/${level}`, {
        params: { page, limit }
    });
    return response.data;
};

// Get Activities
export const getActivities = async (
    type: number,
    page: number,
    limit: number,
) => {
    const response = await apiClient.get("/users/activities", {
        params: { type, page, limit }
    });
    return response.data;
};

// Get User Packages
export const getUserPackages = async () => {
    const response = await apiClient.get("/users/packages");
    return response.data;
};