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
import { useAuth } from '@/context/auth-context'; // Import AuthContext
import {
    DashboardData,
    SettingsState,
    SystemSetting,
    UpdateSettingInput,
    UpdateSettingResponse,
    InitializeSettingsResponse,
    SearchUsersResponse,
    UserSearchResult,
    GetUserTransactionsResponse,
    GetUserActivitiesResponse,
    AddUserBalanceResponse,
    UpdateUserRankResponse,
    GetRecentTransactionsResponse,
    ProcessScheduledTaskResponse,
    GetSystemLogsResponse,
    SystemLog,
    GenerateReportResponse,
    Report,
    ProcessWithdrawalResponse,
    Transaction,
    RecentTransaction,
    Package,
    CreatePackageResponse,
    UpdatePackageResponse,
    DeletePackageResponse,
    Pagination, 
    Activity,
} from '@/types/admin';

export function useGetDashboardStats() {
    const { token } = useAuth(); // Get token from AuthContext
    const [data, setData] = useState<DashboardData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchDashboardData = async () => {
        try {
            setIsLoading(true);
            const response = await getDashboardStats(token!); // Pass token
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
    const { token } = useAuth(); // Get token from AuthContext
    const [settings, setSettings] = useState<SettingsState>({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchSettings = async (group?: string) => {
        try {
            setIsLoading(true);
            const response = await getSettings(token!, group || ''); // Pass token

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
    const { token } = useAuth(); // Get token from AuthContext
    const [isUpdating, setIsUpdating] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const updateSetting = async (data: UpdateSettingInput): Promise<SystemSetting | null> => {
        try {
            setIsUpdating(true);
            setError(null);

            const response = await updateSettings(token!, data); // Pass token
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
    const { token } = useAuth(); // Get token from AuthContext
    const [isInitializing, setIsInitializing] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const initializeSystemSettings = async (): Promise<InitializeSettingsResponse['data']['result'] | null> => {
        try {
            setIsInitializing(true);
            setError(null);

            const response = await initializeSettings(token!); // Pass token
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
    const { token } = useAuth(); // Get token from AuthContext
    const [users, setUsers] = useState<UserSearchResult[]>([]);
    const [count, setCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const searchUser = async (query: string, field?: string): Promise<void> => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await searchUsers(token!, query, field || ''); // Pass token
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
    const { token } = useAuth(); // Get token from AuthContext
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

            const response = await getUserTransactions(token!, userId, params); // Pass token
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
    const { token } = useAuth(); // Get token from AuthContext
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

            const response = await getUserActivities(token!, userId, params); // Pass token
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
    const { token } = useAuth(); // Get token from AuthContext
    const [transaction, setTransaction] = useState<Transaction | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const addUserBalanceHook = async (
        data: { userId: string; amount: number; type: string; description: string }
    ): Promise<void> => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await addUserBalance(token!, data); // Pass token
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
    const { token } = useAuth(); // Get token from AuthContext
    const [updatedUser, setUpdatedUser] = useState<UpdateUserRankResponse['data']['user'] | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const updateUserRankHook = async (
        data: { userId: string; rank: number }
    ): Promise<void> => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await updateUserRank(token!, data); // Pass token
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
    const { token } = useAuth(); // Get token from AuthContext
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

            const response = await getRecentTransactions(token!, { type: params.type || '', status: params.status || '', ...params }); // Pass token
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
    const { token } = useAuth(); // Get token from AuthContext
    const [response, setResponse] = useState<ProcessScheduledTaskResponse | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const processTask = async (task: string): Promise<void> => {
        try {
            setIsLoading(true);
            setError(null);

            const apiResponse = await processScheduledTask(token!, task); // Pass token
            const result = apiResponse as ProcessScheduledTaskResponse;

            setResponse(result);

            if (result.status === "skipped") {
                notification.info(`Task skipped: ${result.reason}`);
            } else if (result.status === "success") {
                notification.success(`Task processed successfully. Processed: ${result.data?.processed ?? 'N/A'}`);
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
    const { token } = useAuth(); // Get token from AuthContext
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

            const response = await getSystemLogs(token!, params); // Pass token
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
    const { token } = useAuth(); // Get token from AuthContext
    const [report, setReport] = useState<Report | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchReport = async (
        data: { type: string; startDate: string; endDate: string }
    ): Promise<void> => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await generateReport(token!, data); // Pass token
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
    };
}

// Hook for processWithdrawal
export function useProcessWithdrawal() {
    const { token } = useAuth(); // Get token from AuthContext
    const [transaction, setTransaction] = useState<Transaction | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const processWithdrawalHook = async (
        data: { transactionId: string; status: string; remarks?: string }
    ): Promise<void> => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await processWithdrawal(token!, { ...data, remarks: data.remarks || '' }); // Pass token
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
    const { token } = useAuth(); // Get token from AuthContext
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

            const response = await createPackage(token!, data); // Pass token
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
    const { token } = useAuth(); // Get token from AuthContext
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

            const response = await updatePackage(token!, packageId, data); // Pass token
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
    const { token } = useAuth(); // Get token from AuthContext
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [isDeleted, setIsDeleted] = useState(false);

    const deletePackageHook = async (packageId: number): Promise<void> => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await deletePackage(token!, packageId); // Pass token
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