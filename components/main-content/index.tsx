"use client";

import { MainContentSection } from "./main-content-section";
import SelectPackage from "@/components/ui/select-package";
import { FormEvent, MouseEvent, useMemo, useState } from "react";
import { UserDataKeys, useUser } from "@/context/user";
import { useRegister } from "@/hooks/use-register";
import { Button } from "../ui/button";
import { Wallet } from "lucide-react";
import { Progress } from "../ui/progress";
import UserPackages from "../dashboard/user-packages";
import UserWithdrawals from "../dashboard/user-withdrawals";
import { BinaryTree } from "../dashboard/binary-tree";
import { UserIncomes } from "../dashboard/use-income";
import { bigIntToString } from "@/lib/utils";
import { useContractData } from "@/context/contract";
import { LevelDetailsAccordion } from "../dashboard/level-details";
import { useAccount } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { notification } from "@/utils/scaffold-eth";
import { useClaimIncome } from "@/hooks/use-user";

export function MainContent() {
    const { userInfo, refreshUserData, userPackages } = useUser();
    const [buyPackage, setBuyPackage] = useState(0);
    const { tokenInfo } = useContractData();
    const { pendingROI, pendingBinary } = useUser();
    const { claimRoi, claimBinary } = useClaimIncome(userInfo?.id || 0n);
    const claimROI = async (e: MouseEvent) => {
        e.stopPropagation();
        await claimRoi();
    };
    const claimBinaryIncome = async (e: MouseEvent) => {
        e.stopPropagation();
        await claimBinary();
    };
    const {
        registerUser,
        isPriceReady,
        setPackageIndex,
        isPriceError,
        status,
    } = useRegister({
        _package: buyPackage,
    });
    const { isConnected } = useAccount();
    const { openConnectModal } = useConnectModal();
    const handleBuyPackage = async (e: FormEvent) => {
        e.preventDefault();
        if (!isConnected) {
            notification.error("Please connect your wallet");
            openConnectModal?.();
            return;
        }
        if (!isPriceReady) {
            notification.error("Please wait for the package price to load");
            return;
        }
        if (isPriceError) {
            notification.error("Error loading package price");
            return;
        }
        try {
            // Call contract register function
            await registerUser({
                _name: userInfo?.name!,
                _email: userInfo?.email!,
                _phone: userInfo?.phone!,
                _position: Number(userInfo?.position),
                _package: buyPackage,
                _ref: Number(userInfo?.ref)!,
            });
            // notification.success("Package bought successfully");
            refreshUserData([
                UserDataKeys.USER_INFO,
                UserDataKeys.USER_PACKAGES,
            ]);
            // window.location.reload();
        } catch (error: any) {
            console.error("Package buy failed:", error);
            // toast.error(
            //   "Package buy failed: " + error?.message || error || "Unknown error"
            // );
        }
    };
    const totalLimit = useMemo(() => {
        let totalLimit = BigInt(0);
        if (!userPackages || userPackages.length === 0) return totalLimit; // Avoid errors when data isn't available

        userPackages.forEach((pkg) => {
            totalLimit += pkg.ceilingLimit; // Sum total ceiling limits
        });

        return totalLimit;
    }, [userPackages]);

    const totalUsed = useMemo(() => {
        let totalUsed = BigInt(0);
        if (!userPackages || userPackages.length === 0) return totalUsed; // Avoid errors when data isn't available

        userPackages.forEach((pkg) => {
            totalUsed += pkg.earned; // Sum total earned amounts
        });

        return totalUsed;
    }, [userPackages]);

    const ceilingProgress = useMemo(() => {
        if (!userPackages || userPackages.length === 0) return 0; // Avoid errors when data isn't available

        let totalCeiling = 0;
        let totalEarned = 0;
        userPackages.forEach((pkg) => {
            totalCeiling += Number(pkg.ceilingLimit); // Sum total ceiling limits
            totalEarned += Number(pkg.earned); // Sum total earned amounts
        });

        return totalCeiling > 0 ? (totalEarned / totalCeiling) * 100 : 0; // Return percentage
    }, [userPackages]);
    return (
        <div className="flex flex-col gap-4 relative">
            {/* <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#4c51ff,rgba(177,84,255,0.4),rgba(0,212,255,0.15),transparent_70%)]" /> */}
            {/* <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[#4c51ff]/20 rounded-full blur-3xl" /> */}
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
                                    Total (
                                    {bigIntToString(
                                        totalLimit,
                                        tokenInfo?.decimals || 0,
                                        0,
                                    )}{" "}
                                    {tokenInfo?.symbol})
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 bg-gray-700 rounded-full"></span>
                                <span className="text-gray-50">
                                    Available (
                                    {bigIntToString(
                                        totalLimit - totalUsed,
                                        tokenInfo?.decimals || 0,
                                        0,
                                    )}{" "}
                                    {tokenInfo?.symbol})
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
                        value={buyPackage}
                        onChange={(value) => {
                            setPackageIndex(value);
                            setBuyPackage(value);
                        }}
                        disabled={status !== "idle"}
                    >
                        <Button
                            type={isConnected ? "submit" : "button"}
                            className={`bg-purple-500 rounded-xl h-12 font-semibold w-full hover:bg-purple-500/80`}
                            disabled={status !== "idle"}
                            onClick={
                                isConnected
                                    ? handleBuyPackage
                                    : openConnectModal
                            }
                        >
                            {status === "idle" && (
                                <>
                                    <Wallet className="h-4" />
                                    {isConnected
                                        ? "Buy Package"
                                        : "Connect wallet"}
                                </>
                            )}
                            {status === "approving" && <>Approving...</>}
                            {status === "registering" && <>Processing...</>}
                            {status === "reading-price" && <>Processing...</>}
                        </Button>
                        {/* <Button
              type="button"
              className="py-4 w-full rounded-xl h-11 bg-purple-500 flex justify-center items-center hover:!border-purple-500"
            >
              {" "}
              <Wallet className="h-4" /> Buy package
            </Button> */}
                    </SelectPackage>
                }
            />

            <MainContentSection
                title={
                    <div className="flex items-center w-full flex-1 gap-2">
                        <span>ROI Income</span>
                        <span className="text-xs">
                            (Pending:{" "}
                            {bigIntToString(
                                pendingROI || 0n,
                                tokenInfo?.decimals,
                                0,
                            )}{" "}
                            {tokenInfo?.symbol})
                        </span>
                        <button
                            className="py-1 px-2 text-sm rounded-[5px] bg-purple-500 flex justify-center items-center hover:!border-purple-500/50"
                            onClick={claimROI}
                        >
                            Claim
                        </button>
                    </div>
                }
                content={<UserIncomes _type={2} />}
            />
            {/* <MainContentSection
                title={
                    <div className="flex items-center w-full flex-1 gap-2">
                        <span>Binary Income</span>
                        <span className="text-xs">
                            (Pending:{" "}
                            {bigIntToString(
                                pendingBinary || 0n,
                                tokenInfo?.decimals,
                                0,
                            )}{" "}
                            {tokenInfo?.symbol})
                        </span>
                        <button
                            className="py-1 px-2 text-sm rounded-[5px] bg-purple-500 flex justify-center items-center hover:!border-purple-500/50"
                            onClick={claimBinaryIncome}
                        >
                            Claim
                        </button>
                    </div>
                }
                content={<UserIncomes _type={5} />}
            /> */}
            <MainContentSection
                title={"Binary Income"}
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

            {/* <MainContentSection
        title="My Tree"
        content={<BinaryTreeX data={treeData} />}
      /> */}
            <MainContentSection
                title="Binary Tree"
                className="!overflow-x-scroll"
                content={<BinaryTree userId={userInfo?.id || BigInt(0)} />}
            />

            <MainContentSection
                title="Package History"
                content={
                    <UserPackages userPackages={userPackages} withInactive />
                }
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
