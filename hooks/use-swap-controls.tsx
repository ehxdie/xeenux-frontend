import { useState, useEffect } from 'react';
import { useAuth } from '@/context/auth-context';
import { getDashboardStats, updateSettings } from '@/api/admin';
import { notification } from '@/utils/scaffold-eth/notification';

interface SwapControlsData {
    lastBurnDate: number;
    tokensToBeBurnt: number;
    swapFee: number;
    tokenInfo: {
        symbol: string;
        decimals: number;
    };
}

export function useSwapControls() {
    const { token } = useAuth();
    const [data, setData] = useState<SwapControlsData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchSwapData = async () => {
        if (!token) return;

        try {
            setIsLoading(true);
            const response = await getDashboardStats(token);
            setData(response.data);
        } catch (err) {
            setError(err as Error);
            notification.error('Failed to fetch swap control data');
        } finally {
            setIsLoading(false);
        }
    };

    const updateSwapFee = async (newFee: number) => {
        if (!token) return;

        try {
            setIsLoading(true);
            await updateSettings(
                {
                    key: 'swap_fee',
                    value: newFee,
                    group: 'swap',
                    description: 'Swap fee percentage'
                },
                token
            );
            notification.success('Swap fee updated successfully');
            await fetchSwapData();
        } catch (err) {
            notification.error('Failed to update swap fee');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSwapData();
    }, [token]);

    return {
        data,
        isLoading,
        error,
        updateSwapFee,
        refetch: fetchSwapData
    };
}