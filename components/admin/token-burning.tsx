import { Flame } from "lucide-react";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { useTokenBurning } from "@/hooks/use-token-burning";

export function TokenBurning() {
  const [isLoading, setIsLoading] = useState(false);
  const { data, burnTokens } = useTokenBurning();
  const [burnAmount, setBurnAmount] = useState<string>("");

  const handleBurnTokens = async () => {
    setIsLoading(true);
    try {
      await burnTokens(Number(burnAmount));
      setBurnAmount("");
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!data) return null;

  const nextBurnDate = new Date(
    (Number(data.lastBurnDate) + 30 * 24 * 60 * 60) * 1000
  );

  return (
    <Card className="glass-card p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-orange-500/20">
          <Flame className="w-5 h-5 text-orange-400" />
        </div>
        <h2 className="text-xl font-semibold text-white mb-2">
          Token Burning
        </h2>
      </div>

      <span className="text-sm text-gray-400">
        {nextBurnDate > new Date()
          ? `Next Scheduled Burn in: `
          : `Scheduled Burn elapsed: `}
        <span className="text-gray-200">
          {formatDistanceToNow(nextBurnDate)}{" "}
          {nextBurnDate > new Date() ? "time" : "ago"}
        </span>
      </span>

      <p className="text-gray-400 text-sm">
        {data.tokensToBeBurnt} {data.tokenInfo.symbol} tokens are
        available for burn:{" "}
        <a
          href="#0"
          onClick={() => setBurnAmount(data.tokensToBeBurnt.toString())}
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
            disabled={isLoading || data.tokensToBeBurnt === 0}
          />
          <Button
            onClick={handleBurnTokens}
            disabled={
              isLoading ||
              !burnAmount ||
              data.tokensToBeBurnt === 0
            }
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