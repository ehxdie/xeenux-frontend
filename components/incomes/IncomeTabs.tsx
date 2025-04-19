"use client";

import { useState } from "react";
import { useGetMyIncomes } from "@/hooks/use-income";
import { Loader } from "@/components/ui/loader";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const incomeTypes = [
    { label: "ROI", value: "roi" },
    { label: "Level", value: "level" },
    { label: "Binary", value: "binary" },
    { label: "Autopool", value: "autopool" },
    { label: "Rewards", value: "reward" },
];

export function IncomeTabs() {
    const [activeType, setActiveType] = useState<string>("roi");
    const { data, isLoading, error, refreshIncomes } = useGetMyIncomes(activeType, 1, 10);

    const handleTabChange = (type: string) => {
        setActiveType(type);
        refreshIncomes();
    };

    if (isLoading) {
        return <Loader />;
    }

    if (error) {
        return <div className="text-red-500">Failed to load incomes.</div>;
    }

    const { incomes, summary } = data || {};

    return (
        <div className="p-6 bg-white shadow-md rounded-lg">
            <h2 className="text-xl font-semibold mb-4">My Incomes</h2>
            <Tabs value={activeType} onValueChange={handleTabChange}>
                <TabsList>
                    {incomeTypes.map((type) => (
                        <TabsTrigger key={type.value} value={type.value}>
                            {type.label}
                        </TabsTrigger>
                    ))}
                </TabsList>
                {incomeTypes.map((type) => (
                    <TabsContent key={type.value} value={type.value}>
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Summary</h3>
                            <p>Total: ${summary?.total.toFixed(2)}</p>
                            <ul className="space-y-2">
                                {incomes?.map((income) => (
                                    <li
                                        key={income._id}
                                        className="p-4 bg-gray-100 rounded-lg shadow-sm"
                                    >
                                        <p className="font-medium">{income.description}</p>
                                        <p className="text-sm text-gray-500">
                                            {new Date(income.createdAt).toLocaleString()}
                                        </p>
                                        <p className="text-sm text-gray-700">
                                            Amount: ${income.amount.toFixed(2)}
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    );
}
