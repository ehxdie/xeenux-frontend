import axios from "axios";

const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_API_URL, // Set this in your .env.local
});

// Get User Profile
export const getUserProfile = async (token: string) => {
    const response = await apiClient.get("/users/me", {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

// Update User Profile
export const updateUserProfile = async (
    data: { name?: string; phone?: string; walletAddress?: string },
    token: string
) => {
    const response = await apiClient.patch("/users/me", data, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

// Get Dashboard
export const getDashboard = async (token: string) => {
    const response = await apiClient.get("/users/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

// Get Binary Tree
export const getBinaryTree = async (token: string) => {
    const response = await apiClient.get("/users/binary-tree", {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

// Get Team Members
export const getTeamMembers = async (
    teamId: number,
    page: number,
    limit: number,
    token: string
) => {
    const response = await apiClient.get(`/users/team/${teamId}`, {
        params: { page, limit },
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

// Get Activities
export const getActivities = async (
    type: number,
    page: number,
    limit: number,
    token: string
) => {
    const response = await apiClient.get("/users/activities", {
        params: { type, page, limit },
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

// Get User Packages
export const getUserPackages = async (token: string) => {
    const response = await apiClient.get("/users/packages", {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};