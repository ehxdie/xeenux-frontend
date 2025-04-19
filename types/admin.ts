// Interface definitions to match backend response

// Dashboard interfaces

export interface UserStats {
    total: number;
    active: number;
    newToday: number;
    inactive: number;
}

export interface TransactionStats {
    deposits: number;
    withdrawals: number;
    purchases: number;
}

export interface IncomeStats {
    roi: number;
    level: number;
    binary: number;
    autopool: number;
    reward: number;
}

export interface PackageCount {
    _id: number;  // packageIndex
    count: number;
}

export interface RankInfo {
    rank: number;
    name: string;
    count: number;
}

export interface DashboardData {
    users: UserStats;
    transactions: TransactionStats;
    income: IncomeStats;
    balance: number;
    packages: PackageCount[];
    ranks: RankInfo[];
}


// Settings interfaces
export interface SystemSetting {
    _id: string;
    key: string;
    value: any;
    group: string;
    isActive: boolean;
    description: string;
    updatedBy?: string | null;
    createdAt: string;
    updatedAt: string;
    __v: number;
}


export interface SettingsState {
    [key: string]: SystemSetting;
}

export interface UpdateSettingInput {
    key: string;
    value: any;
    group: string;
    description: string;
}

export interface UpdateSettingResponse {
    status: string;
    data: {
        setting: SystemSetting;
    };
}

export interface InitializeSettingsResponse {
    status: string;
    data: {
        result: {
            insertedCount: number;
            matchedCount: number;
            modifiedCount: number;
            deletedCount: number;
            upsertedCount: number;
            upsertedIds: Record<string, any>;
            insertedIds: Record<string, any>;
        };
    };
}

export interface UserSearchResult {
    _id: string;
    name: string;
    email: string;
    phone: string;
    walletAddress: string;
    isActive: boolean;
    userId: number;
    registeredAt: string;
    rank: number;
    totalIncome: number | null;
    id: string;
}

export interface SearchUsersResponse {
    status: string;
    data: {
        users: UserSearchResult[];
        count: number;
    };
}

export interface Transaction {
    _id: string;
    userId: number;
    user: string; // Assuming this is the ObjectId reference to the User model
    type: 'deposit' | 'withdrawal' | 'purchase' | 'transfer' | 'fee' | 'reward' | 'admin';
    amount: number;
    amountUSD: number;
    fee: number;
    status: 'pending' | 'completed' | 'failed' | 'cancelled';
    description?: string;
    reference?: string;
    externalReference?: string;
    walletAddress?: string;
    relatedTransaction?: string; // Assuming this is the ObjectId reference to another Transaction
    meta?: Record<string, any>; // Metadata specific to the transaction type
    createdAt: string;
    updatedAt: string;
}

export interface Pagination {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface GetUserTransactionsResponse {
    status: string;
    data: {
        transactions: Transaction[];
        pagination: Pagination;
    };
}

export interface Activity {
    _id: string;
    userId: number;
    user: string; // Assuming this is the ObjectId reference to the User model
    amount: number;
    type: 0 | 1 | 2 | 3 | 4 | 5 | 6; // Enum for activity types
    level?: number;
    description?: string;
    referenceId?: string; // ObjectId reference to related entities
    meta?: Record<string, any>; // Metadata specific to the activity type
    createdAt: string;
    updatedAt: string;
}

export interface GetUserActivitiesResponse {
    status: string;
    data: {
        activities: Activity[];
        pagination: Pagination;
    };
}

export interface AddUserBalanceResponse {
    status: string;
    data: {
        transaction: Transaction;
    };
}

export interface UpdateUserRankResponse {
    status: string;
    data: {
        user: {
            userId: number;
            name: string;
            rank: number;
        };
    };
}

// Add this interface for the User object in the transaction
interface TransactionUser {
    _id: string;
    name: string;
    email: string;
    userId: number;
    totalIncome: number | null;
    id: string;
}

// Add this interface for the Transaction schema
export interface RecentTransaction {
    _id: string;
    userId: number;
    user: TransactionUser;
    type: 'deposit' | 'withdrawal' | 'purchase' | 'transfer' | 'fee' | 'reward' | 'admin';
    amount: number;
    amountUSD: number;
    fee: number;
    status: 'pending' | 'completed' | 'failed' | 'cancelled';
    description?: string;
    reference?: string;
    createdAt: string;
    updatedAt: string;
    [key: string]: any; // Additional fields if necessary
}

export interface GetRecentTransactionsResponse {
    status: string;
    data: {
        transactions: RecentTransaction[];
        pagination: Pagination;
    };
}

// Interface for the "skipped" response when task = weekly
interface WeeklyTaskSkippedResponse {
    status: "skipped";
    reason: string;
    nextDistribution: string;
}

// Interface for individual user results in ROI/Binary tasks
interface TaskResult {
    userId: number;
    result: {
        status: "skipped" | "success" | "failed";
        reason?: string;
    };
}

// Interface for the "success" response when task = roi or binary
interface RoiBinaryTaskSuccessResponse {
    status: "success";
    data: {
        processed: number;
        results: TaskResult[];
    };
}

// Union type for all possible responses
export interface ProcessScheduledTaskResponse {
    status: string;
    data?: {
        processed: number;
        results: TaskResult[];
    };
    reason?: string;
    nextDistribution?: string;
}

// Interface for a single log entry
export interface SystemLog {
    time: string;
    type: number; // Enum for activity types (e.g., 0, 1, 2, etc.)
    userId: number;
    userName: string;
    description: string;
    amount: number;
}

// Interface for the getSystemLogs response
export interface GetSystemLogsResponse {
    status: string;
    data: {
        logs: SystemLog[];
        count: number;
    };
}

// Interface for the summary of the report
interface ReportSummary {
    byType: Record<string, { amount: number; count: number }>;
    total: {
        amount: number;
        count: number;
    };
}

// Interface for the details of the report
interface ReportDetail {
    day: string;
    [key: string]: any; // Additional fields for each day's data
}

// Interface for the report object
export interface Report {
    type: string;
    startDate: string;
    endDate: string;
    summary: ReportSummary;
    details: ReportDetail[];
}

// Interface for the generateReport response
export interface GenerateReportResponse {
    status: string;
    data: {
        report: Report;
    };
}

export interface ProcessWithdrawalResponse {
    status: string;
    data: {
        transaction: Transaction;
    };
}

// Interface for the created package
export interface Package {
    _id: string;
    name: string;
    priceUSD: number;
    description: string;
    isActive: boolean;
    packageIndex: number;
    maxROIMultiplier: number;
    features: string[];
    createdBy: string; // Admin ID
    createdAt: string;
    updatedAt: string;
    __v: number;
}

// Interface for the createPackage response
export interface CreatePackageResponse {
    status: string;
    data: {
        package: Package;
    };
}

export interface UpdatePackageResponse {
    status: string;
    data: {
        package: Package;
    };
}

export interface DeletePackageResponse {
    status: string;
    data: null;
}
