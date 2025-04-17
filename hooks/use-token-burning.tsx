import { useState, useEffect } from 'react';
import { useAuth } from '@/context/auth-context';
import { getDashboardStats, updateSettings } from '@/api/admin';
import { notification } from '@/utils/scaffold-eth/notification';

interface TokenBurningData {
    lastBurnDate: number;
    tokensToBeBurnt: number;
    tokenInfo: {
        symbol: string;
        decimals: number;
    };
    swapFee: number;
}

export function useTokenBurning() {
    const { token } = useAuth();
    const [data, setData] = useState<TokenBurningData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchTokenData = async () => {
        if (!token) return;

        try {
            setIsLoading(true);
            const response = await getDashboardStats(token);
            setData(response.data);
        } catch (err) {
            setError(err as Error);
            notification.error('Failed to fetch token data');
        } finally {
            setIsLoading(false);
        }
    };

    const burnTokens = async (amount: number) => {
        if (!token) return;

        try {
            setIsLoading(true);
            await updateSettings(
                {
                    key: 'burn_tokens',
                    value: amount,
                    group: 'token',
                    description: 'Manual token burn'
                },
                token
            );
            notification.success('Tokens burned successfully');
            await fetchTokenData(); // Refresh data after burning
        } catch (err) {
            notification.error('Failed to burn tokens');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTokenData();
    }, [token]);

    return {
        data,
        isLoading,
        error,
        burnTokens,
        refreshData: fetchTokenData
    };
}