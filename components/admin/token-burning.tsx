import { Flame } from "lucide-react";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  useLastBurnDate,
  useTokenInfo,
  useTokensToBeBurnt,
} from "@/hooks/use-contract";
import { useEffect, useMemo, useState } from "react";
import { bigIntToString, stringToBigInt } from "@/lib/utils";
import { useSwapFee } from "@/hooks/use-swap";
import { CountdownTimer } from "../ui/countdown-timer";
import { useBurnTokens } from "@/hooks/use-admin";
import { formatDistanceToNow } from "date-fns";

export function TokenBurning() {
  const [isLoading, setIsLoading] = useState(false);
  const { data: lastBurnTimestamp } = useLastBurnDate();
  const { data: tokensToBeBurnt } = useTokensToBeBurnt();
  const [burnAmount, setBurnAmount] = useState<string>("");
  const { data: tokenInfo } = useTokenInfo();
  const { burnTokens: burnXeenux } = useBurnTokens();
  const nextBurnDate = useMemo(() => {
    if (!lastBurnTimestamp) return new Date(0);
    return new Date(
      (Number(lastBurnTimestamp) || 0) * 1000 + 1000 * 60 * 60 * 24 * 30,
    );
  }, [lastBurnTimestamp]);
  const burnTokens = async () => {
    setIsLoading(true);
    try {
      await burnXeenux(stringToBigInt(burnAmount, tokenInfo?.decimals));
      setBurnAmount("");
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Card className="glass-card p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-orange-500/20">
          <Flame className="w-5 h-5 text-orange-400" />
        </div>
        <h2 className="text-xl font-semibold text-white mb-2">Token Burning</h2>
      </div>
      {/* <CountdownTimer targetDate={new Date("2025-02-04")} /> */}
      {lastBurnTimestamp && (
        // <CountdownTimer
        //   targetDate={
        //     new Date(
        //       (Number(lastBurnTimestamp) || 0) * 1000 +
        //         1000 * 60 * 60 * 24 * 30,
        //     )
        //   }
        // />
        <span className="text-sm text-gray-400">
          {nextBurnDate > new Date()
            ? `Next Scheduled Burn in: `
            : `Scheduled Burn elapsed: `}
          <span className="text-gray-200">
            {formatDistanceToNow(nextBurnDate)}{" "}
            {nextBurnDate > new Date() ? "time" : "ago"}
          </span>
        </span>
      )}
      <p className="text-gray-400 text-sm">
        {bigIntToString(tokensToBeBurnt || BigInt(0), tokenInfo?.decimals, 0)}{" "}
        {tokenInfo?.symbol} tokens are available for burn:{" "}
        <a
          href="#0"
          onClick={() =>
            setBurnAmount(
              bigIntToString(
                tokensToBeBurnt || BigInt(0),
                tokenInfo?.decimals,
                0,
              ),
            )
          }
          className="text-primary text-xs underline lowercase"
        >
          Burn All
        </a>
      </p>
      <div className="space-y-4">
        <div className="flex gap-3">
          <Input
            type="number"
            placeholder="Amount of tokens to burn"
            value={burnAmount}
            onChange={(e) => setBurnAmount(e.target.value)}
            className="glass-input"
            disabled={isLoading || tokensToBeBurnt == BigInt(0)}
          />
          <Button
            onClick={burnTokens}
            disabled={isLoading || !burnAmount || tokensToBeBurnt == BigInt(0)}
            className="bg-orange-600 hover:bg-orange-700"
          >
            Burn
          </Button>
        </div>

        <p className="text-sm text-gray-400">
          Warning: Token burning is irreversible. Please double-check the
          amount.
        </p>
      </div>
    </Card>
  );
}
