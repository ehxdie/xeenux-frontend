"use client";

import { useState } from "react";
import { IncomeTable } from "@/components/incomes/IncomeTable";

export default function IncomesPage() {
    const [activeType, setActiveType] = useState<string>("roi");

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">My Incomes</h1>
            <div className="mb-4">
                <select
                    value={activeType}
                    onChange={(e) => setActiveType(e.target.value)}
                    className="p-2 border border-gray-300 rounded"
                >
                    <option value="roi">ROI</option>
                    <option value="level">Level</option>
                    <option value="binary">Binary</option>
                    <option value="autopool">Autopool</option>
                    <option value="reward">Rewards</option>
                </select>
            </div>
            <IncomeTable type={activeType} />
        </div>
    );
}
