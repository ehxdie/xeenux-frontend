// Interfaces for the payload structure
export interface Income {
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

export interface IncomeSummary {
    roi: number;
    level: number;
    binary: number;
    autopool: number;
    reward: number;
    total: number;
}

export interface Pagination {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface GetMyIncomesResponse {
    status: string;
    data: {
        incomes: Income[];
        summary: IncomeSummary;
        pagination: Pagination;
    };
}

export interface BinaryTreeNode {
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

export interface BinaryNetwork {
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

export interface UserVolume {
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

export interface GetBinaryTreeResponse {
    status: string;
    data: {
        binaryTree: BinaryTreeNode;
        binaryNetwork: BinaryNetwork;
        userVolume: UserVolume;
    };
}

// Interface for the getBinaryLegs response
export interface GetBinaryLegsResponse {
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
export interface GetPendingBinaryIncomeResponse {
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
export interface AnalyzeBinaryTreeResponse {
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

export interface ProcessROIResponse {
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

export interface ProcessBinaryIncomeResponse {
    status: string;
    data: {
        status: string;
        reason: string;
        leftVolume: number;
        rightVolume: number;
    };
}

export interface WithdrawIncomeResponse {
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