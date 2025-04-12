import axios from "axios";

const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_API_URL,
});

// Get My Incomes
export const getMyIncomes = async (
    query: { type: string; page?: number; limit?: number },
    token: string
) => {
    const response = await apiClient.get("/income", {
        params: { ...query },
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

// Process ROI
export const processROI = async (token: string) => {
    const response = await apiClient.post("/income/process-roi", null, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

// Process Binary Income
export const processBinaryIncome = async (token: string) => {
    const response = await apiClient.post("/income/process-binary", null, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

// Withdraw Income
export const withdrawIncome = async (
    data: { amount: number },
    token: string
) => {
    const response = await apiClient.post("/income/withdraw", data, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

// Get Binary Tree
export const getBinaryTree = async (
    params: { depth?: number },
    token: string
) => {
    const response = await apiClient.get("/binary/tree", {
        params: { ...params },
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

// Get Binary Legs
export const getBinaryLegs = async (token: string) => {
    const response = await apiClient.get("/binary/legs", {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

// Get Pending Binary Income
export const getPendingBinaryIncome = async (token: string) => {
    const response = await apiClient.get("/binary/pending-income", {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

// Analyze Binary Tree
export const analyzeBinaryTree = async (token: string) => {
    const response = await apiClient.get("/binary/analysis", {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

// Get Autopool Position
export const getAutopoolPosition = async (token: string) => {
    const response = await apiClient.get("/autopool/position", {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

// Get Autopool Income
export const getAutopoolIncome = async (
    query: { page?: number; limit?: number },
    token: string
) => {
    const response = await apiClient.get("/autopool/income", {
        params: { ...query },
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

// Get Autopool Team
export const getAutopoolTeam = async (token: string) => {
    const response = await apiClient.get("/autopool/team", {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};