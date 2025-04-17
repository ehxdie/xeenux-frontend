import { useState, useEffect } from 'react';
import { useAuth } from '@/context/auth-context';
import { getMyIncomes } from '@/api/income';
import { notification } from '@/utils/scaffold-eth/notification';

export enum IncomeType {
    ROI = 'roi',
    BINARY = 'binary',
    REFERRAL = 'referral',
    AUTOPOOL = 'autopool',
    LEVEL = 'level'
}

interface Income {
    id: string;
    amount: number;
    timestamp: number;
    type: IncomeType;
    level?: number;
}

export function useIncome(type: IncomeType) {
    const { token } = useAuth();
    const [data, setData] = useState<Income[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [page, setPage] = useState(1);
    const [limit] = useState(10);

    const fetchIncomeData = async () => {
        if (!token) return;

        try {
            setIsLoading(true);
            const response = await getMyIncomes(
                { type, page, limit },
                token
            );
            setData(response.data);
        } catch (err) {
            setError(err as Error);
            notification.error('Failed to fetch income data');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchIncomeData();
    }, [token, page, type]);

    return {
        data,
        isLoading,
        error,
        page,
        setPage,
        refreshData: fetchIncomeData
    };
}