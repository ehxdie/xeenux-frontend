"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowDownUp } from "lucide-react";
import { TokenSelector } from "./swap/token-selector";
import { SwapSettings } from "./swap/swap-settings";
import { SwapDetails } from "./swap/swap-details";
import { useUsdtBalance, useXeeBalance } from "@/hooks/use-contract";
import { bigIntToString, formatAmount, stringToBigInt } from "@/lib/utils";
import { useContractData } from "@/context/contract";
import { useSwapFee, useSwapUsdtToXee, useSwapXeeToUsdt } from "@/hooks/use-swap";
import { useAccount } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { notification } from "@/utils/scaffold-eth";
interface Token {
  symbol: string;
  icon: string;
  balance: string;
  amount: string;
  decimals: number | null;
  isBalanceLoading: boolean;
}
const usdtToken: Token = {
  symbol: "USDT",
  icon: "/images/tether.svg",
  balance: "0",
  amount: "0",
  decimals: 18, // USDT is always 18
  isBalanceLoading: true,
};

const xeeToken: Token = {
  symbol: "XEE",
  icon: "/images/xeenux.png",
  balance: "0",
  amount: "0",
  decimals: null, // Will be updated when tokenInfo loads
  isBalanceLoading: true,
};
// Helper to handle decimal conversions between tokens
function adjustDecimals(
  amount: bigint,
  inputDecimals: number,
  outputDecimals: number
): bigint {
  const difference = outputDecimals - inputDecimals;
  if (difference > 0) {
    return amount * BigInt(10 ** difference);
  } else if (difference < 0) {
    return amount / BigInt(10 ** Math.abs(difference));
  }
  return amount;
}

// Convert USDT amount to XEE amount
function calculateUsdtToXee(
  usdtAmount: string,
  swapPrice: bigint,
  xeeDecimals: number
): string {
  try {
    // Convert input amount to BigInt with USDT decimals (18)
    const amountBigInt: bigint = stringToBigInt(usdtAmount, 18);

    // First conversion step: amt * 1e18 / swapPrice
    const initialConversion = (amountBigInt * BigInt(10 ** 18)) / swapPrice;

    // Adjust decimals between tokens
    const finalAmount = adjustDecimals(initialConversion, 18, xeeDecimals);

    // Convert back to string for display
    return bigIntToString(finalAmount, xeeDecimals);
  } catch {
    return "0";
  }
}

// Convert XEE amount to USDT amount
function calculateXeeToUsdt(
  xeeAmount: string,
  swapPrice: bigint,
  xeeDecimals: number
): string {
  try {
    // Convert input amount to BigInt with XEE decimals
    const amountBigInt = stringToBigInt(xeeAmount, xeeDecimals);

    // First conversion step: amt * swapPrice / 1e18
    const initialConversion = (amountBigInt * swapPrice) / BigInt(10 ** 18);

    // Adjust decimals between tokens
    const finalAmount = adjustDecimals(initialConversion, xeeDecimals, 18);

    // Convert back to string for display
    return bigIntToString(finalAmount, 18);
  } catch {
    return "0";
  }
}
function calculatePriceImpact(
  originalPrice: number,
  swapAmount: number,
  swapUSDTLiquidity: number,
  swapXeenuxLiquidity: number,
  isBuying: boolean
): number {
  // Simulate the new liquidity state after swap
  let newUSDTLiquidity = isBuying
    ? swapUSDTLiquidity + swapAmount
    : swapUSDTLiquidity - (swapAmount * originalPrice) / 1e18;
  let newXeenuxLiquidity = isBuying
    ? swapXeenuxLiquidity - (swapAmount * 1e18) / originalPrice
    : swapXeenuxLiquidity + swapAmount;

  // Calculate new price after the swap
  let newPrice = (newUSDTLiquidity * 1e18) / newXeenuxLiquidity;

  // Compute price impact %
  let priceImpact = (1 - newPrice / originalPrice) * 100;

  return Math.abs(priceImpact); // Ensure positive value
}

