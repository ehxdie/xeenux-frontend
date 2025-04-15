import { useState, useEffect } from 'react';
import { useAuth } from '@/context/auth-context';
import { getDashboardStats } from '@/api/admin';
import { notification } from '@/utils/scaffold-eth/notification';

interface DashboardStats {
    totalUsers: number;
    weeklyTurnover: number;
    totalTurnover: number;
    totalTokensBurnt: number;
    tokenInfo: {
        symbol: string;
        decimals: number;
    };
}

export function useAdminDashboard() {
    const { token } = useAuth();
    const [data, setData] = useState<DashboardStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchDashboardData = async () => {
        if (!token) return;

        try {
            setIsLoading(true);
            const response = await getDashboardStats(token);
            setData(response.data);
        } catch (err) {
            setError(err as Error);
            notification.error('Failed to fetch dashboard data');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, [token]);

    return { data, isLoading, error, refetch: fetchDashboardData };
}