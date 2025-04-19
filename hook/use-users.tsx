import { useState, useEffect } from "react";
import {
    getUserProfile,
    updateUserProfile,
    getDashboard,
    getBinaryTree,
    getTeamMembers,
    getActivities,
    getUserPackages,
} from "@/api/user";
import { notification } from "@/utils/scaffold-eth/notification";

// Interfaces for the payload structure
interface User {
    _id: string;
    name: string;
    email: string;
    phone: string;
    walletAddress: string;
    role: string;
    isActive: boolean;
    userId: number;
    referrerId: number;
    position: number;
    registeredAt: string;
    refCount: number;
    rank: number;
    lastRankSaved: number;
    roiIncome: number;
    levelIncome: number;
    autopoolIncome: number;
    rewardIncome: number;
    binaryIncome: number;
    lastROIDistributed: string;
    lastBinaryDistributed: string;
    lastRewardDistributed: string;
    totalWithdraw: number;
    purchaseWallet: number;
    createdAt: string;
    updatedAt: string;
    __v: number;
    totalIncome: number;
    id: string;
}

interface Volume {
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

interface Incomes {
    roi: number;
    level: number;
    binary: number;
    autopool: number;
    reward: number;
    total: number;
}

interface PendingIncome {
    roi: number;
    level: number;
    binary: number;
    autopool: number;
    reward: number;
    total: number;
}

interface ActivePackage {
    _id: string;
    user: string;
    userId: number;
    package: string;
    packageIndex: number;
    purchaseDate: string;
    amountPaid: number;
    xeenuxAmount: number;
    ceilingLimit: number;
    earned: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

interface UserProfileData {
    user: User;
    volume: Volume;
    incomes: Incomes;
    pendingIncome: PendingIncome;
    activePackages: ActivePackage[];
}

interface UserProfileResponse {
    status: string;
    data: UserProfileData;
}

// Interface for the updateUserProfile response
interface UpdateUserProfileResponse {
    status: string;
    data: {
        user: User;
    };
}

// Interface for the getDashboard response
interface DashboardResponse {
    status: string;
    data: {
        user: User;
        volume: Volume;
        binaryNetwork: {
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
        };
        teamStructure: {
            _id: string;
            userId: number;
            user: string;
            directTeam: number;
            totalTeam: number;
            directBusiness: number;
            totalBusiness: number;
            team: Record<string, any[]>;
            volume: Record<string, number>;
            teamRanks: Record<string, number>;
            lastUpdated: string;
            createdAt: string;
            updatedAt: string;
            __v: number;
        };
        activePackages: ActivePackage[];
        incomes: Incomes;
        recentActivities: {
            _id: string;
            userId: number;
            user: string;
            amount: number;
            type: number;
            level: number;
            description: string;
            meta: Record<string, any>;
            createdAt: string;
            updatedAt: string;
            __v: number;
        }[];
        referralLinks: {
            left: string;
            right: string;
        };
        binaryTree: {
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
        };
    };
}

// Interface for the getBinaryTree response
interface BinaryTreeResponse {
    status: string;
    data: {
        binaryTree: {
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
        };
    };
}

interface TeamStructure {
    userId: number; // Unique identifier for the user
    user: string; // Reference to the User object (ObjectId as a string)
    team: Map<string, number[]>; // Map of team members by level (e.g., 'level1', 'level2')
    volume: Map<string, number>; // Map of volume by level (e.g., 'level1', 'level2')
    teamRanks: Map<string, number>; // Map of rank counts (e.g., 'rank0', 'rank1')
    directTeam: number; // Total direct team members
    totalTeam: number; // Total team members across all levels
    directBusiness: number; // Direct business volume
    totalBusiness: number; // Total business volume
    lastUpdated: Date; // Timestamp of the last update
    createdAt?: Date; // Automatically added by Mongoose timestamps
    updatedAt?: Date; // Automatically added by Mongoose timestamps
}

// Interface for the getTeamMembers response
interface TeamMembersResponse {
    status: string;
    data: {
        members: TeamStructure[]; // Replace `any` with a specific type if available
        pagination: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    };
}

interface Activity {
    userId: number; // Unique identifier for the user
    user: string; // Reference to the User object (ObjectId as a string)
    amount: number; // Amount involved in the activity
    type: 0 | 1 | 2 | 3 | 4 | 5 | 6;
    // Activity type:
    // 0 - Investment/Purchase
    // 1 - Referral/Level Income
    // 2 - ROI
    // 3 - Autopool
    // 4 - Weekly Reward
    // 5 - Binary Income
    // 6 - Withdrawal
    level?: number; // Level associated with the activity (default: 0)
    description?: string; // Description of the activity
    referenceId?: string; // Reference to another entity (ObjectId as a string)
    meta?: Record<string, any>; // Additional metadata specific to the activity type
    createdAt?: Date; // Automatically added by Mongoose timestamps
    updatedAt?: Date; // Automatically added by Mongoose timestamps
}

interface ActivitiesResponse {
    status: string;
    data: {
        activities: Activity[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    };
}

// Interface for a single package
interface UserPackage {
    _id: string; // Unique identifier for the package
    user: string; // Reference to the User object (ObjectId as a string)
    userId: number; // Unique identifier for the user
    package: string; // Reference to the Package object (ObjectId as a string)
    packageIndex: number; // Index of the package
    purchaseDate: string; // Date when the package was purchased
    amountPaid: number; // Amount paid for the package
    xeenuxAmount: number; // Xeenux amount associated with the package
    ceilingLimit: number; // Ceiling limit for the package
    earned: number; // Amount earned from the package
    isActive: boolean; // Whether the package is active
    createdAt: string; // Timestamp when the package was created
    updatedAt: string; // Timestamp when the package was last updated
    __v: number; // Version key
}

// Interface for the getUserPackages response
interface UserPackagesResponse {
    status: string; // Status of the response
    data: {
        packages: UserPackage[]; // Array of user packages
    };
}




// Hook for fetching user profile
export function useGetUserProfile() {
    const [data, setData] = useState<UserProfileData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchUserProfile = async () => {
        try {
            setIsLoading(true);
            const response = await getUserProfile();
            const result = response as UserProfileResponse;

            setData(result.data);
            setError(null);
            notification.success("User profile fetched successfully");
        } catch (err) {
            setError(err as Error);
            notification.error("Failed to fetch user profile");
            console.error("Fetch user profile error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUserProfile();
    }, []);

    return {
        data,
        isLoading,
        error,
        refreshProfile: fetchUserProfile,
    };
}

// Hook for updating user profile
export function useUpdateUserProfile() {
    const [updatedUser, setUpdatedUser] = useState<User | null>(null);
    const [isUpdating, setIsUpdating] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchUpdateUserProfile = async (
        data: { name?: string; phone?: string; walletAddress?: string }
    ): Promise<void> => {
        try {
            setIsUpdating(true);
            setError(null);

            const response = await updateUserProfile(data);
            const result = response as UpdateUserProfileResponse;

            setUpdatedUser(result.data.user);
            notification.success("User profile updated successfully");
        } catch (err) {
            setError(err as Error);
            notification.error("Failed to update user profile");
            console.error("Update user profile error:", err);
        } finally {
            setIsUpdating(false);
        }
    };

    return {
        updatedUser,
        isUpdating,
        error,
        fetchUpdateUserProfile
    };
}

// Hook for fetching dashboard data
export function useGetDashboard() {
    const [data, setData] = useState<DashboardResponse["data"] | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchDashboard = async () => {
        try {
            setIsLoading(true);
            const response = await getDashboard();
            const result = response as DashboardResponse;

            setData(result.data);
            setError(null);
            notification.success("Dashboard data fetched successfully");
        } catch (err) {
            setError(err as Error);
            notification.error("Failed to fetch dashboard data");
            console.error("Fetch dashboard error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboard();
    }, []);

    return {
        data,
        isLoading,
        error,
        refreshDashboard: fetchDashboard,
    };
}

// Hook for fetching binary tree data
export function useGetBinaryTree() {
    const [data, setData] = useState<BinaryTreeResponse["data"] | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchBinaryTree = async () => {
        try {
            setIsLoading(true);
            const response = await getBinaryTree();
            const result = response as BinaryTreeResponse;

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

    useEffect(() => {
        fetchBinaryTree();
    }, []);

    return {
        data,
        isLoading,
        error,
        refreshBinaryTree: fetchBinaryTree,
    };
}

// Hook for fetching team members
export function useGetTeamMembers(level: number, page: number, limit: number) {
    const [data, setData] = useState<TeamMembersResponse["data"] | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchTeamMembers = async () => {
        try {
            setIsLoading(true);
            const response = await getTeamMembers(level, page, limit);
            const result = response as TeamMembersResponse;

            setData(result.data);
            setError(null);
            notification.success("Team members fetched successfully");
        } catch (err) {
            setError(err as Error);
            notification.error("Failed to fetch team members");
            console.error("Fetch team members error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTeamMembers();
    }, [level, page, limit]);

    return {
        data,
        isLoading,
        error,
        refreshTeamMembers: fetchTeamMembers,
    };
}

export function useGetActivities(page: number, limit: number, type?: number) {
    const [data, setData] = useState<ActivitiesResponse["data"] | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchActivities = async () => {
        try {
            setIsLoading(true);
            const response = await getActivities(page, limit, type ?? 0);
            const result = response as ActivitiesResponse;

            setData(result.data);
            setError(null);
            notification.success("Activities fetched successfully");
        } catch (err) {
            setError(err as Error);
            notification.error("Failed to fetch activities");
            console.error("Fetch activities error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchActivities();
    }, [page, limit, type]);

    return {
        data,
        isLoading,
        error,
        refreshActivities: fetchActivities,
    };
}

export function useGetUserPackages() {
    const [data, setData] = useState<UserPackage[] | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchUserPackages = async () => {
        try {
            setIsLoading(true);
            const response = await getUserPackages();
            const result = response as UserPackagesResponse;

            setData(result.data.packages);
            setError(null);
            notification.success("User packages fetched successfully");
        } catch (err) {
            setError(err as Error);
            notification.error("Failed to fetch user packages");
            console.error("Fetch user packages error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUserPackages();
    }, []);

    return {
        data,
        isLoading,
        error,
        refreshPackages: fetchUserPackages,
    };
}