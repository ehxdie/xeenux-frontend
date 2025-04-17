import { useState, useEffect } from 'react';
import { useAuth } from '@/context/auth-context';
import { getUserPackages } from '@/api/user';
import { notification } from '@/utils/scaffold-eth/notification';

interface Package {
    id: number;
    package: number;
    ceilingLimit: number;
    amount: number;
    earned: number;
    timestamp: number;
    isActive: boolean;
}

export function useUserPackages() {
    const { token } = useAuth();
    const [packages, setPackages] = useState<Package[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchPackages = async () => {
        if (!token) return;

        try {
            setIsLoading(true);
            const response = await getUserPackages(token);
            setPackages(response.data);
        } catch (err) {
            setError(err as Error);
            notification.error('Failed to fetch user packages');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPackages();
    }, [token]);

    return {
        packages,
        isLoading,
        error,
        refreshPackages: fetchPackages
    };
}