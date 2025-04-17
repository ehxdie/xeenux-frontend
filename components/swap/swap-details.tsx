"use client";

import { useAuth } from "@/context/auth-context";
import { getDashboard } from "@/api/user";
import { useEffect, useState } from "react";
import { notification } from "@/utils/scaffold-eth/notification";

interface SwapDetailsProps {
  amount: number;
  priceImpact: string;
  swapFee: number;
  symbol: string;
}

function applySwapFee(amount: number, feePercent: number): number {
  return (amount * (100 - feePercent)) / 100;
}

export function SwapDetails({
  amount,
  priceImpact,
  swapFee,
  symbol,
}: SwapDetailsProps) {
  const { token } = useAuth();
  const [tokenInfo, setTokenInfo] = useState<{ symbol: string; decimals: number } | null>(null);

  useEffect(() => {
    const fetchTokenInfo = async () => {
      if (!token) return;

      try {
        const response = await getDashboard(token);
        setTokenInfo(response.data.tokenInfo);
      } catch (err) {
        notification.error('Failed to fetch token information');
        console.error(err);
      }
    };

    fetchTokenInfo();
  }, [token]);

  return (
    <div className="space-y-2 text-sm">
      <div className="flex justify-between">
        <span className="text-gray-400">Liquidity Provider Fee</span>
        <span className="text-gray-200">{swapFee}%</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-400">Minimum Received</span>
        <span className="text-gray-200">
          {applySwapFee(amount, swapFee).toString()} {symbol}
        </span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-400">Price Impact</span>
        <span className="text-gray-200">{priceImpact}</span>
      </div>
    </div>
  );
}