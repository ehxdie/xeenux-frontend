import axios from "axios";

const createApiClient = (token?: string) =>
    axios.create({
        baseURL: process.env.NEXT_PUBLIC_BACKEND_API_URL, // Set this in your .env.local
        headers: {
            Authorization: token ? `Bearer ${token}` : undefined,
        },
    });

// Get Dashboard Stats
export const getDashboardStats = async (token: string) => {
    const apiClient = createApiClient(token);
    const response = await apiClient.get("/admin/dashboard");
    return response.data;
};

// Get Settings (optionally filter by group)
export const getSettings = async (token: string, group: string) => {
    const apiClient = createApiClient(token);
    const response = await apiClient.get("/admin/settings", {
        params: { group },
    });
    return response.data;
};

// Update Settings
export const updateSettings = async (
    token: string,
    data: { key: string; value: any; group: string; description: string },
) => {
    const apiClient = createApiClient(token);
    const response = await apiClient.patch("/admin/settings", data, {
        headers: {
            "Content-Type": "application/json",
        },
    });
    return response.data;
};

// Initialize Settings
export const initializeSettings = async (token: string) => {
    const apiClient = createApiClient(token);
    const response = await apiClient.post("/admin/settings/initialize", null);
    return response.data;
};

// Search Users
export const searchUsers = async (token: string, query: string, field: string) => {
    const apiClient = createApiClient(token);
    const response = await apiClient.get("/admin/users/search", {
        params: { query, field },
    });
    return response.data;
};

// Get User Transactions by User ID
export const getUserTransactions = async (
    token: string,
    userId: string,
    params: { type?: string; page?: number; limit?: number },
) => {
    const apiClient = createApiClient(token);
    const response = await apiClient.get(`/admin/users/${userId}/transactions`, {
        params,
    });
    return response.data;
};

// Get User Activities by User ID
export const getUserActivities = async (
    token: string,
    userId: string,
    params: { type?: number; page?: number; limit?: number },
) => {
    const apiClient = createApiClient(token);
    const response = await apiClient.get(`/admin/users/${userId}/activities`, {
        params,
    });
    return response.data;
};

// Add User Balance
export const addUserBalance = async (
    token: string,
    data: { userId: string; amount: number; type: string; description: string },
) => {
    const apiClient = createApiClient(token);
    const response = await apiClient.post("/admin/users/balance", data, {
        headers: {
            "Content-Type": "application/json",
        },
    });
    return response.data;
};

// Update User Rank
export const updateUserRank = async (
    token: string,
    data: { userId: string; rank: number },
) => {
    const apiClient = createApiClient(token);
    const response = await apiClient.patch("/admin/users/rank", data, {
        headers: {
            "Content-Type": "application/json",
        },
    });
    return response.data;
};

// Get Recent Transactions
export const getRecentTransactions = async (
    token: string,
    params: { type: string; status: string; page?: number; limit?: number },
) => {
    const apiClient = createApiClient(token);
    const response = await apiClient.get("/admin/transactions/recent", {
        params,
    });
    return response.data;
};

// Process Scheduled Task
export const processScheduledTask = async (token: string, task: string) => {
    const apiClient = createApiClient(token);
    const response = await apiClient.post(
        "/admin/scheduler",
        { task },
        {
            headers: {
                "Content-Type": "application/json",
            },
        },
    );
    return response.data;
};

// Get System Logs
export const getSystemLogs = async (
    token: string,
    params: { page?: number; limit?: number },
) => {
    const apiClient = createApiClient(token);
    const response = await apiClient.get("/admin/logs", {
        params,
    });
    return response.data;
};

// Generate Report
export const generateReport = async (
    token: string,
    data: { type: string; startDate: string; endDate: string },
) => {
    const apiClient = createApiClient(token);
    const response = await apiClient.post("/admin/reports", data, {
        headers: {
            "Content-Type": "application/json",
        },
    });
    return response.data;
};

// Process Withdrawal (Admin approval)
export const processWithdrawal = async (
    token: string,
    data: { transactionId: string; status: string; remarks: string },
) => {
    const apiClient = createApiClient(token);
    const response = await apiClient.post("/transactions/process-withdrawal", data, {
        headers: {
            "Content-Type": "application/json",
        },
    });
    return response.data;
};

// Create Package (Admin)
export const createPackage = async (
    token: string,
    data: {
        name: string;
        priceUSD: number;
        description: string;
        packageIndex: number;
        maxROIMultiplier: number;
        features: string[];
    },
) => {
    const apiClient = createApiClient(token);
    const response = await apiClient.post("/packages", data, {
        headers: {
            "Content-Type": "application/json",
        },
    });
    return response.data;
};

// Update Package (Admin)
export const updatePackage = async (
    token: string,
    packageId: number,
    data: {
        name?: string;
        priceUSD?: number;
        description?: string;
        maxROIMultiplier?: number;
        features?: string[];
        isActive?: boolean;
    },
) => {
    const apiClient = createApiClient(token);
    const response = await apiClient.patch(`/packages/${packageId}`, data, {
        headers: {
            "Content-Type": "application/json",
        },
    });
    return response.data;
};

// Delete Package (Admin)
export const deletePackage = async (token: string, packageId: number) => {
    const apiClient = createApiClient(token);
    const response = await apiClient.delete(`/packages/${packageId}`);
    return response.data;
};