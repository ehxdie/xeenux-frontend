import { useState } from "react";
import {
    getMyTransactions,
    getTransactionById,
    depositTokens,
    requestWithdrawal,
    getTransactionStats,
    swapTokens,
    confirmDeposit
} from "@/api/transactions";
import { notification } from "@/utils/scaffold-eth/notification";

interface Transaction {
    _id: string;
    userId: number;
    user: string;
    type: string;
    amount: number;
    amountUSD: number;
    fee: number;
    status: string;
    description: string;
    walletAddress: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

interface Pagination {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

interface GetMyTransactionsResponse {
    status: string;
    data: {
        transactions: Transaction[];
        pagination: Pagination;
    };
}

interface GetTransactionByIdResponse {
    status: string;
    data: Transaction;
}

interface DepositTransaction extends Transaction {
    meta: {
        paymentMethod: string;
        xeenuxPrice: number;
    };
}

interface PaymentInfo {
    gatewayUrl: string;
    transactionId: string;
    amount: number;
    currency: string;
}

interface DepositTokensResponse {
    status: string;
    data: {
        transaction: DepositTransaction;
        paymentInfo: PaymentInfo;
    };
}

interface WithdrawalTransaction extends Transaction {
    meta: {
        finalAmount: number;
        feePercentage: number;
        xeenuxPrice: number;
    };
}

interface RequestWithdrawalResponse {
    status: string;
    data: {
        transaction: WithdrawalTransaction;
        fee: number;
        finalAmount: number;
        status: string;
    };
}

interface TransactionStats {
    totalDeposits: number;
    totalWithdrawals: number;
    totalPurchases: number;
    pendingDeposits: number;
    pendingWithdrawals: number;
    balance: number;
}

interface GetTransactionStatsResponse {
    status: string;
    data: {
        stats: TransactionStats;
        recentTransactions: Transaction[];
    };
}

interface SwapTransaction extends Transaction {
    meta: {
        direction: string;
        xeenuxAmount: number;
        usdtAmount: number;
        xeenuxPrice: number;
        swapFee: number;
        burnRate: number;
        burnAmount: number;
    };
}

interface SwapDetails {
    direction: string;
    inputAmount: number;
    outputAmount: number;
    fee: number;
    burnAmount: number;
    xeenuxPrice: number;
}

interface SwapTokensResponse {
    status: string;
    data: {
        transaction: SwapTransaction;
        swapDetails: SwapDetails;
    };
}

export interface ConfirmDepositResponse {
    status: string; 
    data: {
        transaction: Transaction
    };
}

// Hook for fetching transactions
export function useGetMyTransactions(
    query: { type?: string; status?: string; page?: number; limit?: number }
) {
    const [data, setData] = useState<GetMyTransactionsResponse["data"] | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchTransactions = async () => {
        try {
            setIsLoading(true);
            const response = await getMyTransactions(query);
            const result = response as GetMyTransactionsResponse;

            setData(result.data);
            setError(null);
            notification.success("Transactions fetched successfully");
        } catch (err) {
            setError(err as Error);
            notification.error("Failed to fetch transactions");
            console.error("Fetch transactions error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        data,
        isLoading,
        error,
        fetchTransactions,
    };
}

// Hook for fetching a transaction by ID
export function useGetTransactionById(transactionId: string) {
    const [data, setData] = useState<Transaction | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchTransaction = async () => {
        try {
            setIsLoading(true);
            const response = await getTransactionById(transactionId);
            setData(response); // Response is the transaction object
            setError(null);
            notification.success("Transaction fetched successfully");
        } catch (err) {
            setError(err as Error);
            notification.error("Failed to fetch transaction");
            console.error("Fetch transaction error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        data,
        isLoading,
        error,
        fetchTransaction,
    };
}

// Hook for depositing tokens
export function useDepositTokens() {
    const [data, setData] = useState<DepositTokensResponse["data"] | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const postDepositTokens = async (depositData: { amount: number; paymentMethod: string }) => {
        try {
            setIsLoading(true);
            const response = await depositTokens(depositData); // Call the API
            const result = response as DepositTokensResponse;

            setData(result.data);
            setError(null);
            notification.success("Deposit initiated successfully");
        } catch (err) {
            setError(err as Error);
            notification.error("Failed to initiate deposit");
            console.error("Deposit tokens error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        data,
        isLoading,
        error,
        postDepositTokens,
    };
}

// Hook for requesting a withdrawal
export function useRequestWithdrawal() {
    const [data, setData] = useState<RequestWithdrawalResponse["data"] | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const postRequestWithdrawal = async (withdrawalData: { amount: number; walletAddress: string }) => {
        try {
            setIsLoading(true);
            const response = await requestWithdrawal(withdrawalData); // Call the API
            const result = response as RequestWithdrawalResponse;

            setData(result.data);
            setError(null);
            notification.success("Withdrawal request submitted successfully");
        } catch (err) {
            setError(err as Error);
            notification.error("Failed to submit withdrawal request");
            console.error("Request withdrawal error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        data,
        isLoading,
        error,
        postRequestWithdrawal,
    };
}

// Hook for fetching transaction stats
export function useGetTransactionStats() {
    const [data, setData] = useState<GetTransactionStatsResponse["data"] | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchTransactionStats = async () => {
        try {
            setIsLoading(true);
            const response = await getTransactionStats(); // Call the API
            const result = response as GetTransactionStatsResponse;

            setData(result.data);
            setError(null);
            notification.success("Transaction stats fetched successfully");
        } catch (err) {
            setError(err as Error);
            notification.error("Failed to fetch transaction stats");
            console.error("Fetch transaction stats error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        data,
        isLoading,
        error,
        fetchTransactionStats,
    };
}

// Hook for swapping tokens
export function useSwapTokens() {
    const [data, setData] = useState<SwapTokensResponse["data"] | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const postSwapTokens = async (swapData: { amount: number; direction: string }) => {
        try {
            setIsLoading(true);
            const response = await swapTokens(swapData); // Call the API
            const result = response as SwapTokensResponse;

            setData(result.data);
            setError(null);
            notification.success("Token swap completed successfully");
        } catch (err) {
            setError(err as Error);
            notification.error("Failed to complete token swap");
            console.error("Swap tokens error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        data,
        isLoading,
        error,
        postSwapTokens
    }
}

export function useConfirmDeposit() {
    const [data, setData] = useState<ConfirmDepositResponse["data"] | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const postConfirmDeposit = async (confirmData: {
        transactionId: string;
        status: string;
        gatewayReference: string;
    }) => {
        try {
            setIsLoading(true);
            const response = await confirmDeposit(confirmData); // Call the API
            const result = response as ConfirmDepositResponse;

            setData(result.data);
            setError(null);
            notification.success("Deposit confirmed successfully");
        } catch (err) {
            setError(err as Error);
            notification.error("Failed to confirm deposit");
            console.error("Confirm deposit error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        data,
        isLoading,
        error,
        postConfirmDeposit,
    };
}