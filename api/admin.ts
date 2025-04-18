import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_API_URL, // Set this in your .env.local
});

// All admin routes require an admin token in the Authorization header

// Get Dashboard Stats
export const getDashboardStats = async (adminToken: string) => {
  const response = await apiClient.get("/admin/dashboard", {
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  return response.data;
};

// Get Settings (optionally filter by group)
export const getSettings = async (group: string, adminToken: string) => {
  const response = await apiClient.get("/admin/settings", {
    params: { group },
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  return response.data;
};

// Update Settings
export const updateSettings = async (
  data: { key: string; value: any; group: string; description: string },
  adminToken: string
) => {
  const response = await apiClient.patch("/admin/settings", data, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${adminToken}`,
    },
  });
  return response.data;
};

// Initialize Settings
export const initializeSettings = async (adminToken: string) => {
  const response = await apiClient.post("/admin/settings/initialize", null, {
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  return response.data;
};

// Search Users
export const searchUsers = async (
  query: string,
  field: string,
  adminToken: string
) => {
  const response = await apiClient.get("/admin/users/search", {
    params: { query, field },
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  return response.data;
};

// Get User Transactions by User ID
export const getUserTransactions = async (
  userId: string,
  params: { type?: string; page?: number; limit?: number },
  adminToken: string
) => {
  const response = await apiClient.get(`/admin/users/${userId}/transactions`, {
    params,
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  return response.data;
};

// Get User Activities by User ID
export const getUserActivities = async (
  userId: string,
  params: { type?: number; page?: number; limit?: number },
  adminToken: string
) => {
  const response = await apiClient.get(`/admin/users/${userId}/activities`, {
    params,
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  return response.data;
};

// Add User Balance
export const addUserBalance = async (
  data: { userId: string; amount: number; type: string; description: string },
  adminToken: string
) => {
  const response = await apiClient.post("/admin/users/balance", data, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${adminToken}`,
    },
  });
  return response.data;
};

// Update User Rank
export const updateUserRank = async (
  data: { userId: string; rank: number },
  adminToken: string
) => {
  const response = await apiClient.patch("/admin/users/rank", data, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${adminToken}`,
    },
  });
  return response.data;
};

// Get Recent Transactions
export const getRecentTransactions = async (
  params: { type: string; status: string; page?: number; limit?: number },
  adminToken: string
) => {
  const response = await apiClient.get("/admin/transactions/recent", {
    params,
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  return response.data;
};

// Process Scheduled Task
export const processScheduledTask = async (
  task: string,
  adminToken: string
) => {
  const response = await apiClient.post(
    "/admin/scheduler",
    { task },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
    }
  );
  return response.data;
};

// Get System Logs
export const getSystemLogs = async (
  params: { page?: number; limit?: number },
  adminToken: string
) => {
  const response = await apiClient.get("/admin/logs", {
    params,
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  return response.data;
};

// Generate Report
export const generateReport = async (
  data: { type: string; startDate: string; endDate: string },
  adminToken: string
) => {
  const response = await apiClient.post("/admin/reports", data, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${adminToken}`,
    },
  });
  return response.data;
};

// Process Withdrawal (Admin approval)
export const processWithdrawal = async (
  data: { transactionId: string; status: string; remarks: string },
  adminToken: string
) => {
  const response = await apiClient.post("/transactions/process-withdrawal", data, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${adminToken}`,
    },
  });
  return response.data;
};

// Create Package (Admin)
export const createPackage = async (
  data: {
    name: string;
    priceUSD: number;
    description: string;
    packageIndex: number;
    maxROIMultiplier: number;
    features: string[];
  },
  adminToken: string
) => {
  const response = await apiClient.post("/packages", data, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${adminToken}`,
    },
  });
  return response.data;
};

// Update Package (Admin)
export const updatePackage = async (
  packageId: number,
  data: {
    name?: string;
    priceUSD?: number;
    description?: string;
    maxROIMultiplier?: number;
    features?: string[];
    isActive?: boolean;
  },
  adminToken: string
) => {
  const response = await apiClient.patch(`/packages/${packageId}`, data, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${adminToken}`,
    },
  });
  return response.data;
};

// Delete Package (Admin)
export const deletePackage = async (
  packageId: number,
  adminToken: string
) => {
  const response = await apiClient.delete(`/packages/${packageId}`, {
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  return response.data;
};