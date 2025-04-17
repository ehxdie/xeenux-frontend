import { useState, useEffect } from 'react';
import { useAuth } from '@/context/auth-context';
import { getMyTransactions } from '@/api/transactions';
import { notification } from '@/utils/scaffold-eth/notification';

interface Withdrawal {
    id: string;
    amount: number;
    timestamp: number;
    status: 'pending' | 'completed' | 'rejected';
}

export function useWithdrawals() {
    const { token } = useAuth();
    const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [page, setPage] = useState(1);
    const [limit] = useState(10);

    const fetchWithdrawals = async () => {
        if (!token) return;

        try {
            setIsLoading(true);
            const response = await getMyTransactions(
                {
                    type: 'withdrawal',
                    page,
                    limit
                },
                token
            );
            setWithdrawals(response.data);
        } catch (err) {
            setError(err as Error);
            notification.error('Failed to fetch withdrawals');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchWithdrawals();
    }, [token, page]);

    return {
        data: withdrawals,
        isLoading,
        error,
        page,
        setPage,
        refreshWithdrawals: fetchWithdrawals
    };
}