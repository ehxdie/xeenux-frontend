import { useState, useEffect } from 'react';
import { useAuth } from '@/context/auth-context';
import { purchasePackage } from '@/api/package';
import { getDashboard, getUserProfile } from '@/api/user';
import { processROI, processBinaryIncome } from '@/api/income';
import { notification } from '@/utils/scaffold-eth/notification';

interface UserDashboard {
    userInfo: {
        id: number;
        name: string;
        email: string;
        phone: string;
        walletAddress: string;
        position: number;
        ref: number;
    };
    userPackages: Array<{
        id: number;
        ceilingLimit: number;
        earned: number;
        isActive: boolean;
    }>;
    pendingROI: number;
    pendingBinary: number;
    tokenInfo: {
        symbol: string;
        decimals: number;
    };
}

export function useDashboard() {
    const { token } = useAuth();
    const [data, setData] = useState<UserDashboard | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [buyStatus, setBuyStatus] = useState<'idle' | 'processing'>('idle');

    const fetchDashboardData = async () => {
        if (!token) return;

        try {
            setIsLoading(true);
            const [dashboardData, profileData] = await Promise.all([
                getDashboard(token),
                getUserProfile(token)
            ]);

            setData({
                ...dashboardData.data,
                userInfo: profileData.data
            });
        } catch (err) {
            notification.error('Failed to fetch dashboard data');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const buyPackage = async (packageIndex: number) => {
        if (!token || !data?.userInfo) return;

        try {
            setBuyStatus('processing');
            await purchasePackage(
                {
                    packageIndex,
                    position: data.userInfo.position
                },
                token
            );
            notification.success('Package purchased successfully');
            await fetchDashboardData();
        } catch (err) {
            notification.error('Failed to purchase package');
            console.error(err);
        } finally {
            setBuyStatus('idle');
        }
    };

    const claimROI = async () => {
        if (!token) return;

        try {
            setIsLoading(true);
            await processROI(token);
            notification.success('ROI claimed successfully');
            await fetchDashboardData();
        } catch (err) {
            notification.error('Failed to claim ROI');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const claimBinaryIncome = async () => {
        if (!token) return;

        try {
            setIsLoading(true);
            await processBinaryIncome(token);
            notification.success('Binary income claimed successfully');
            await fetchDashboardData();
        } catch (err) {
            notification.error('Failed to claim binary income');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, [token]);

    return {
        data,
        isLoading,
        buyPackage,
        buyStatus,
        claimROI,
        claimBinaryIncome,
        refreshData: fetchDashboardData
    };
}