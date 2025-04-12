import axios from "axios";

const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_API_URL, // Set this in your .env.local
});

// Get My Transactions
// Query params: type, status, page, limit
export const getMyTransactions = async (
    query: { type?: string; status?: string; page?: number; limit?: number },
    token: string
) => {
    const response = await apiClient.get("/transactions", {
        params: { ...query },
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

// Get Transaction by ID
export const getTransactionById = async (
    transactionId: string,
    token: string
) => {
    const response = await apiClient.get(`/transactions/${transactionId}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

// Deposit Tokens
export const depositTokens = async (
    data: { amount: number; paymentMethod: string },
    token: string
) => {
    const response = await apiClient.post("/transactions/deposit", data, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

// Request Withdrawal
export const requestWithdrawal = async (
    data: { amount: number; walletAddress: string },
    token: string
) => {
    const response = await apiClient.post("/transactions/withdraw", data, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

// Get Transaction Stats
export const getTransactionStats = async (token: string) => {
    const response = await apiClient.get("/transactions/stats/summary", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

// Swap Tokens
export const swapTokens = async (
    data: { amount: number; direction: string },
    token: string
) => {
    const response = await apiClient.post("/transactions/swap", data, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

// Confirm Deposit (Webhook)
export const confirmDeposit = async (data: {
    transactionId: string;
    status: string;
    gatewayReference: string;
}) => {
    const response = await apiClient.post("/transactions/confirm-deposit", data, {
        headers: { "Content-Type": "application/json" },
    });
    return response.data;
};