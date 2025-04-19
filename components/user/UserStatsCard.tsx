"use client";

import { useGetDashboard } from "@/hooks/use-users";
import { Loader } from "../ui/loader";

// Interfaces for the dashboard response
interface User {
    name: string;
    rank: number;
}

interface Incomes {
    total: number;
}

interface ActivePackage {
    package: string;
}

interface DashboardResponseData {
    user: User;
    incomes: Incomes;
    activePackages: ActivePackage[];
}

export function UserStatsCard() {
    const { data, isLoading, error } = useGetDashboard();
    console.log("data:", data);

    if (isLoading) {
        return <Loader />;
    }

    if (error) {
        return <div className="text-red-500">Failed to load user stats.</div>;
    }

    const { incomes, activePackages, user } = (data as DashboardResponseData) || {};
    const activePackage = activePackages?.[0]?.package || "N/A";
    const totalEarnings = incomes?.total || 0;
    const currentLevel = user?.rank || "N/A";

    return (
        <div className="p-6 bg-white shadow-md rounded-lg">
            <h2 className="text-xl font-semibold mb-4">User Stats</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex flex-col items-center">
                    <span className="text-gray-500">Total Earnings</span>
                    <span className="text-lg font-bold">${totalEarnings.toFixed(2)}</span>
                </div>
                <div className="flex flex-col items-center">
                    <span className="text-gray-500">Active Package</span>
                    <span className="text-lg font-bold">{activePackage}</span>
                </div>
                <div className="flex flex-col items-center">
                    <span className="text-gray-500">Current Level</span>
                    <span className="text-lg font-bold">{currentLevel}</span>
                </div>
            </div>
        </div>
    );
}