export function SwapSection() {
  const { isConnected } = useAccount();
  const { openConnectModal  } = useConnectModal();
  const [fromToken, setFromToken] = useState({ ...usdtToken });
  const [toToken, setToToken] = useState({ ...xeeToken });
  const [slippage, setSlippage] = useState("0.5");
  const {
    data: xeeBalanceData,
    queryKey: xeeBalanceKey,
    refetch: refetchXeeBalance,
  } = useXeeBalance();
  const {
    data: usdtBalanceData,
    queryKey: usdtBalanceKey,
    refetch: refetchUsdtBalance,
  } = useUsdtBalance();
  const { tokenInfo, swapPrice } = useContractData();
  const { data: swapFee } = useSwapFee();
  async function refetchTokenBalances() {
    await refetchXeeBalance();
    await refetchUsdtBalance();
  }
  const {
    swap: swapUsdtToXee,
    status: usdtToXeeStatus,
    error: usdtToXeeError,
  } = useSwapUsdtToXee();

  const {
    swap: swapXeeToUsdt,
    status: xeeToUsdtStatus,
    error: xeeToUsdtError,
  } = useSwapXeeToUsdt();
  useEffect(() => {
    if (tokenInfo?.decimals !== undefined) {
      setToToken((prev) => ({
        ...prev,
        decimals: tokenInfo.decimals,
      }));
    }
  }, [tokenInfo?.decimals]);
  useEffect(() => {
    if (usdtBalanceData !== undefined) {
      setFromToken((prev) => ({
        ...prev,
        balance: bigIntToString(usdtBalanceData, 18),
        isBalanceLoading: false,
      }));
    }
  }, [usdtBalanceData]);

  useEffect(() => {
    if (xeeBalanceData !== undefined && tokenInfo?.decimals !== undefined) {
      setToToken((prev) => ({
        ...prev,
        balance: bigIntToString(xeeBalanceData, Number(tokenInfo.decimals)),
        isBalanceLoading: false,
      }));
    }
  }, [xeeBalanceData, tokenInfo?.decimals]);
  const handleSwapTokens = () => {
    const tempToken = { ...fromToken };
    setFromToken({ ...toToken });
    setToToken(tempToken);
  };

  const swapStatus = useMemo(() => {
    if (fromToken.symbol === "USDT") {
      return usdtToXeeStatus;
    }
    return xeeToUsdtStatus;
  }, [fromToken.symbol, usdtToXeeStatus, xeeToUsdtStatus]);

  const calculateOutputAmount = (inputAmount: string): string => {
    if (!swapPrice || !tokenInfo?.decimals) return "0";

    if (fromToken.symbol === "USDT") {
      return calculateUsdtToXee(
        inputAmount,
        swapPrice,
        Number(tokenInfo.decimals)
      );
    } else {
      return calculateXeeToUsdt(
        inputAmount,
        swapPrice,
        Number(tokenInfo.decimals)
      );
    }
  };

  const calculateInputAmount = (outputAmount: string): string => {
    if (!swapPrice || !tokenInfo?.decimals) return "0";

    if (toToken.symbol === "USDT") {
      return calculateXeeToUsdt(
        outputAmount,
        swapPrice,
        Number(tokenInfo.decimals)
      );
    } else {
      return calculateUsdtToXee(
        outputAmount,
        swapPrice,
        Number(tokenInfo.decimals)
      );
    }
  };
  const handleAmountChange = (value: string, isFromToken: boolean) => {
    const formattedValue = formatAmount(value);
    if (isFromToken) {
      setFromToken((prev) => ({ ...prev, amount: formattedValue }));
      // Calculate output amount if both decimals are available
      if (fromToken.decimals && toToken.decimals) {
        const outputAmount = calculateOutputAmount(formattedValue);
        setToToken((prev) => ({ ...prev, amount: outputAmount }));
      }
    } else {
      setToToken((prev) => ({ ...prev, amount: formattedValue }));
      // Calculate input amount if both decimals are available
      if (fromToken.decimals && toToken.decimals) {
        const inputAmount = calculateInputAmount(formattedValue);
        setFromToken((prev) => ({ ...prev, amount: inputAmount }));
      }
    }
  };

  const canSwap = useMemo(() => {
    const isLoading =
      fromToken.isBalanceLoading ||
      toToken.isBalanceLoading ||
      swapStatus !== "idle";

    return (
      !isLoading &&
      fromToken.decimals !== null &&
      toToken.decimals !== null &&
      swapPrice !== undefined &&
      fromToken.amount !== "0" &&
      toToken.amount !== "0" &&
      stringToBigInt(fromToken.amount, Number(fromToken.decimals)) <=
        stringToBigInt(fromToken.balance, Number(fromToken.decimals))
    );
  }, [fromToken, toToken, swapPrice, swapStatus]);

  const amountIsZero = useMemo(() => {
    return fromToken.amount === "0" || toToken.amount === "0";
  }, [fromToken, toToken]);

  const handleSwap = async () => {
    if (!canSwap || !fromToken.decimals) {
      // notification.error("Cannot swap at this time");
      return;
    }
    try {
      const amount = stringToBigInt(
        fromToken.amount,
        Number(fromToken.decimals)
      );

      if (fromToken.symbol === "USDT") {
        await swapUsdtToXee(amount);
        // notification.success("Successfully swapped USDT to XEE");
      } else {
        await swapXeeToUsdt(amount);
        // notification.success("Successfully swapped XEE to USDT");
      }

      // Reset amounts
      setFromToken((prev) => ({ ...prev, amount: "0" }));
      setToToken((prev) => ({ ...prev, amount: "0" }));
      await refetchTokenBalances();
    } catch (error) {
      console.error("Swap failed:", error);
      if (error instanceof Error) {
        // Handle specific error messages
        // if (error.message.includes("Wallet not connected")) {
        //   toast.error("Please connect your wallet");
        // } else if (error.message.includes("Insufficient")) {
        //   toast.error(error.message);
        // } else {
        //   toast.error(error.message);
        // }
      } else {
        notification.error("An unexpected error occurred");
      }
    }
  };

  return (
    <div className="relative">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#4c51ff]/20 rounded-full blur-3xl" />
      <div className="glass-card p-6 space-y-4">
        <h2 className="text-2xl font-bold mb-6 gradient-text">Swap Tokens</h2>

        <TokenSelector
          token={fromToken}
          onAmountChange={(value) => handleAmountChange(value, true)}
        />

        <div className="flex justify-center -my-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSwapTokens}
            className="glass-button z-10 hover:rotate-180 transition-transform duration-300"
          >
            <ArrowDownUp className="w-4 h-4" />
          </Button>
        </div>

        <TokenSelector
          token={toToken}
          onAmountChange={(value) => handleAmountChange(value, false)}
        />

        {/* <SwapSettings slippage={slippage} onSlippageChange={setSlippage} /> */}

        <div className="glass-card p-4">
          <SwapDetails
            amount={Number(toToken.amount)}
            symbol={toToken.symbol}
            priceImpact="< 0.01%"
            swapFee={swapFee || BigInt(0)}
          />
        </div>

        <Button
          className="w-full glass-button py-6 text-lg font-semibold"
          disabled={isConnected && !canSwap}
          onClick={isConnected ? handleSwap : openConnectModal}
        >
          {(() => {
            if (!isConnected) return "Connect Wallet";
            if (swapStatus === "approving") return "Approving...";
            if (swapStatus === "swapping") return "Swapping...";
            if (fromToken.isBalanceLoading || toToken.isBalanceLoading)
              return "Loading balances...";
            // if (!canSwap) return "Insufficient balance";
            return "Swap Tokens";
          })()}
        </Button>
      </div>
    </div>
  );
}
