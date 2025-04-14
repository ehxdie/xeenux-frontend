"use client";

import { useUser } from "@/context/user";
import { SidebarDropdown } from "./sidebar-dropdown";
import { HourglassIcon, Users, DollarSign, Package } from "lucide-react";
import { ranks } from "@/lib/data/rank";
import { bigIntToString } from "@/lib/utils";
import { useContractData } from "@/context/contract";
import UserPackages from "../dashboard/user-packages";

export function Sidebar() {
    const { userInfo, userPackages, userTeamStats, userVolumes } = useUser();
    const { tokenInfo } = useContractData();
    const rankName = ranks[Number(userInfo?.rank)] || "UNKNOWN";
    // const package = packages.find(p => p.value === Number(userInfo?.package));
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
                            {bigIntToString(
                                (userInfo?.roiIncome || BigInt(0)) +
                                    (userInfo?.binaryIncome || BigInt(0)) +
                                    (userInfo?.rewardIncome || BigInt(0)) +
                                    (userInfo?.levelIncome || BigInt(0)) +
                                    (userInfo?.autopoolIncome || BigInt(0)),
                                tokenInfo?.decimals || 0,
                                0,
                            )}{" "}
                            {tokenInfo?.symbol}
                        </span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-400">ROI income</span>
                        <span className="text-gray-200">
                            {bigIntToString(
                                userInfo?.roiIncome || BigInt(0),
                                tokenInfo?.decimals || 0,
                                0,
                            )}{" "}
                            {tokenInfo?.symbol}
                        </span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Binary income</span>
                        <span className="text-gray-200">
                            {bigIntToString(
                                userInfo?.binaryIncome || BigInt(0),
                                tokenInfo?.decimals || 0,
                                0,
                            )}{" "}
                            {tokenInfo?.symbol}
                        </span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Level Income</span>
                        <span className="text-gray-200">
                            {bigIntToString(
                                userInfo?.levelIncome || BigInt(0),
                                tokenInfo?.decimals || 0,
                                0,
                            )}{" "}
                            {tokenInfo?.symbol}
                        </span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-400">AutoLevel Booster</span>
                        <span className="text-gray-200">
                            {bigIntToString(
                                userInfo?.autopoolIncome || BigInt(0),
                                tokenInfo?.decimals || 0,
                                0,
                            )}{" "}
                            {tokenInfo?.symbol}
                        </span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Weekly Reward</span>
                        <span className="text-gray-200">
                            {bigIntToString(
                                userInfo?.rewardIncome || BigInt(0),
                                tokenInfo?.decimals || 0,
                                0,
                            )}{" "}
                            {tokenInfo?.symbol}
                        </span>
                    </div>
                </div>
            </SidebarDropdown>

            <SidebarDropdown
                title="Active Packages"
                icon={<Package className="w-5 h-5 text-purple-400" />}
            >
                {userPackages && userPackages?.length > 0 ? (
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
                            {Number(userTeamStats?.directTeam || 0)}
                        </span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Total Team</span>
                        <span className="text-gray-200">
                            {Number(userTeamStats?.totalTeam || 0)}
                        </span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Direct Business</span>
                        <span className="text-gray-200">
                            {bigIntToString(
                                userVolumes?.directVolume || BigInt(0),
                                Number(tokenInfo?.decimals || 0),
                                0,
                            )}{" "}
                            {tokenInfo?.symbol}
                        </span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Total Business</span>
                        <span className="text-gray-200">
                            {bigIntToString(
                                (userVolumes?.leftVolume || BigInt(0)) +
                                    (userVolumes?.rightVolume || BigInt(0)),
                                Number(tokenInfo?.decimals || 0),
                                0,
                            )}{" "}
                            {tokenInfo?.symbol}
                        </span>
                    </div>
                </div>
            </SidebarDropdown>
        </div>
    );
}
