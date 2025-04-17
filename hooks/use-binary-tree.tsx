import { useState, useEffect } from 'react';
import { useAuth } from '@/context/auth-context';
import { getBinaryTree } from '@/api/income';
import { getUserProfile, getDashboard } from '@/api/user';
import { notification } from '@/utils/scaffold-eth/notification';

interface BinaryNode {
    id: number;
    name: string;
    leftCount: number;
    rightCount: number;
    leftVolume: number;
    rightVolume: number;
    leftCarryForward: number;
    rightCarryForward: number;
    leftChildId: number;
    rightChildId: number;
}

export function useBinaryTreeData(userId: number) {
    const { token } = useAuth();
    const [data, setData] = useState<BinaryNode | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!token) return;

            try {
                setIsLoading(true);
                const response = await getBinaryTree({ depth: 3 }, token);
                setData(response.data);
            } catch (err) {
                setError(err as Error);
                notification.error('Failed to fetch binary tree data');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [token, userId]);

    return { data, isLoading, error };
}

export function useUserData() {
    const { token } = useAuth();
    const [data, setData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!token) return;

            try {
                setIsLoading(true);
                const [userProfile, dashboardData] = await Promise.all([
                    getUserProfile(token),
                    getDashboard(token)
                ]);

                setData({
                    ...userProfile.data,
                    ...dashboardData.data
                });
            } catch (err) {
                setError(err as Error);
                notification.error('Failed to fetch user data');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [token]);

    return { data, isLoading, error };
}