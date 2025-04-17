import { useState, useEffect } from 'react';
import { useAuth } from '@/context/auth-context';
import { getDashboard } from '@/api/user';
import { requestWithdrawal } from '@/api/transactions';
import { notification } from '@/utils/scaffold-eth/notification';

interface HeroData {
    userInfo: {
        id: number;
        name: string;
        email: string;
        registeredAt: number;
        totalEarnings: number;
        totalWithdraw: number;
        availableBalance: number;
    };
    tokenInfo: {
        symbol: string;
        decimals: number;
    };
    systemInfo: {
        tokensToBeBurnt: number;
        nextPrice: number;
        lastBurnDate: number;
    };
}

export function useHeroData() {
    const { token } = useAuth();
    const [data, setData] = useState<HeroData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [withdrawStatus, setWithdrawStatus] = useState<'idle' | 'processing'>('idle');

    const fetchDashboardData = async () => {
        if (!token) return;

        try {
            setIsLoading(true);
            const response = await getDashboard(token);
            setData(response.data);
        } catch (err) {
            notification.error('Failed to fetch dashboard data');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const withdraw = async (amount: number) => {
        if (!token || !data?.userInfo?.id) return;

        try {
            setWithdrawStatus('processing');
            await requestWithdrawal({
                amount,
                walletAddress: data.userInfo.id.toString()
            }, token);
            notification.success('Withdrawal request submitted successfully');
            await fetchDashboardData(); // Refresh data after withdrawal
        } catch (err) {
            notification.error('Withdrawal request failed');
            throw err;
        } finally {
            setWithdrawStatus('idle');
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, [token]);

    return {
        data,
        isLoading,
        withdraw,
        withdrawStatus,
        refreshData: fetchDashboardData
    };
}