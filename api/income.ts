import axios from "axios";

const createApiClient = (token?: string) =>
    axios.create({
        baseURL: process.env.NEXT_PUBLIC_BACKEND_API_URL,
        headers: {
            Authorization: token ? `Bearer ${token}` : undefined,
        },
    });

// Get My Incomes
export const getMyIncomes = async (
    token: string,
    query: { type: string; page?: number; limit?: number },
) => {
    const apiClient = createApiClient(token);
    const response = await apiClient.get("/income", {
        params: { ...query },
    });
    return response.data;
};

// Process ROI
export const processROI = async (token: string) => {
    const apiClient = createApiClient(token);
    const response = await apiClient.post("/income/process-roi", null);
    return response.data;
};

// Process Binary Income
export const processBinaryIncome = async (token: string) => {
    const apiClient = createApiClient(token);
    const response = await apiClient.post("/income/process-binary", null);
    return response.data;
};

// Withdraw Income
export const withdrawIncome = async (
    token: string,
    data: { amount: number },
) => {
    const apiClient = createApiClient(token);
    const response = await apiClient.post("/income/withdraw", data);
    return response.data;
};

// Get Binary Tree
export const getBinaryTree = async (
    token: string,
    params: { depth?: number },
) => {
    const apiClient = createApiClient(token);
    const response = await apiClient.get("/binary/tree", {
        params: { ...params },
    });
    return response.data;
};

// Get Binary Legs
export const getBinaryLegs = async (token: string) => {
    const apiClient = createApiClient(token);
    const response = await apiClient.get("/binary/legs");
    return response.data;
};

// Get Pending Binary Income
export const getPendingBinaryIncome = async (token: string) => {
    const apiClient = createApiClient(token);
    const response = await apiClient.get("/binary/pending-income");
    return response.data;
};

// Analyze Binary Tree
export const analyzeBinaryTree = async (token: string) => {
    const apiClient = createApiClient(token);
    const response = await apiClient.get("/binary/analysis");
    return response.data;
};

// Get Autopool Position
export const getAutopoolPosition = async (token: string) => {
    const apiClient = createApiClient(token);
    const response = await apiClient.get("/autopool/position");
    return response.data;
};

// Get Autopool Income
export const getAutopoolIncome = async (
    token: string,
    query: { page?: number; limit?: number },
) => {
    const apiClient = createApiClient(token);
    const response = await apiClient.get("/autopool/income", {
        params: { ...query },
    });
    return response.data;
};

// Get Autopool Team
export const getAutopoolTeam = async (token: string) => {
    const apiClient = createApiClient(token);
    const response = await apiClient.get("/autopool/team");
    return response.data;
};