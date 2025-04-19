import axios from "axios";

const createApiClient = (token?: string) =>
    axios.create({
        baseURL: process.env.NEXT_PUBLIC_BACKEND_API_URL, // Set this in your .env.local
        headers: {
            Authorization: token ? `Bearer ${token}` : undefined,
        },
    });

// Get My Transactions
export const getMyTransactions = async (
    token: string,
    query: { type?: string; status?: string; page?: number; limit?: number },
) => {
    const apiClient = createApiClient(token);
    const response = await apiClient.get("/transactions", {
        params: { ...query },
    });
    return response.data;
};

// Get Transaction by ID
export const getTransactionById = async (
    token: string,
    transactionId: string,
) => {
    const apiClient = createApiClient(token);
    const response = await apiClient.get(`/transactions/${transactionId}`);
    return response.data;
};

// Deposit Tokens
export const depositTokens = async (
    token: string,
    data: { amount: number; paymentMethod: string },
) => {
    const apiClient = createApiClient(token);
    const response = await apiClient.post("/transactions/deposit", data);
    return response.data;
};

// Request Withdrawal
export const requestWithdrawal = async (
    token: string,
    data: { amount: number; walletAddress: string },
) => {
    const apiClient = createApiClient(token);
    const response = await apiClient.post("/transactions/withdraw", data);
    return response.data;
};

// Get Transaction Stats
export const getTransactionStats = async (token: string) => {
    const apiClient = createApiClient(token);
    const response = await apiClient.get("/transactions/stats/summary");
    return response.data;
};

// Swap Tokens
export const swapTokens = async (
    token: string,
    data: { amount: number; direction: string },
) => {
    const apiClient = createApiClient(token);
    const response = await apiClient.post("/transactions/swap", data);
    return response.data;
};

// Confirm Deposit (Webhook)
export const confirmDeposit = async (
    token: string,
    data: { transactionId: string; status: string; gatewayReference: string },
) => {
    const apiClient = createApiClient(token);
    const response = await apiClient.post("/transactions/confirm-deposit", data);
    return response.data;
};