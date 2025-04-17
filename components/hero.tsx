"use client";

import { ArrowUpRight, DollarSign, Wallet } from "lucide-react";
import { ReferralLinks } from "./referral-links";
import { Button } from "./ui/button";
import Image from "next/image";
import { Input } from "./ui/input";
import { CountdownTimer } from "./ui/countdown-timer";
import { useState } from "react";
import { formatAmount, shortenAddress } from "@/lib/utils";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./ui/dialog";
import { SwapSection } from "./swap-section";
import { formatDistanceToNow } from "date-fns";
import { useHeroData } from "@/hooks/use-hero";
import { notification } from "@/utils/scaffold-eth/notification";

interface HeroProps { }

export function Hero({ }: HeroProps) {
    const { data, isLoading, withdraw, withdrawStatus, refreshData } = useHeroData();
    const [amount, setAmount] = useState<string>("");

    const handleAmountChange = (value: string) => {
        if (value === "" || /^\d*\.?\d*$/.test(value)) {
            setAmount(value);
        }
    };

    const scrollToPackage = () => {
        const packageElement = document.querySelector("#select-package-section");
        if (packageElement) {
            packageElement.scrollIntoView({ behavior: "smooth" });
            const toggleDropdown = packageElement.querySelector("#select-package-trigger");
            // @ts-expect-error
            toggleDropdown?.click();
        }
    };

    const handleWithdraw = async () => {
        const numAmount = parseFloat(amount);
        if (!numAmount || numAmount <= 0) return;

        try {
            await withdraw(numAmount);
            setAmount("");
            notification.success("Withdrawal request submitted");
        } catch (error) {
            console.error("Withdrawal failed:", error);
        }
    };

    if (isLoading || !data) {
        return <div>Loading...</div>;
    }

    const { userInfo, tokenInfo, systemInfo, volumes } = data;

    return (
        <div className="flex flex-col mb-6 space-y-4 w-full overflow-x-auto">
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#4c51ff]/20 rounded-full blur-3xl" />

            <div className="flex md:flex-row flex-col justify-between md:items-center">
                <h1 className="text-2xl">Dashboard</h1>
                <div className="flex gap-2 py-2 md:px-4 rounded-full">
                    <span className="text-gray-500 text-xs sm:text-sm">
                        Time of Registration:{" "}
                        <span className="text-white font-xs">
                            {formatDistanceToNow(
                                new Date(userInfo.registeredAt * 1000)
                            )}{" "}
                            ago
                        </span>
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Token burn info */}
                <div className="flex w-full flex-colx glass-card items-center gap-4 px-4 py-2 rounded-xl">
                    <div className="lg:p-2 p-2 rounded-full bg-blue-500/20">
                        <Image src="/images/xeenux.png" alt="token" width={20} height={20} />
                    </div>
                    <div className="w-full">
                        <p className="text-sm lg:text-sm font-bold">
                            {formatAmount(systemInfo.tokensToBeBurnt)}
                        </p>
                        <p className="text-[10px] md:text-xs text-gray-400">
                            Xeenux tokens to be burned
                        </p>
                    </div>
                </div>

                {/* Next price info */}
                <div className="flex w-full flex-colx glass-card items-center gap-4 px-4 py-2 rounded-xl">
                    <div className="lg:p-2 p-2 rounded-full bg-blue-500/20">
                        <Image src="/images/xeenux.png" alt="token" width={20} height={20} />
                    </div>
                    <div className="w-full">
                        <p className="text-sm lg:text-sm font-bold">
                            {formatAmount(systemInfo.nextPrice)}
                        </p>
                        <p className="text-[10px] md:text-xs text-gray-400">
                            Upcoming Xeenux price
                        </p>
                    </div>
                </div>

                {/* Burn timer */}
                <div className="flex w-full flex-col glass-card items-center gap-4 px-2 py-2 rounded-xl">
                    <p className="text-[10px] md:text-xs text-gray-400">
                        Burning date timer
                    </p>
                    <div className="w-full">
                        <CountdownTimer
                            targetDate={new Date(systemInfo.lastBurnDate * 1000 + 30 * 24 * 60 * 60 * 1000)}
                        />
                    </div>
                </div>
            </div>

            <div className="flex gap-2 items-center w-full">
                <ReferralLinks userId={userInfo.id} />
            </div>

            {/* User stats grid */}
            <div className="p-4 md:p-10 w-full bg-[#4c51ff]/20 rounded-xl grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* User info section */}
                <div className="md:border-r border-b border-gray-400/50 w-full p-6">
                    <div className="flex flex-col">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-full bg-purple-500/20">
                                <Wallet className="lg:w-6 lg:h-6 w-4 h-4 text-purple-500" />
                            </div>
                            <p className="text-sm text-gray-200">
                                My ID: {userInfo.id}
                            </p>
                        </div>
                        <div className="text-center mt-5 border border-purple-500/30 py-3 px-5 rounded-xl w-full">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-400">Name:</span>
                                <span>{userInfo.name}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-400">Email ID:</span>
                                <span>{userInfo.email}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-400">Wallet Address</span>
                                <span>{shortenAddress(userInfo.walletAddress)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* User stats section */}
                <div className="md:border-b md:border-r-0 border-b border-gray-400/50 w-full p-4 lg:p-4">
                    <div className="flex md:flex-col items-start lg:items-center gap-4">
                        <div className="flex w-full flex-colx glass-card items-center gap-4 px-4 py-2 rounded-xl">
                            <div className="lg:p-2 p-2 rounded-full bg-blue-500/20">
                                <DollarSign className="lg:w-3 lg:h-3 w-2 h-2 text-blue-500" />
                            </div>
                            <div className="w-full">
                                <p className="text-sm lg:text-sm font-bold">
                                    {formatAmount(userInfo.totalEarnings)} {tokenInfo.symbol}
                                </p>
                                <p className="text-[10px] md:text-xs text-gray-400">
                                    Total Earnings
                                </p>
                            </div>
                        </div>

                        <div className="flex w-full flex-colx glass-card items-center gap-4 px-4 py-2 rounded-xl">
                            <div className="lg:p-2 p-2 rounded-full bg-blue-500/20">
                                <DollarSign className="lg:w-3 lg:h-3 w-2 h-2 text-blue-500" />
                            </div>
                            <div className="w-full">
                                <p className="text-sm lg:text-sm font-bold">
                                    {formatAmount(volumes.selfVolume)} {tokenInfo.symbol}
                                </p>
                                <p className="text-[10px] md:text-xs text-gray-400">
                                    Total Investment
                                </p>
                            </div>
                        </div>

                        <div className="flex w-full flex-colx glass-card items-center gap-4 px-4 py-2 rounded-xl">
                            <div className="lg:p-2 p-2 rounded-full bg-blue-500/20">
                                <DollarSign className="lg:w-3 lg:h-3 w-2 h-2 text-blue-500" />
                            </div>
                            <div className="w-full">
                                <p className="text-sm lg:text-sm font-bold">
                                    {formatAmount(userInfo.purchaseWallet)} {tokenInfo.symbol}
                                </p>
                                <p className="text-[10px] md:text-xs text-gray-400">
                                    Expense Wallet
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Withdrawal section */}
                <div className="flex flex-col md:border-r border-b border-gray-400/50 gap-3 w-full p-6">
                    <div className="flex flex-col gap-2 mt-2">
                        <div className="flex justify-between items-center">
                            <span>Available Income:</span>
                            <span className="text-sm font-bold">
                                {formatAmount(userInfo.availableBalance)} {tokenInfo.symbol}
                            </span>
                        </div>
                        <Input
                            type="text"
                            placeholder="Enter amount to withdraw"
                            className="glass-input"
                            value={amount}
                            onChange={(e) => handleAmountChange(e.target.value)}
                            disabled={withdrawStatus === 'processing'}
                        />
                        <Button
                            className="w-full glass-button"
                            onClick={handleWithdraw}
                            disabled={!amount || parseFloat(amount) === 0 || withdrawStatus === 'processing'}
                        >
                            {withdrawStatus === 'processing' ? 'Processing...' : 'Withdraw XEENUX'}
                        </Button>
                    </div>
                    <Button
                        onClick={scrollToPackage}
                        className="bg-transparent border border-purple-500/80 text-purple-500/80 rounded-xl h-12 font-semibold mx-auto w-full"
                    >
                        Invest or Buy package
                    </Button>
                </div>

                {/* Stats and swap section */}
                <div className="md:border-b md:border-r-0 border-b border-gray-400/50 w-full p-4 lg:p-4">
                    <div className="flex md:flex-col items-start lg:items-center gap-4">
                        <div className="flex w-full flex-colx glass-card items-center gap-4 px-4 py-2 rounded-xl">
                            <div className="lg:p-2 p-2 rounded-full bg-blue-500/20">
                                <DollarSign className="lg:w-3 lg:h-3 w-2 h-2 text-blue-500" />
                            </div>
                            <div className="w-full">
                                <p className="text-sm lg:text-sm font-bold">
                                    {formatAmount(userInfo.availableBalance)} {tokenInfo.symbol}
                                </p>
                                <p className="text-[10px] md:text-xs text-gray-400">
                                    Available withdraw
                                </p>
                            </div>
                        </div>

                        <div className="flex w-full flex-colx glass-card items-center gap-4 px-4 py-2 rounded-xl">
                            <div className="lg:p-2 p-2 rounded-full bg-blue-500/20">
                                <DollarSign className="lg:w-3 lg:h-3 w-2 h-2 text-blue-500" />
                            </div>
                            <div className="w-full">
                                <p className="text-sm lg:text-sm font-bold">
                                    {formatAmount(userInfo.totalWithdraw)} {tokenInfo.symbol}
                                </p>
                                <p className="text-[10px] md:text-xs text-gray-400">
                                    Total Withdraw
                                </p>
                            </div>
                        </div>

                        <Dialog>
                            <DialogTrigger className="bg-transparent border border-purple-500/80 text-purple-500/80 rounded-xl h-12 font-semibold mx-auto w-full">
                                swap USDT to {tokenInfo.symbol}
                            </DialogTrigger>
                            <DialogContent className="p-0 border-none">
                                <DialogTitle className="text-xl font-bold sr-only">
                                    Swap USDT to {tokenInfo.symbol}
                                </DialogTitle>
                                <SwapSection />
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            </div>
        </div>
    );
}