import { useState, useEffect } from 'react';
import { useAuth } from '@/context/auth-context';
import { processROI, processBinaryIncome } from '@/api/income';
import { getDashboardStats } from '@/api/admin';
import { notification } from '@/utils/scaffold-eth/notification';

interface IncomeDistributionData {
    roiIncomeLastDist: number;
    weeklyRewardLastDist: number;
    binaryIncomeLastDist: number;
    allIncomeDistTime: number;
    weeklyRewardDistTime: number;
}

export function useIncomeDistribution() {
    const { token } = useAuth();
    const [data, setData] = useState<IncomeDistributionData | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const fetchDistributionData = async () => {
        try {
            setIsLoading(true);
            if (!token) {
                throw new Error('Token is required to fetch distribution data');
            }
            const response = await getDashboardStats(token);
            setData(response.data);
        } catch (error) {
            notification.error('Failed to fetch distribution data');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDistribute = async (
        distributeFn: (token: string) => Promise<any>,
        type: string
    ) => {
        try {
            setIsLoading(true);
            if (!token) {
                throw new Error('Token is required to fetch distribution data');
            }
            await distributeFn(token);
            notification.success(`${type} distributed successfully`);
            await fetchDistributionData(); // Refresh data after distribution
        } catch (error) {
            notification.error(`Failed to distribute ${type}`);
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchDistributionData();
    }, [token]);

    return {
        data,
        isLoading,
        distributeROI: () => handleDistribute(processROI, 'ROI'),
        distributeBinaryIncome: () => handleDistribute(processBinaryIncome, 'Binary Income'),
        refreshData: fetchDistributionData
    };
}