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
import { useAuth } from "@/context/auth-context"; // Import AuthContext
import {
    UserProfileData,
    UserProfileResponse,
    User,
    UpdateUserProfileResponse,
    DashboardResponse,
    BinaryTreeResponse,
    TeamMembersResponse,
    ActivitiesResponse,
    UserPackage,
    UserPackagesResponse,
} from "@/types/user";

// Hook for fetching user profile
export function useGetUserProfile() {
    const { token } = useAuth(); // Get token from AuthContext
    const [data, setData] = useState<UserProfileData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchUserProfile = async () => {
        try {
            setIsLoading(true);
            const response = await getUserProfile(token!); // Pass token
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
    const { token } = useAuth(); // Get token from AuthContext
    const [updatedUser, setUpdatedUser] = useState<User | null>(null);
    const [isUpdating, setIsUpdating] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchUpdateUserProfile = async (
        data: { name?: string; phone?: string; walletAddress?: string }
    ): Promise<void> => {
        try {
            setIsUpdating(true);
            setError(null);

            const response = await updateUserProfile(token!, data); // Pass token
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
        fetchUpdateUserProfile,
    };
}

// Hook for fetching dashboard data
export function useGetDashboard() {
    const { token } = useAuth(); // Get token from AuthContext
    const [data, setData] = useState<DashboardResponse["data"] | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchDashboard = async () => {
        try {
            setIsLoading(true);
            const response = await getDashboard(token!); // Pass token
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
    const { token } = useAuth(); // Get token from AuthContext
    const [data, setData] = useState<BinaryTreeResponse["data"] | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchBinaryTree = async () => {
        try {
            setIsLoading(true);
            const response = await getBinaryTree(token!); // Pass token
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
    const { token } = useAuth(); // Get token from AuthContext
    const [data, setData] = useState<TeamMembersResponse["data"] | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchTeamMembers = async () => {
        try {
            setIsLoading(true);
            const response = await getTeamMembers(token!, level, page, limit); // Pass token
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
    const { token } = useAuth(); // Get token from AuthContext
    const [data, setData] = useState<ActivitiesResponse["data"] | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchActivities = async () => {
        try {
            setIsLoading(true);
            const response = await getActivities(token!, type ?? 0, page, limit); // Pass token
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
    const { token } = useAuth(); // Get token from AuthContext
    const [data, setData] = useState<UserPackage[] | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchUserPackages = async () => {
        try {
            setIsLoading(true);
            const response = await getUserPackages(token!); // Pass token
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