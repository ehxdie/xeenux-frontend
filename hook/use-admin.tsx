import { useState, useEffect } from 'react';
import {
    getDashboardStats,
    getSettings,
    updateSettings,
    initializeSettings,
    searchUsers,
    getUserTransactions,
    getUserActivities,
    addUserBalance,
    updateUserRank,
    getRecentTransactions,
    processScheduledTask,
    getSystemLogs,
    generateReport,
    processWithdrawal,
    createPackage,
    updatePackage,
    deletePackage
} from '@/api/admin';
import { notification } from '@/utils/scaffold-eth/notification';

// Interface definitions to match backend response

// Dashboard interfaces

interface UserStats {
    total: number;
    active: number;
    newToday: number;
    inactive: number;
}

interface TransactionStats {
    deposits: number;
    withdrawals: number;
    purchases: number;
}

interface IncomeStats {
    roi: number;
    level: number;
    binary: number;
    autopool: number;
    reward: number;
}

interface PackageCount {
    _id: number;  // packageIndex
    count: number;
}

interface RankInfo {
    rank: number;
    name: string;
    count: number;
}

interface DashboardData {
    users: UserStats;
    transactions: TransactionStats;
    income: IncomeStats;
    balance: number;
    packages: PackageCount[];
    ranks: RankInfo[];
}


