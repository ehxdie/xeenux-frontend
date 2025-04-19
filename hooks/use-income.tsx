import { useState, useEffect } from "react";
import {
    getMyIncomes,
    getBinaryTree,
    getBinaryLegs,
    getPendingBinaryIncome,
    analyzeBinaryTree,
    processROI,
    processBinaryIncome,
    withdrawIncome
} from "@/api/income";
import { notification } from "@/utils/scaffold-eth/notification";
import { useAuth } from "@/context/auth-context"; // Import AuthContext
import {
    GetMyIncomesResponse,
    GetBinaryTreeResponse,
    GetBinaryLegsResponse,
    GetPendingBinaryIncomeResponse,
    AnalyzeBinaryTreeResponse,
    ProcessROIResponse,
    ProcessBinaryIncomeResponse,
    WithdrawIncomeResponse,
} from "@/types/income";

// Hook for fetching incomes
export function useGetMyIncomes(type: string, page: number, limit: number) {
    const { token } = useAuth(); // Get token from AuthContext
    const [data, setData] = useState<GetMyIncomesResponse["data"] | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchMyIncomes = async () => {
        try {
            setIsLoading(true);
            const response = await getMyIncomes(token!, { type, page, limit }); // Pass token
            const result = response as GetMyIncomesResponse;

            setData(result.data);
            setError(null);
            notification.success("Incomes fetched successfully");
        } catch (err) {
            setError(err as Error);
            notification.error("Failed to fetch incomes");
            console.error("Fetch incomes error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        data,
        isLoading,
        error,
        refreshIncomes: fetchMyIncomes,
    };
}

// Hook for fetching binary tree
export function useGetBinaryTree(params: { depth?: number }) {
    const { token } = useAuth(); // Get token from AuthContext
    const [data, setData] = useState<GetBinaryTreeResponse["data"] | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchBinaryTree = async () => {
        try {
            setIsLoading(true);
            const response = await getBinaryTree(token!, params); // Pass token
            const result = response as GetBinaryTreeResponse;

            setData(result.data);
            setError(null);
            notification.success("Binary tree data fetched successfully");
        } catch (err) {
            setError(err as Error);
            notification.error("Failed to fetch binary tree data");
            console.error("Fetch binary tree error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        data,
        isLoading,
        error,
        refreshBinaryTree: fetchBinaryTree,
    };
}

// Hook for fetching binary legs
export function useGetBinaryLegs() {
    const { token } = useAuth(); // Get token from AuthContext
    const [data, setData] = useState<GetBinaryLegsResponse["data"] | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchBinaryLegs = async () => {
        try {
            setIsLoading(true);
            const response = await getBinaryLegs(token!); // Pass token
            const result = response as GetBinaryLegsResponse;

            setData(result.data);
            setError(null);
            notification.success("Binary legs data fetched successfully");
        } catch (err) {
            setError(err as Error);
            notification.error("Failed to fetch binary legs data");
            console.error("Fetch binary legs error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        data,
        isLoading,
        error,
        refreshBinaryLegs: fetchBinaryLegs,
    };
}

// Hook for fetching pending binary income
export function useGetPendingBinaryIncome() {
    const { token } = useAuth(); // Get token from AuthContext
    const [data, setData] = useState<GetPendingBinaryIncomeResponse["data"] | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchPendingBinaryIncome = async () => {
        try {
            setIsLoading(true);
            const response = await getPendingBinaryIncome(token!); // Pass token
            const result = response as GetPendingBinaryIncomeResponse;

            setData(result.data);
            setError(null);
            notification.success("Pending binary income data fetched successfully");
        } catch (err) {
            setError(err as Error);
            notification.error("Failed to fetch pending binary income data");
            console.error("Fetch pending binary income error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        data,
        isLoading,
        error,
        refreshPendingBinaryIncome: fetchPendingBinaryIncome,
    };
}

// Hook for analyzing binary tree
export function useAnalyzeBinaryTree() {
    const { token } = useAuth(); // Get token from AuthContext
    const [data, setData] = useState<AnalyzeBinaryTreeResponse["data"] | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchAnalyzeBinaryTree = async () => {
        try {
            setIsLoading(true);
            const response = await analyzeBinaryTree(token!); // Pass token
            const result = response as AnalyzeBinaryTreeResponse;

            setData(result.data);
            setError(null);
            notification.success("Binary tree analysis fetched successfully");
        } catch (err) {
            setError(err as Error);
            notification.error("Failed to fetch binary tree analysis");
            console.error("Fetch binary tree analysis error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAnalyzeBinaryTree();
    }, []);

    return {
        data,
        isLoading,
        error,
        refreshAnalyzeBinaryTree: fetchAnalyzeBinaryTree,
    };
}

// Hook for processing ROI
export function useProcessROI() {
    const { token } = useAuth(); // Get token from AuthContext
    const [data, setData] = useState<ProcessROIResponse["data"] | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchProcess = async () => {
        try {
            setIsLoading(true);
            const response = await processROI(token!); // Pass token
            const result = response as ProcessROIResponse;

            setData(result.data);
            setError(null);
            notification.success("ROI processed successfully");
        } catch (err) {
            setError(err as Error);
            notification.error("Failed to process ROI");
            console.error("Process ROI error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        data,
        isLoading,
        error,
        fetchProcess,
    };
}

// Hook for processing binary income
export function useProcessBinaryIncome() {
    const { token } = useAuth(); // Get token from AuthContext
    const [data, setData] = useState<ProcessBinaryIncomeResponse["data"] | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchProcessBinaryIncome = async () => {
        try {
            setIsLoading(true);
            const response = await processBinaryIncome(token!); // Pass token
            const result = response as ProcessBinaryIncomeResponse;

            setData(result.data);
            setError(null);
            notification.success("Binary income processed successfully");
        } catch (err) {
            setError(err as Error);
            notification.error("Failed to process binary income");
            console.error("Process binary income error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        data,
        isLoading,
        error,
        fetchProcessBinaryIncome,
    };
}

// Hook for withdrawing income
export function useWithdrawIncome() {
    const { token } = useAuth(); // Get token from AuthContext
    const [data, setData] = useState<WithdrawIncomeResponse["data"] | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchWithdrawIncome = async (amount: number) => {
        try {
            setIsLoading(true);
            const response = await withdrawIncome(token!, { amount }); // Pass token
            const result = response as WithdrawIncomeResponse;

            setData(result.data);
            setError(null);
            notification.success("Income withdrawn successfully");
        } catch (err) {
            setError(err as Error);
            notification.error("Failed to withdraw income");
            console.error("Withdraw income error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        data,
        isLoading,
        error,
        fetchWithdrawIncome,
    };
}
