import { Flame, Percent } from "lucide-react";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  useLastBurnDate,
  useTokenInfo,
  useTokensToBeBurnt,
} from "@/hooks/use-contract";
import { useState } from "react";
import { bigIntToString } from "@/lib/utils";
import { useSwapFee } from "@/hooks/use-swap";

export function SwapControls() {
  const [isLoading, setIsLoading] = useState(false);
  const [newFee, setNewFee] = useState("");
  const { data: swapFee } = useSwapFee();
  const setNewSwapFee = () => {};

  return (
    <Card className="glass-card p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-purple-500/20">
          <Percent className="w-5 h-5 text-purple-400" />
        </div>
        <h2 className="text-xl font-semibold text-white">Swap Fee Controls</h2>
      </div>

      <div className="space-y-6">
        <div>
          <label className="text-sm text-gray-400 mb-2 block">
            Current Fee: {swapFee?.toString()}%
          </label>
          {/* <Slider
            value={[swapFee]}
            onValueChange={([value]) => setSwapFee(value)}
            max={5}
            step={0.1}
            className="mb-6"
          /> */}
        </div>

        {/* <div className="flex gap-3">
          {[0.5, 1, 2, 3].map((fee) => (
            <Button
              key={fee}
              variant="outline"
              className="flex-1 glass-input hover:bg-purple-500/20"
              onClick={() => {
                setSwapFee(fee);
                onAction("setSwapFee", fee);
              }}
              disabled={isLoading}
            >
              {fee}%
            </Button>
          ))}
        </div> */}

        <div className="flex gap-3">
          <Input
            type="number"
            placeholder="Set Swap fee %"
            value={newFee}
            onChange={(e) => setNewFee(e.target.value)}
            className="glass-input"
          />
          <Button
            onClick={setNewSwapFee}
            disabled={isLoading || !newFee}
            className="bg-purple-600 hover:bg-purple-700"
          >
            Set Fee
          </Button>
        </div>
      </div>
    </Card>
  );
}
