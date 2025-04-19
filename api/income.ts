import axios from "axios";

const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_API_URL,
});

// Get My Incomes
export const getMyIncomes = async (
    query: { type: string; page?: number; limit?: number }
) => {
    const response = await apiClient.get("/income", {
        params: { ...query },
    });
    return response.data; // Ensure it returns the full payload
};

// Process ROI
export const processROI = async () => {
    const response = await apiClient.post("/income/process-roi", null);
    return response.data;
};

// Process Binary Income
export const processBinaryIncome = async () => {
    const response = await apiClient.post("/income/process-binary", null);
    return response.data;
};

// Withdraw Income
export const withdrawIncome = async (
    data: { amount: number },

) => {
    const response = await apiClient.post("/income/withdraw", data);
    return response.data;
};

// Get Binary Tree
export const getBinaryTree = async (
    params: { depth?: number },

) => {
    const response = await apiClient.get("/binary/tree", {
        params: { ...params },
    });
    return response.data;
};

// Get Binary Legs
export const getBinaryLegs = async () => {
    const response = await apiClient.get("/binary/legs");
    return response.data; // Ensure it returns the full payload
};

// Get Pending Binary Income
export const getPendingBinaryIncome = async () => {
    const response = await apiClient.get("/binary/pending-income");
    return response.data; // Ensure it returns the full payload
};

// Analyze Binary Tree
export const analyzeBinaryTree = async () => {
    const response = await apiClient.get("/binary/analysis");
    return response.data; // Ensure it returns the full payload
};

// Get Autopool Position
export const getAutopoolPosition = async () => {
    const response = await apiClient.get("/autopool/position");
    return response.data;
};

// Get Autopool Income
export const getAutopoolIncome = async (
    query: { page?: number; limit?: number },

) => {
    const response = await apiClient.get("/autopool/income", {
        params: { ...query },
    });
    return response.data;
};

// Get Autopool Team
export const getAutopoolTeam = async () => {
    const response = await apiClient.get("/autopool/team");
    return response.data;
};