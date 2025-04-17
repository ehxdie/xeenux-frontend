import { Percent } from "lucide-react";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useState } from "react";
import { useSwapControls } from "@/hooks/use-swap-controls";

export function SwapControls() {
  const { data, isLoading, updateSwapFee } = useSwapControls();
  const [newFee, setNewFee] = useState("");

  const handleSetNewSwapFee = async () => {
    try {
      await updateSwapFee(Number(newFee));
      setNewFee("");
    } catch (error) {
      console.error("Failed to update swap fee:", error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Card className="glass-card p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-purple-500/20">
          <Percent className="w-5 h-5 text-purple-400" />
        </div>
        <h2 className="text-xl font-semibold text-white">
          Swap Fee Controls
        </h2>
      </div>

      <div className="space-y-6">
        <div>
          <label className="text-sm text-gray-400 mb-2 block">
            Current Fee: {data?.swapFee}%
          </label>
        </div>

        <div className="flex gap-3">
          <Input
            type="number"
            placeholder="Set Swap fee %"
            value={newFee}
            onChange={(e) => setNewFee(e.target.value)}
            className="glass-input"
          />
          <Button
            onClick={handleSetNewSwapFee}
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