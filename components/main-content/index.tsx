"use client";

import { MainContentSection } from "./main-content-section";
import SelectPackage from "@/components/ui/select-package";
import { FormEvent, MouseEvent, useMemo, useState } from "react";
import { Button } from "../ui/button";
import { Wallet } from "lucide-react";
import { Progress } from "../ui/progress";
import UserPackages from "../dashboard/user-packages";
import UserWithdrawals from "../dashboard/use-withdrawals";
import { BinaryTree } from "../dashboard/binary-tree";
import { UserIncomes } from "../dashboard/use-income";
import { LevelDetailsAccordion } from "../dashboard/level-details";
import { useDashboard } from "@/hooks/use-user-dashboard";
import { notification } from "@/utils/scaffold-eth/notification";

export function MainContent() {
    const {
        data,
        isLoading,
        buyPackage: purchasePackage,
        buyStatus,
        claimROI,
        claimBinaryIncome,
        refreshData
    } = useDashboard();

    const [selectedPackage, setSelectedPackage] = useState(0);

    const handleBuyPackage = async (e: FormEvent) => {
        e.preventDefault();

        if (!data?.userInfo) {
            notification.error("User info not available");
            return;
        }

        try {
            await purchasePackage(selectedPackage);
        } catch (error: any) {
            console.error("Package buy failed:", error);
        }
    };

    const handleClaimROI = async (e: MouseEvent) => {
        e.stopPropagation();
        await claimROI();
    };

    const handleClaimBinary = async (e: MouseEvent) => {
        e.stopPropagation();
        await claimBinaryIncome();
    };

    const totalLimit = useMemo(() => {
        if (!data?.userPackages?.length) return 0;
        return data.userPackages.reduce((sum, pkg) => sum + pkg.ceilingLimit, 0);
    }, [data?.userPackages]);

    const totalUsed = useMemo(() => {
        if (!data?.userPackages?.length) return 0;
        return data.userPackages.reduce((sum, pkg) => sum + pkg.earned, 0);
    }, [data?.userPackages]);

    const ceilingProgress = useMemo(() => {
        if (!totalLimit) return 0;
        return (totalUsed / totalLimit) * 100;
    }, [totalLimit, totalUsed]);

    if (isLoading || !data) {
        return <div>Loading...</div>;
    }

    return (
        <div className="flex flex-col gap-4 relative">
            <MainContentSection
                title="Ceiling Limit(4X)"
                content={
                    <div className="flex flex-col gap-2">
                        <Progress
                            value={ceilingProgress || 1}
                            className="h-2 bg-gray-700"
                        />
                        <div className="flex justify-center items-center gap-5 text-xs tracking-tighter">
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 bg-purple-500 rounded-full"></span>
                                <span className="text-gray-50">
                                    Total ({totalLimit} {data.tokenInfo.symbol})
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 bg-gray-700 rounded-full"></span>
                                <span className="text-gray-50">
                                    Available ({totalLimit - totalUsed} {data.tokenInfo.symbol})
                                </span>
                            </div>
                        </div>
                    </div>
                }
            />

            <MainContentSection
                title="Invest or Buy Packages"
                id="select-package-section"
                triggerId="select-package-trigger"
                content={
                    <SelectPackage
                        value={selectedPackage}
                        onChange={setSelectedPackage}
                        disabled={buyStatus === 'processing'}
                    >
                        <Button
                            onClick={handleBuyPackage}
                            disabled={buyStatus === 'processing'}
                            className="bg-purple-500 rounded-xl h-12 font-semibold w-full hover:bg-purple-500/80"
                        >
                            {buyStatus === 'processing' ? (
                                'Processing...'
                            ) : (
                                <>
                                    <Wallet className="h-4" />
                                    Buy Package
                                </>
                            )}
                        </Button>
                    </SelectPackage>
                }
            />

            <MainContentSection
                title={
                    <div className="flex items-center w-full flex-1 gap-2">
                        <span>ROI Income</span>
                        <span className="text-xs">
                            (Pending: {data.pendingROI} {data.tokenInfo.symbol})
                        </span>
                        <button
                            className="py-1 px-2 text-sm rounded-[5px] bg-purple-500 flex justify-center items-center hover:!border-purple-500/50"
                            onClick={handleClaimROI}
                        >
                            Claim
                        </button>
                    </div>
                }
                content={<UserIncomes _type={2} />}
            />

            <MainContentSection
                title={
                    <div className="flex items-center w-full flex-1 gap-2">
                        <span>Binary Income</span>
                        <span className="text-xs">
                            (Pending: {data.pendingBinary} {data.tokenInfo.symbol})
                        </span>
                        <button
                            className="py-1 px-2 text-sm rounded-[5px] bg-purple-500 flex justify-center items-center hover:!border-purple-500/50"
                            onClick={handleClaimBinary}
                        >
                            Claim
                        </button>
                    </div>
                }
                content={<UserIncomes _type={5} />}
            />

            <MainContentSection
                title="Level Income"
                content={<UserIncomes _type={1} />}
            />

            <MainContentSection
                title="AutoLevel Booster"
                content={<UserIncomes _type={3} />}
            />

            <MainContentSection
                title="Weekly Reward"
                content={<UserIncomes _type={4} />}
            />

            <MainContentSection
                title="Binary Tree"
                className="!overflow-x-scroll"
                content={<BinaryTree userId={data.userInfo.id} />}
            />

            <MainContentSection
                title="Package History"
                content={<UserPackages userPackages={data.userPackages} withInactive />}
            />

            <MainContentSection
                title="Withdraw History"
                content={<UserWithdrawals />}
            />

            <MainContentSection
                title="Full Team"
                content={<LevelDetailsAccordion />}
            />
        </div>
    );
}