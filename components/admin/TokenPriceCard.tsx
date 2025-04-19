"use client";

import { useState } from "react";
import { useGetSettings, useUpdateSetting } from "@/hooks/use-admin";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function TokenPriceCard() {
    const { settings, isLoading, refreshSettings } = useGetSettings();
    const { updateSetting, isUpdating } = useUpdateSetting();
    const [tokenPrice, setTokenPrice] = useState<string>("");

    useEffect(() => {
        if (settings?.tokenPrice) {
            setTokenPrice(settings.tokenPrice.value);
        }
    }, [settings]);

    const handleUpdate = async () => {
        await updateSetting({
            key: "tokenPrice",
            value: tokenPrice,
            group: settings.tokenPrice.group,
            description: settings.tokenPrice.description,
        });
        refreshSettings();
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Token Price</CardTitle>
            </CardHeader>
            <CardContent>
                <div>
                    <label className="block text-sm font-medium">Current Token Price</label>
                    <Input
                        value={tokenPrice}
                        onChange={(e) => setTokenPrice(e.target.value)}
                        placeholder="Enter token price"
                    />
                </div>
            </CardContent>
            <CardFooter>
                <Button onClick={handleUpdate} disabled={isUpdating}>
                    {isUpdating ? "Updating..." : "Update Price"}
                </Button>
            </CardFooter>
        </Card>
    );
}
