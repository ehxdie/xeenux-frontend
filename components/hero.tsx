"use client";

import { ArrowUpRight, DollarSign, Wallet } from "lucide-react";
import { ReferralLinks } from "./referral-links";
import { Button } from "./ui/button";
import Image from "next/image";
import { Input } from "./ui/input";
import { CountdownTimer } from "./ui/countdown-timer";
import { useEffect, useState } from "react";
import { useContractData } from "@/context/contract";
import { bigIntToString, shortenAddress, stringToBigInt } from "@/lib/utils";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./ui/dialog";
import { SwapSection } from "./swap-section";
import { UserDataKeys, useUser } from "@/context/user";
import { useWithdraw } from "@/hooks/use-user";
import toast from "react-hot-toast";
import { useLastBurnDate } from "@/hooks/use-contract";
import { useAccount } from "wagmi";
import { formatDistanceToNow } from "date-fns";

interface HeroProps {}

export function Hero({}: HeroProps) {
    const { withdraw, status, error } = useWithdraw();
    const { tokensToBeBurnt, tokenInfo, nextPrice } = useContractData();
    const { address } = useAccount();
    const {
        userInfo,
        userTotalEarnings,
        userVolumes,
        userAvailableWithdraw,
        refreshUserData,
    } = useUser();
    const { data: lastBurnTimestamp } = useLastBurnDate();
    const [amount, setAmount] = useState<string>("");
    const handleAmountChange = (value: string) => {
        if (value === "" || /^\d*\.?\d*$/.test(value)) {
            setAmount(value);
        }
    };
    const scrollToPackage = () => {
        const packageElement = document.querySelector(
            "#select-package-section",
        );
        if (packageElement) {
            packageElement.scrollIntoView({ behavior: "smooth" });
            const toggleDropdown = packageElement.querySelector(
                "#select-package-trigger",
            );
            // @ts-expect-error
            toggleDropdown?.click();
        }
    };
    const handleWithdraw = async () => {
        if (parseFloat(amount) <= 0) return;
        const txhash = await withdraw(
            stringToBigInt(amount, tokenInfo?.decimals || 0),
        );
        refreshUserData([UserDataKeys.USER_CLAIMS, UserDataKeys.USER_INFO]);
        toast.success("Withdrawal successful");
        console.log({ txhash });
    };

    return (
        <div className="flex flex-col mb-6 space-y-4 w-full overflow-x-auto">
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#4c51ff]/20 rounded-full blur-3xl" />
            <div className="flex md:flex-row flex-col justify-between md:items-center">
                <h1 className="text-2xl">Dashboard</h1>
                <div className="flex gap-2 py-2 md:px-4 rounded-full">
                    <span className="text-gray-500 text-xs sm:text-sm">
                        Time of Registration:{" "}
                        <span className="text-white font- text-xs">
                            {formatDistanceToNow(
                                new Date(
                                    Number(userInfo?.registeredAt || 0) * 1000,
                                ),
                            )}{" "}
                            ago
                            {/* {new Date(Number(userInfo?.registeredAt) * 1000).toLocaleString()} */}
                        </span>
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex w-full flex-colx glass-card items-center gap-4 px-4 py-2 rounded-xl">
                    <div className="lg:p-2 p-2 rounded-full bg-blue-500/20">
                        <Image
                            src="/images/xeenux.png"
                            alt="tether"
                            width={20}
                            height={20}
                        />
                    </div>
                    <div className="w-full">
                        <p className="text-sm lg:text-sm font-bold">
                            {bigIntToString(
                                tokensToBeBurnt || BigInt(0),
                                Number(tokenInfo?.decimals || 0),
                                0,
                            )}
                        </p>
                        <p className="text-[10px] md:text-xs text-gray-400">
                            Xeenux tokens to be burned
                        </p>
                    </div>
                </div>
                <div className="flex w-full flex-colx glass-card items-center gap-4 px-4 py-2 rounded-xl">
                    <div className="lg:p-2 p-2 rounded-full bg-blue-500/20">
                        <Image
                            src="/images/xeenux.png"
                            alt="theter"
                            width={20}
                            height={20}
                        />
                    </div>
                    <div className="w-full">
                        <p className="text-sm lg:text-sm font-bold">
                            {bigIntToString(nextPrice || BigInt(0), 18, 0)}
                        </p>
                        <p className="text-[10px] md:text-xs text-gray-400">
                            Upcoming Xeenux price
                        </p>
                    </div>
                </div>

                <div className="flex w-full flex-col glass-card items-center gap-4 px-2 py-2 rounded-xl">
                    <p className="text-[10px] md:text-xs text-gray-400">
                        Burning date timer
                    </p>
                    <div className="w-full">
                        {lastBurnTimestamp && (
                            <CountdownTimer
                                targetDate={
                                    new Date(
                                        (Number(lastBurnTimestamp) || 0) *
                                            1000 +
                                            1000 * 60 * 60 * 24 * 30,
                                    )
                                }
                            />
                        )}
                    </div>
                </div>
            </div>

            <div className="flex gap-2 items-center w-full">
                <ReferralLinks userId={Number(userInfo?.id || 0)} />
            </div>

            <div className="p-4 md:p-10 w-full bg-[#4c51ff]/20 rounded-xl grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:border-r border-b border-gray-400/50 w-full p-6">
                    <div className="flex flex-col ">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-full bg-purple-500/20">
                                <Wallet className="lg:w-6 lg:h-6 w-4 h-4 text-purple-500" />
                            </div>
                            <p className="text-sm text-gray-200">
                                My ID: {userInfo?.id?.toString()}
                            </p>
                        </div>
                        <div>
                            {/* <p className="text-sm opacity-50 font-bold">
                {Number(userInfo?.id || 0).toString()}
              </p> */}
                            <div className="text-center mt-5 border border-purple-500/30 py-3 px-5 rounded-xl w-full">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400">Name:</span>
                                    <span>{userInfo?.name}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400">
                                        Email ID:
                                    </span>
                                    <span>{userInfo?.email}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400">
                                        Wallet Address
                                    </span>
                                    <span>
                                        {shortenAddress(userInfo?.acct || "")}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="md:border-b md:border-r-0 border-b border-gray-400/50 w-full p-4  lg:p-4">
                    <div className="flex md:flex-col items-start  lg:items-center gap-4">
                        <div className="flex w-full flex-colx glass-card items-center gap-4 px-4 py-2 rounded-xl">
                            <div className="lg:p-2 p-2 rounded-full bg-blue-500/20">
                                <DollarSign className="lg:w-3 lg:h-3 w-2 h-2 text-blue-500" />
                            </div>
                            <div className="w-full">
                                <p className="text-sm lg:text-sm font-bold">
                                    {bigIntToString(
                                        userTotalEarnings,
                                        tokenInfo?.decimals || 0,
                                        0,
                                    )}{" "}
                                    {tokenInfo?.symbol}
                                </p>
                                <p className="text-[10px] md:text-xs text-gray-400">
                                    Total Earnings
                                </p>
                            </div>
                            {/* <p className="text-sm lg:text-sm font-bold">$ 0.0000</p>
                            <p className="text-xs text-gray-400">Total income</p> */}
                        </div>

                        <div className="flex w-full flex-colx glass-card items-center gap-4 px-4 py-2 rounded-xl">
                            <div className="lg:p-2 p-2 rounded-full bg-blue-500/20">
                                <DollarSign className="lg:w-3 lg:h-3 w-2 h-2 text-blue-500" />
                            </div>
                            <div className="w-full">
                                <p className="text-sm lg:text-sm font-bold">
                                    {bigIntToString(
                                        userVolumes?.selfVolume || BigInt(0),
                                        tokenInfo?.decimals || 0,
                                        0,
                                    )}{" "}
                                    {tokenInfo?.symbol}
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
                                    {bigIntToString(
                                        userInfo?.purchaseWallet || BigInt(0),
                                        tokenInfo?.decimals || 0,
                                        0,
                                    )}{" "}
                                    {tokenInfo?.symbol}
                                </p>
                                <p className="text-[10px] md:text-xs text-gray-400">
                                    Expense Wallet
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col md:border-r border-b border-gray-400/50 gap-3 w-full p-6">
                    <div className="flex flex-col gap-2 mt-2">
                        <div className="flex justify-between items-center">
                            <span>Available Income:</span>{" "}
                            <span className="text-sm font-bold">
                                {bigIntToString(
                                    userAvailableWithdraw,
                                    tokenInfo?.decimals || 0,
                                    0,
                                )}{" "}
                                {tokenInfo?.symbol}
                            </span>
                        </div>
                        <Input
                            type="text"
                            placeholder="Enter amount to withdraw"
                            className="glass-input"
                            value={amount}
                            onChange={(e) => handleAmountChange(e.target.value)}
                        />
                        <Button
                            className="w-full glass-button"
                            onClick={handleWithdraw}
                            disabled={parseFloat(amount) === 0}
                        >
                            Withdraw XEENUX
                        </Button>
                    </div>
                    <Button
                        onClick={scrollToPackage}
                        className="bg-transparent border border-purple-500/80 text-purple-500/80 rounded-xl w- h-12 font-semibold mx-auto w-full"
                    >
                        Invest or Buy package
                    </Button>
                </div>

                <div className="md:border-b md:border-r-0 border-b border-gray-400/50 w-full p-4  lg:p-4">
                    <div className="flex md:flex-col items-start  lg:items-center gap-4">
                        <div className="flex w-full flex-colx glass-card items-center gap-4 px-4 py-2 rounded-xl">
                            <div className="lg:p-2 p-2 rounded-full bg-blue-500/20">
                                <DollarSign className="lg:w-3 lg:h-3 w-2 h-2 text-blue-500" />
                            </div>
                            <div className="w-full">
                                <p className="text-sm lg:text-sm font-bold">
                                    {bigIntToString(
                                        userAvailableWithdraw,
                                        tokenInfo?.decimals || 0,
                                        0,
                                    )}{" "}
                                    {tokenInfo?.symbol}
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
                                    {bigIntToString(
                                        userInfo?.totalWithdraw || BigInt(0),
                                        tokenInfo?.decimals || 0,
                                        0,
                                    )}{" "}
                                    {tokenInfo?.symbol}
                                </p>
                                <p className="text-[10px] md:text-xs text-gray-400">
                                    Total Withdraw
                                </p>
                            </div>
                        </div>
                        <Dialog>
                            <DialogTrigger className="bg-transparent border border-purple-500/80 text-purple-500/80 rounded-xl w- h-12 font-semibold mx-auto w-full">
                                swap USDT to {tokenInfo?.symbol}
                            </DialogTrigger>
                            <DialogContent className="p-0 border-none">
                                <DialogTitle className="text-xl font-bold sr-only">
                                    Swap USDT to {tokenInfo?.symbol}
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
