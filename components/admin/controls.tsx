"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Settings, RotateCw, ChevronDown, Check, X } from "lucide-react";
import { TokenBurning } from "./token-burning";
import { SwapControls } from "./swap-controls";
import { IncomeDistribution } from "./income-distribution";

interface AdminControlsProps {
  onAction: (action: string, value?: number | string) => Promise<void>;
  isLoading: boolean;
}

interface PlatformData {
  lastSync: string;
  totalUsers: number;
  activeContracts: number;
  pendingTransactions: number;
  systemHealth: "Healthy" | "Warning" | "Critical";
}

interface ExchangeRate {
  pair: string;
  rate: string;
  change24h: string;
  lastUpdated: string;
}

const platformData: PlatformData = {
  lastSync: "2024-02-14 15:30 UTC",
  totalUsers: 15234,
  activeContracts: 45,
  pendingTransactions: 12,
  systemHealth: "Healthy",
};

const exchangeRates: ExchangeRate[] = [
  {
    pair: "XEE/USDT",
    rate: "1.245",
    change24h: "+5.2%",
    lastUpdated: "5 min ago",
  },
  {
    pair: "XEE/BNB",
    rate: "0.00324",
    change24h: "+3.1%",
    lastUpdated: "5 min ago",
  },
  {
    pair: "XEE/ETH",
    rate: "0.00056",
    change24h: "-1.2%",
    lastUpdated: "5 min ago",
  },
  {
    pair: "XEE/BUSD",
    rate: "1.242",
    change24h: "+4.8%",
    lastUpdated: "5 min ago",
  },
];
export function AdminControls({ onAction, isLoading }: AdminControlsProps) {
  const [showPlatformData, setShowPlatformData] = useState(false);
  const [showExchangeRates, setShowExchangeRates] = useState(false);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Swap Fee Controls */}
      {/* <SwapControls /> */}

      {/* Token Burning */}
      <TokenBurning />

      {/* Weekly Bonus */}
      <IncomeDistribution />
    </div>
  );
}
