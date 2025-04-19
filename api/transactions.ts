import axios from "axios";

const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_API_URL, // Set this in your .env.local
});

// Get My Transactions
// Query params: type, status, page, limit
export const getMyTransactions = async (
    query: { type?: string; status?: string; page?: number; limit?: number },
) => {
    const response = await apiClient.get("/transactions", {
        params: { ...query },
    });
    return response.data;
};

// Get Transaction by ID
export const getTransactionById = async (
    transactionId: string,
) => {
    const response = await apiClient.get(`/transactions/${transactionId}`);
    return response.data;
};

// Deposit Tokens
export const depositTokens = async (
    data: { amount: number; paymentMethod: string },
) => {
    const response = await apiClient.post("/transactions/deposit", data);
    return response.data;
};

// Request Withdrawal
export const requestWithdrawal = async (
    data: { amount: number; walletAddress: string },

) => {
    const response = await apiClient.post("/transactions/withdraw", data);
    return response.data;
};

// Get Transaction Stats
export const getTransactionStats = async () => {
    const response = await apiClient.get("/transactions/stats/summary");
    return response.data;
};

// Swap Tokens
export const swapTokens = async (
    data: { amount: number; direction: string },
   
) => {
    const response = await apiClient.post("/transactions/swap", data);
    return response.data;
};

// Confirm Deposit (Webhook)
export const confirmDeposit = async (data: {
    transactionId: string;
    status: string;
    gatewayReference: string;
}) => {
    const response = await apiClient.post("/transactions/confirm-deposit", data);
    return response.data;
};