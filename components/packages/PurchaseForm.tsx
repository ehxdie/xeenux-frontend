"use client";

import { useState } from "react";
import { usePurchasePackage } from "@/hooks/use-package";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PurchaseFormProps {
    packageIndex: number;
    onSuccess: () => void;
}

export function PurchaseForm({ packageIndex, onSuccess }: PurchaseFormProps) {
    const { purchasePackageHook, isLoading, error } = usePurchasePackage();
    const [position, setPosition] = useState<number | null>(null);

    const handlePurchase = async () => {
        if (position === null) {
            alert("Please enter a valid position.");
            return;
        }

        try {
            await purchasePackageHook({ packageIndex, position });
            alert("Package purchased successfully!");
            onSuccess();
        } catch (err) {
            console.error("Purchase failed:", err);
        }
    };

    return (
        <div className="p-6 bg-white shadow-md rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Purchase Package</h2>
            <div className="space-y-4">
                <div>
                    <Label htmlFor="position">Enter Position</Label>
                    <Input
                        id="position"
                        type="number"
                        value={position ?? ""}
                        onChange={(e) => setPosition(Number(e.target.value))}
                        placeholder="Enter position (e.g., 1 or 2)"
                        className="mt-2"
                    />
                </div>
                {error && <div className="text-red-500">Error: {error.message}</div>}
                <Button onClick={handlePurchase} disabled={isLoading} className="mt-4">
                    {isLoading ? "Processing..." : "Confirm Purchase"}
                </Button>
            </div>
        </div>
    );
}