// Settings interfaces
interface SystemSetting {
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


interface SettingsState {
    [key: string]: SystemSetting;
}

interface UpdateSettingInput {
    key: string;
    value: any;
    group: string;
    description: string;
}

interface UpdateSettingResponse {
    status: string;
    data: {
        setting: SystemSetting;
    };
}

interface InitializeSettingsResponse {
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

interface UserSearchResult {
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

interface SearchUsersResponse {
    status: string;
    data: {
        users: UserSearchResult[];
        count: number;
    };
}

interface Transaction {
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

interface Pagination {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

interface GetUserTransactionsResponse {
    status: string;
    data: {
        transactions: Transaction[];
        pagination: Pagination;
    };
}

interface Activity {
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

interface GetUserActivitiesResponse {
    status: string;
    data: {
        activities: Activity[];
        pagination: Pagination;
    };
}

interface AddUserBalanceResponse {
    status: string;
    data: {
        transaction: Transaction;
    };
}

interface UpdateUserRankResponse {
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
interface RecentTransaction {
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

interface GetRecentTransactionsResponse {
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
type ProcessScheduledTaskResponse =
    | WeeklyTaskSkippedResponse
    | RoiBinaryTaskSuccessResponse;

// Interface for a single log entry
interface SystemLog {
    time: string;
    type: number; // Enum for activity types (e.g., 0, 1, 2, etc.)
    userId: number;
    userName: string;
    description: string;
    amount: number;
}

// Interface for the getSystemLogs response
interface GetSystemLogsResponse {
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
interface Report {
    type: string;
    startDate: string;
    endDate: string;
    summary: ReportSummary;
    details: ReportDetail[];
}

// Interface for the generateReport response
interface GenerateReportResponse {
    status: string;
    data: {
        report: Report;
    };
}

interface ProcessWithdrawalResponse {
    status: string;
    data: {
        transaction: Transaction;
    };
}

// Interface for the created package
interface Package {
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
interface CreatePackageResponse {
    status: string;
    data: {
        package: Package;
    };
}

interface UpdatePackageResponse {
    status: string;
    data: {
        package: Package;
    };
}

interface DeletePackageResponse {
    status: string;
    data: null;
}

export function useGetDashboardStats() {
    const [data, setData] = useState<DashboardData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchDashboardData = async () => {

        try {
            setIsLoading(true);
            const response = await getDashboardStats();
            setData(response.data);
            setError(null);
        } catch (err) {
            setError(err as Error);
            notification.error('Failed to fetch dashboard data');
            console.error('Dashboard fetch error:', err);
        } finally {
            setIsLoading(false);
        }
    };


    return {
        data,
        isLoading,
        error,
        refreshData: fetchDashboardData,
        // Computed values
        totalUsers: data?.users.total || 0,
        activeUsers: data?.users.active || 0,
        systemBalance: data?.balance || 0
    };
}

export function useGetSettings() {
    const [settings, setSettings] = useState<SettingsState>({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchSettings = async (group?: string) => {
        

        try {
            setIsLoading(true);
            const response = await getSettings(group || '');

            const settingsArray: SystemSetting[] = response.data.settings;

            const settingsMap = settingsArray.reduce((acc: SettingsState, setting) => {
                acc[setting.key] = setting;
                return acc;
            }, {});

            setSettings(settingsMap);
            setError(null);
        } catch (err) {
            setError(err as Error);
            notification.error('Failed to fetch system settings');
            console.error('Settings fetch error:', err);
        } finally {
            setIsLoading(false);
        }
    };


    return {
        settings,
        isLoading,
        error,
        refreshSettings: fetchSettings,
    };
}

export function useUpdateSetting() {
    const [isUpdating, setIsUpdating] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const updateSetting = async (data: UpdateSettingInput): Promise<SystemSetting | null> => {
        

        try {
            setIsUpdating(true);
            setError(null);

            const response = await updateSettings(data);
            const result = response as UpdateSettingResponse;

            notification.success('Setting updated successfully');
            return result.data.setting;

        } catch (err) {
            setError(err as Error);
            notification.error('Failed to update setting');
            console.error('Setting update error:', err);
            return null;

        } finally {
            setIsUpdating(false);
        }
    };

    return {
        updateSetting,
        isUpdating,
        error
    };
}

export function useInitializeSettings() {
    const [isInitializing, setIsInitializing] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const initializeSystemSettings = async (): Promise<InitializeSettingsResponse['data']['result'] | null> => {
        

        try {
            setIsInitializing(true);
            setError(null);

            const response = await initializeSettings();
            const result = response as InitializeSettingsResponse;

            notification.success('System settings initialized successfully');
            return result.data.result;

        } catch (err) {
            setError(err as Error);
            notification.error('Failed to initialize system settings');
            console.error('Settings initialization error:', err);
            return null;

        } finally {
            setIsInitializing(false);
        }
    };

    return {
        initializeSystemSettings,
        isInitializing,
        error
    };
}

// Add the hook for searchUsers
export function useSearchUsers() {
    const [users, setUsers] = useState<UserSearchResult[]>([]);
    const [count, setCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const searchUser = async (query: string, field?: string): Promise<void> => {
        

        try {
            setIsLoading(true);
            setError(null);

            const response = await searchUsers(query, field || '');
            const result = response as SearchUsersResponse;

            setUsers(result.data.users);
            setCount(result.data.count);
            notification.success('Users fetched successfully');
        } catch (err) {
            setError(err as Error);
            notification.error('Failed to fetch users');
            console.error('Search users error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        users,
        count,
        isLoading,
        error,
        searchUser,
    };
}

export function useGetUserTransactions() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [pagination, setPagination] = useState<Pagination | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchUserTransactions = async (
        userId: string,
        params: { type?: string; page?: number; limit?: number } = {}
    ): Promise<void> => {
        
        try {
            setIsLoading(true);
            setError(null);

            const response = await getUserTransactions(userId, params);
            const result = response as GetUserTransactionsResponse;

            setTransactions(result.data.transactions);
            setPagination(result.data.pagination);
            notification.success('Transactions fetched successfully');
        } catch (err) {
            setError(err as Error);
            notification.error('Failed to fetch transactions');
            console.error('Fetch transactions error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        transactions,
        pagination,
        isLoading,
        error,
        fetchUserTransactions,
    };
}

export function useGetUserActivities() {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [pagination, setPagination] = useState<Pagination | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchUserActivities = async (
        userId: string,
        params: { type?: number; page?: number; limit?: number } = {}
    ): Promise<void> => {
        
        try {
            setIsLoading(true);
            setError(null);

            const response = await getUserActivities(userId, params);
            const result = response as GetUserActivitiesResponse;

            setActivities(result.data.activities);
            setPagination(result.data.pagination);
            notification.success('Activities fetched successfully');
        } catch (err) {
            setError(err as Error);
            notification.error('Failed to fetch activities');
            console.error('Fetch activities error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        activities,
        pagination,
        isLoading,
        error,
        fetchUserActivities,
    };
}

// Add the hook for addUserBalance
export function useAddUserBalance() {
    const [transaction, setTransaction] = useState<Transaction | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const addUserBalanceHook = async (
        data: { userId: string; amount: number; type: string; description: string }
    ): Promise<void> => {
        
        try {
            setIsLoading(true);
            setError(null);

            const response = await addUserBalance(data);
            const result = response as AddUserBalanceResponse;

            setTransaction(result.data.transaction);
            notification.success('Balance added successfully');
        } catch (err) {
            setError(err as Error);
            notification.error('Failed to add balance');
            console.error('Add user balance error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        transaction,
        isLoading,
        error,
        addUserBalanceHook,
    };
}

export function useUpdateUserRank() {
    const [updatedUser, setUpdatedUser] = useState<UpdateUserRankResponse['data']['user'] | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const updateUserRankHook = async (
        data: { userId: string; rank: number }
    ): Promise<void> => {
        

        try {
            setIsLoading(true);
            setError(null);

            const response = await updateUserRank(data);
            const result = response as UpdateUserRankResponse;

            setUpdatedUser(result.data.user);
            notification.success('User rank updated successfully');
        } catch (err) {
            setError(err as Error);
            notification.error('Failed to update user rank');
            console.error('Update user rank error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        updatedUser,
        isLoading,
        error,
        updateUserRankHook,
    };
}

// Add the hook for getRecentTransactions
export function useGetRecentTransactions() {
    const [transactions, setTransactions] = useState<RecentTransaction[]>([]);
    const [pagination, setPagination] = useState<Pagination | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchRecentTransactions = async (
        params: { type?: string; status?: string; page?: number; limit?: number } = {}
    ): Promise<void> => {
       

        try {
            setIsLoading(true);
            setError(null);

            const response = await getRecentTransactions(
                { type: params.type || '', status: params.status || '', ...params }
            );
            const result = response as GetRecentTransactionsResponse;

            setTransactions(result.data.transactions);
            setPagination(result.data.pagination);
            notification.success('Recent transactions fetched successfully');
        } catch (err) {
            setError(err as Error);
            notification.error('Failed to fetch recent transactions');
            console.error('Fetch recent transactions error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        transactions,
        pagination,
        isLoading,
        error,
        fetchRecentTransactions,
    };
}

// Hook for processScheduledTask
export function useProcessScheduledTask() {
    const [response, setResponse] = useState<ProcessScheduledTaskResponse | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const processTask = async (task: string): Promise<void> => {
        
        try {
            setIsLoading(true);
            setError(null);

            const apiResponse = await processScheduledTask(task);
            const result = apiResponse as ProcessScheduledTaskResponse;

            setResponse(result);

            if (result.status === "skipped") {
                notification.info(`Task skipped: ${result.reason}`);
            } else if (result.status === "success") {
                notification.success(`Task processed successfully. Processed: ${result.data.processed}`);
            }
        } catch (err) {
            setError(err as Error);
            notification.error("Failed to process scheduled task");
            console.error("Process scheduled task error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        response,
        isLoading,
        error,
        processTask,
    };
}

export function useGetSystemLogs() {
    const [logs, setLogs] = useState<SystemLog[]>([]);
    const [count, setCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchSystemLogs = async (
        params: { page?: number; limit?: number } = {}
    ): Promise<void> => {
        
        try {
            setIsLoading(true);
            setError(null);

            const response = await getSystemLogs(params);
            const result = response as GetSystemLogsResponse;

            setLogs(result.data.logs);
            setCount(result.data.count);
            notification.success("System logs fetched successfully");
        } catch (err) {
            setError(err as Error);
            notification.error("Failed to fetch system logs");
            console.error("Fetch system logs error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        logs,
        count,
        isLoading,
        error,
        fetchSystemLogs,
    };
}

// Hook for generateReport
export function useGenerateReport() {

    const [report, setReport] = useState<Report | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchReport = async (
        data: { type: string; startDate: string; endDate: string }
    ): Promise<void> => {
        

        try {
            setIsLoading(true);
            setError(null);

            const response = await generateReport(data);
            const result = response as GenerateReportResponse;

            setReport(result.data.report);
            notification.success("Report generated successfully");
        } catch (err) {
            setError(err as Error);
            notification.error("Failed to generate report");
            console.error("Generate report error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        report,
        isLoading,
        error,
        fetchReport,
}

    }

// Hook for processWithdrawal
export function useProcessWithdrawal() {
    const [transaction, setTransaction] = useState<Transaction | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const processWithdrawalHook = async (
        data: { transactionId: string; status: string; remarks?: string }
    ): Promise<void> => {
        

        try {
            setIsLoading(true);
            setError(null);

            const response = await processWithdrawal(
                { ...data, remarks: data.remarks || '' },
                
            );
            const result = response as ProcessWithdrawalResponse;

            setTransaction(result.data.transaction);
            notification.success("Withdrawal processed successfully");
        } catch (err) {
            setError(err as Error);
            notification.error("Failed to process withdrawal");
            console.error("Process withdrawal error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        transaction,
        isLoading,
        error,
        processWithdrawalHook,
    };
}

// Hook for createPackage
export function useCreatePackage() {
    const [createdPackage, setCreatedPackage] = useState<Package | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const createPackageHook = async (
        data: {
            name: string;
            priceUSD: number;
            description: string;
            packageIndex: number;
            maxROIMultiplier: number;
            features: string[];
        }
    ): Promise<void> => {
        
        try {
            setIsLoading(true);
            setError(null);

            const response = await createPackage(data);
            const result = response as CreatePackageResponse;

            setCreatedPackage(result.data.package);
            notification.success("Package created successfully");
        } catch (err) {
            setError(err as Error);
            notification.error("Failed to create package");
            console.error("Create package error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        createdPackage,
        isLoading,
        error,
        createPackageHook,
    };
}

// Hook for updatePackage
export function useUpdatePackage() {
    const [updatedPackage, setUpdatedPackage] = useState<Package | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const updatePackageHook = async (
        packageId: number,
        data: {
            name?: string;
            priceUSD?: number;
            description?: string;
            maxROIMultiplier?: number;
            features?: string[];
            isActive?: boolean;
        }
    ): Promise<void> => {
       
        try {
            setIsLoading(true);
            setError(null);

            const response = await updatePackage(packageId, data);
            const result = response as UpdatePackageResponse;

            setUpdatedPackage(result.data.package);
            notification.success("Package updated successfully");
        } catch (err) {
            setError(err as Error);
            notification.error("Failed to update package");
            console.error("Update package error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        updatedPackage,
        isLoading,
        error,
        updatePackageHook,
    };
}

// Hook for deletePackage
export function useDeletePackage() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [isDeleted, setIsDeleted] = useState(false);

    const deletePackageHook = async (packageId: number): Promise<void> => {
        

        try {
            setIsLoading(true);
            setError(null);

            const response = await deletePackage(packageId);
            const result = response as DeletePackageResponse;

            if (result.status === "success") {
                setIsDeleted(true);
                notification.success("Package deleted successfully");
            }
        } catch (err) {
            setError(err as Error);
            notification.error("Failed to delete package");
            console.error("Delete package error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        isDeleted,
        isLoading,
        error,
        deletePackageHook,
    };
}