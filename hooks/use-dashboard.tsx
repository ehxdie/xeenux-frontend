import { useState, useEffect } from 'react';
import { getUserProfile, getUserPackages, getDashboard } from '@/api/user';
import { useAuth } from '@/context/auth-context';

interface UserInfo {
    rank: number;
    roiIncome: number;
    binaryIncome: number;
    rewardIncome: number;
    levelIncome: number;
    autopoolIncome: number;
}

interface UserPackage {
    id: number;
    value: number;
    status: string;
    purchaseDate: string;
    xeenuxAmount: number;
    ceilingLimit: number;
    isActive: boolean;
}

interface TeamStats {
    directTeam: number;
    totalTeam: number;
}

interface UserVolumes {
    directVolume: number;
    leftVolume: number;
    rightVolume: number;
}

interface TokenInfo {
    symbol: string;
    decimals: number;
}

export function useDashboardData() {
    const { token } = useAuth();
    const [data, setData] = useState<{
        userInfo: UserInfo | null;
        userPackages: UserPackage[];
        userTeamStats: TeamStats | null;
        userVolumes: UserVolumes | null;
        tokenInfo: TokenInfo;
    }>({
        userInfo: null,
        userPackages: [],
        userTeamStats: null,
        userVolumes: null,
        tokenInfo: {
            symbol: 'XNX',
            decimals: 18
        }
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            if (!token) return;

            try {
                setIsLoading(true);
                const [profileData, packagesData, dashboardData] = await Promise.all([
                    getUserProfile(token),
                    getUserPackages(token),
                    getDashboard(token)
                ]);

                setData({
                    userInfo: profileData.data.user,
                    userPackages: packagesData.data.packages,
                    userTeamStats: {
                        directTeam: dashboardData.data.teamStructure.directTeam,
                        totalTeam: dashboardData.data.teamStructure.totalTeam
                    },
                    userVolumes: dashboardData.data.volume,
                    tokenInfo: {
                        symbol: 'XNX',
                        decimals: 18
                    }
                });
            } catch (err) {
                setError(err as Error);
                console.error('Error fetching dashboard data:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, [token]);

    return { data, isLoading, error };
}