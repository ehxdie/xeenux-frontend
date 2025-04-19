"use client";

import { useState } from "react";
import { useAddUserBalance, useUpdateUserRank } from "@/hooks/use-admin";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function AdjustBalanceForm({ userId }: { userId: string }) {
    const { addUserBalanceHook, isLoading: isBalanceUpdating } = useAddUserBalance();
    const { updateUserRankHook, isLoading: isRankUpdating } = useUpdateUserRank();
    const [balance, setBalance] = useState("");
    const [rank, setRank] = useState("");

    const handleBalanceUpdate = async () => {
        await addUserBalanceHook({ userId, amount: Number(balance), type: "manual", description: "Admin adjustment" });
    };

    const handleRankUpdate = async () => {
        await updateUserRankHook({ userId, rank: Number(rank) });
    };

    return (
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium">Adjust Balance</label>
                <Input
                    value={balance}
                    onChange={(e) => setBalance(e.target.value)}
                    placeholder="Enter amount"
                />
                <Button onClick={handleBalanceUpdate} disabled={isBalanceUpdating}>
                    {isBalanceUpdating ? "Updating..." : "Update Balance"}
                </Button>
            </div>
            <div>
                <label className="block text-sm font-medium">Update Rank</label>
                <Input
                    value={rank}
                    onChange={(e) => setRank(e.target.value)}
                    placeholder="Enter rank"
                />
                <Button onClick={handleRankUpdate} disabled={isRankUpdating}>
                    {isRankUpdating ? "Updating..." : "Update Rank"}
                </Button>
            </div>
        </div>
    );
}
