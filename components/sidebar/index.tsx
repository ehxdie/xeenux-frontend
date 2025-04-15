"use client";

import { SidebarDropdown } from "./sidebar-dropdown";
import { HourglassIcon, Users, DollarSign, Package } from "lucide-react";
import { ranks } from "@/lib/data/rank";
import { bigIntToString } from "@/lib/utils";
import UserPackages from "../dashboard/user-packages";
import { useDashboardData } from "@/hooks/use-dashboard";
import { Skeleton } from "@/components/ui/skeleton";

export function Sidebar() {
    const { data, isLoading, error } = useDashboardData();

    if (error) {
        return (
            <div className="space-y-4">
                <div className="p-4 text-red-500 bg-red-100 rounded-lg">
                    Failed to load dashboard data
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-[60px] w-full" />
                <Skeleton className="h-[200px] w-full" />
                <Skeleton className="h-[100px] w-full" />
                <Skeleton className="h-[150px] w-full" />
            </div>
        );
    }

    const { userInfo, userPackages, userTeamStats, userVolumes, tokenInfo } = data;
    const rankName = ranks[userInfo?.rank || 0] || "UNKNOWN";

    return (
        <div className="space-y-4">
            <SidebarDropdown
                title="Rank"
                icon={<HourglassIcon className="w-5 h-5 text-purple-400" />}
            >
                <p className="text-sm text-gray-400 uppercase pt-4 font-bold">
                    {rankName}
                </p>
            </SidebarDropdown>

            <SidebarDropdown
                title="My Income"
                icon={<DollarSign className="w-5 h-5 text-purple-400" />}
            >
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Total Earned</span>
                        <span className="text-gray-200">
                            {((userInfo?.roiIncome || 0) +
                                (userInfo?.binaryIncome || 0) +
                                (userInfo?.rewardIncome || 0) +
                                (userInfo?.levelIncome || 0) +
                                (userInfo?.autopoolIncome || 0)).toFixed(2)}{" "}
                            {tokenInfo.symbol}
                        </span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-400">ROI income</span>
                        <span className="text-gray-200">
                            {(userInfo?.roiIncome || 0).toFixed(2)} {tokenInfo.symbol}
                        </span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Binary income</span>
                        <span className="text-gray-200">
                            {(userInfo?.binaryIncome || 0).toFixed(2)} {tokenInfo.symbol}
                        </span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Level Income</span>
                        <span className="text-gray-200">
                            {(userInfo?.levelIncome || 0).toFixed(2)} {tokenInfo.symbol}
                        </span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-400">AutoLevel Booster</span>
                        <span className="text-gray-200">
                            {(userInfo?.autopoolIncome || 0).toFixed(2)} {tokenInfo.symbol}
                        </span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Weekly Reward</span>
                        <span className="text-gray-200">
                            {(userInfo?.rewardIncome || 0).toFixed(2)} {tokenInfo.symbol}
                        </span>
                    </div>
                </div>
            </SidebarDropdown>

            <SidebarDropdown
                title="Active Packages"
                icon={<Package className="w-5 h-5 text-purple-400" />}
            >
                {userPackages && userPackages.length > 0 ? (
                    <UserPackages userPackages={userPackages} />
                ) : (
                    <p className="text-sm text-gray-400">No active packages</p>
                )}
            </SidebarDropdown>

            <SidebarDropdown
                title="My Team"
                icon={<Users className="w-5 h-5 text-purple-400" />}
            >
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Direct Team</span>
                        <span className="text-gray-200">
                            {userTeamStats?.directTeam || 0}
                        </span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Total Team</span>
                        <span className="text-gray-200">
                            {userTeamStats?.totalTeam || 0}
                        </span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Direct Business</span>
                        <span className="text-gray-200">
                            {(userVolumes?.directVolume || 0).toFixed(2)} {tokenInfo.symbol}
                        </span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Total Business</span>
                        <span className="text-gray-200">
                            {((userVolumes?.leftVolume || 0) + (userVolumes?.rightVolume || 0)).toFixed(2)}{" "}
                            {tokenInfo.symbol}
                        </span>
                    </div>
                </div>
            </SidebarDropdown>
        </div>
    );
}