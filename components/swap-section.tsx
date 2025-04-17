"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowDownUp } from "lucide-react";
import { TokenSelector } from "./swap/token-selector";
import { SwapDetails } from "./swap/swap-details";
import { useAuth } from "@/context/auth-context";
import { formatAmount } from "@/lib/utils";
import { useSwap } from "@/hooks/use-swap";
import { notification } from "@/utils/scaffold-eth/notification";

interface Token {
  symbol: string;
  icon: string;
  balance: string;
  amount: string;
  decimals: number;
  isBalanceLoading: boolean;
}

const usdtToken: Token = {
  symbol: "USDT",
  icon: "/images/tether.svg",
  balance: "0",
  amount: "0",
  decimals: 18,
  isBalanceLoading: true,
};

const xeeToken: Token = {
  symbol: "XEE",
  icon: "/images/xeenux.png",
  balance: "0",
  amount: "0",
  decimals: 18,
  isBalanceLoading: true,
};

export function SwapSection() {
  const { isAuthenticated } = useAuth();
  const { data, isLoading, swapStatus, executeSwap, refreshData } = useSwap();
  const [fromToken, setFromToken] = useState({ ...usdtToken });
  const [toToken, setToToken] = useState({ ...xeeToken });

  useEffect(() => {
    if (data) {
      setFromToken(prev => ({
        ...prev,
        balance: data.balances.usdt.toString(),
        isBalanceLoading: false
      }));
      setToToken(prev => ({
        ...prev,
        balance: data.balances.xee.toString(),
        decimals: data.tokenInfo.decimals,
        isBalanceLoading: false
      }));
    }
  }, [data]);

  const handleSwapTokens = () => {
    const tempToken = { ...fromToken };
    setFromToken({ ...toToken });
    setToToken(tempToken);
  };

  const calculateOutputAmount = (inputAmount: string): string => {
    if (!data?.swapInfo.price) return "0";
    const amount = Number(inputAmount);
    const fee = amount * (data.swapInfo.fee / 100);
    return fromToken.symbol === "USDT"
      ? ((amount - fee) * data.swapInfo.price).toString()
      : ((amount - fee) / data.swapInfo.price).toString();
  };

  const handleAmountChange = (value: string, isFromToken: boolean) => {
    const formattedValue = formatAmount(value);

    if (isFromToken) {
      setFromToken(prev => ({ ...prev, amount: formattedValue }));
      const outputAmount = calculateOutputAmount(formattedValue);
      setToToken(prev => ({ ...prev, amount: outputAmount }));
    } else {
      setToToken(prev => ({ ...prev, amount: formattedValue }));
      const inputAmount = calculateOutputAmount(formattedValue);
      setFromToken(prev => ({ ...prev, amount: inputAmount }));
    }
  };

  const canSwap = useMemo(() => {
    if (!data || isLoading || swapStatus === 'processing') return false;

    const amount = Number(fromToken.amount);
    const balance = Number(fromToken.balance);

    return amount > 0 && amount <= balance;
  }, [data, fromToken, isLoading, swapStatus]);

  const handleSwap = async () => {
    if (!canSwap) return;

    try {
      await executeSwap(
        Number(fromToken.amount),
        fromToken.symbol === "USDT" ? "usdt_to_xee" : "xee_to_usdt"
      );

      setFromToken(prev => ({ ...prev, amount: "0" }));
      setToToken(prev => ({ ...prev, amount: "0" }));
    } catch (error) {
      console.error("Swap failed:", error);
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

        <div className="glass-card p-4">
          <SwapDetails
            amount={Number(toToken.amount)}
            symbol={toToken.symbol}
            priceImpact="< 0.01%"
            swapFee={data?.swapInfo.fee || 0}
          />
        </div>

        <Button
          className="w-full glass-button py-6 text-lg font-semibold"
          disabled={!isAuthenticated || !canSwap || swapStatus === 'processing'}
          onClick={handleSwap}
        >
          {!isAuthenticated ? "Connect Wallet"
            : swapStatus === 'processing' ? "Processing..."
              : !canSwap ? "Insufficient balance"
                : "Swap Tokens"}
        </Button>
      </div>
    </div>
  );
}