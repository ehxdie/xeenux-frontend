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

// Interfaces for the payload structure
interface Income {
    _id: string;
    userId: number;
    user: string;
    type: string;
    amount: number;
    description: string;
    isPaid: boolean;
    isDistributed: boolean;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

interface IncomeSummary {
    roi: number;
    level: number;
    binary: number;
    autopool: number;
    reward: number;
    total: number;
}

interface Pagination {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

interface GetMyIncomesResponse {
    status: string;
    data: {
        incomes: Income[];
        summary: IncomeSummary;
        pagination: Pagination;
    };
}

interface BinaryTreeNode {
    userId: number;
    name: string;
    position: number;
    leftVolume: number;
    rightVolume: number;
    totalLeftVolume: number;
    totalRightVolume: number;
    isEmpty: boolean;
    left: {
        userId: number;
        name: string;
        isEmpty: boolean;
    };
    right: {
        userId: number;
        name: string;
        isEmpty: boolean;
    };
}

interface BinaryNetwork {
    _id: string;
    userId: number;
    user: string;
    position: number;
    parentId: number;
    leftChildId: number;
    rightChildId: number;
    leftVolume: number;
    rightVolume: number;
    leftCarryForward: number;
    rightCarryForward: number;
    totalLeftVolume: number;
    totalRightVolume: number;
    leftCount: number;
    rightCount: number;
    lastBinaryProcess: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

interface UserVolume {
    _id: string;
    userId: number;
    user: string;
    selfVolume: number;
    directVolume: number;
    leftVolume: number;
    rightVolume: number;
    totalVolume: number;
    lastUpdated: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

interface GetBinaryTreeResponse {
    status: string;
    data: {
        binaryTree: BinaryTreeNode;
        binaryNetwork: BinaryNetwork;
        userVolume: UserVolume;
    };
}

// Interface for the getBinaryLegs response
interface GetBinaryLegsResponse {
    status: string;
    data: {
        userId: number;
        leftLeg: number | null;
        rightLeg: number | null;
        weakerLeg: number;
        strongerLeg: number;
        lastBinaryProcess: string;
    };
}

// Interface for the getPendingBinaryIncome response
interface GetPendingBinaryIncomeResponse {
    status: string;
    data: {
        matchingVolume: number;
        potentialIncome: number;
        maxEarnable: number | null;
        leftVolume: number;
        rightVolume: number;
        leftCarryForward: number;
        rightCarryForward: number;
    };
}

// Interface for the analyzeBinaryTree response
interface AnalyzeBinaryTreeResponse {
    status: string;
    data: {
        leftVolume: number;
        rightVolume: number;
        totalVolume: number;
        balanceRatio: number;
        isBalanced: boolean;
        recentActivity: {
            leftLegTransactions: number;
            rightLegTransactions: number;
        };
        growthTrend: {
            leftGrowth: number;
            rightGrowth: number;
        };
        suggestedFocus: string;
    };
}

interface ProcessROIResponse {
    status: string;
    data: {
        status: string;
        roiAmount: number;
        totalROI: number;
        remainingROI: number;
        updatedPackages: number;
        lastDistribution: string;
    };
}

interface ProcessBinaryIncomeResponse {
    status: string;
    data: {
        status: string;
        reason: string;
        leftVolume: number;
        rightVolume: number;
    };
}

interface WithdrawIncomeResponse {
    status: string;
    data: {
        transaction: {
            userId: number;
            user: string;
            type: string;
            amount: number;
            amountUSD: number;
            fee: number;
            status: string;
            description: string;
            walletAddress: string;
            _id: string;
            createdAt: string;
            updatedAt: string;
            __v: number;
        };
        fee: number;
        finalAmount: number;
        deductions: {
            roi: number;
        };
    };
}

// Hook for fetching incomes
export function useGetMyIncomes(type: string, page: number, limit: number) {
    const [data, setData] = useState<GetMyIncomesResponse["data"] | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchMyIncomes = async () => {
        try {
            setIsLoading(true);
            const response = await getMyIncomes({ type, page, limit });
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
    const [data, setData] = useState<GetBinaryTreeResponse["data"] | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchBinaryTree = async () => {
        try {
            setIsLoading(true);
            const response = await getBinaryTree(params);
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
    const [data, setData] = useState<GetBinaryLegsResponse["data"] | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchBinaryLegs = async () => {
        try {
            setIsLoading(true);
            const response = await getBinaryLegs();
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
    const [data, setData] = useState<GetPendingBinaryIncomeResponse["data"] | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchPendingBinaryIncome = async () => {
        try {
            setIsLoading(true);
            const response = await getPendingBinaryIncome();
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
    const [data, setData] = useState<AnalyzeBinaryTreeResponse["data"] | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchAnalyzeBinaryTree = async () => {
        try {
            setIsLoading(true);
            const response = await analyzeBinaryTree();
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
    const [data, setData] = useState<ProcessROIResponse["data"] | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchProcess = async () => {
        try {
            setIsLoading(true);
            const response = await processROI();
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
    const [data, setData] = useState<ProcessBinaryIncomeResponse["data"] | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchProcessBinaryIncome = async () => {
        try {
            setIsLoading(true);
            const response = await processBinaryIncome();
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
    const [data, setData] = useState<WithdrawIncomeResponse["data"] | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchWithdrawIncome = async (amount: number) => {
        try {
            setIsLoading(true);
            const response = await withdrawIncome({ amount });
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
