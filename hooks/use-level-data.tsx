import { useState, useEffect } from 'react';
import { useAuth } from '@/context/auth-context';
import { getDashboard } from '@/api/user';
import { notification } from '@/utils/scaffold-eth/notification';

interface LevelDetail {
    userId: number;
    userEmail: string;
    userAddress: string;
    userDeposit: number;
}

interface Level {
    level: number;
    userCount: number;
    totalAmount: number;
    users: LevelDetail[];
}

export function useLevelData() {
    const { token } = useAuth();
    const [currentLevel, setCurrentLevel] = useState<number>(0);
    const [levels, setLevels] = useState<Level[]>([]);
    const [levelDetails, setLevelDetails] = useState<LevelDetail[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    // Fetch all levels and their details at once
    const fetchLevelsData = async () => {
        if (!token) return;

        try {
            setIsLoading(true);
            const response = await getDashboard(token);
            const levelsData = response.data.levels || [];
            setLevels(levelsData);

            // If there's a current level selected, set its details
            if (currentLevel > 0) {
                const selectedLevel: Level | undefined = levelsData.find((l: Level) => l.level === currentLevel);
                setLevelDetails(selectedLevel?.users || []);
            }
        } catch (err) {
            setError(err as Error);
            notification.error('Failed to fetch levels data');
        } finally {
            setIsLoading(false);
        }
    };

    // When level changes, update level details from cached data
    useEffect(() => {
        if (currentLevel > 0 && levels.length > 0) {
            const selectedLevel = levels.find(l => l.level === currentLevel);
            setLevelDetails(selectedLevel?.users || []);
        } else {
            setLevelDetails([]);
        }
    }, [currentLevel, levels]);

    // Initial data fetch
    useEffect(() => {
        fetchLevelsData();
    }, [token]);

    return {
        levels,
        levelDetails,
        isLoading,
        error,
        setLevel: setCurrentLevel,
        currentLevel,
        refreshData: fetchLevelsData
    };
}