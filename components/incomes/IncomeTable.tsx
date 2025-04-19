"use client";

import { useState } from "react";
import { useGetMyIncomes } from "@/hooks/use-income";
import { Loader } from "@/components/ui/loader";
import { Button } from "@/components/ui/button";

interface IncomeTableProps {
    type: string;
}

export function IncomeTable({ type }: IncomeTableProps) {
    const [page, setPage] = useState(1);
    const limit = 10; // Number of rows per page
    const { data, isLoading, error, refreshIncomes } = useGetMyIncomes(type, page, limit);

    const handleNextPage = () => {
        setPage((prev) => prev + 1);
        refreshIncomes();
    };

    const handlePreviousPage = () => {
        setPage((prev) => Math.max(prev - 1, 1));
        refreshIncomes();
    };

    if (isLoading) {
        return <Loader />;
    }

    if (error) {
        return <div className="text-red-500">Failed to load incomes.</div>;
    }

    const { incomes, pagination } = data || {};

    return (
        <div className="p-6 bg-white shadow-md rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Income Entries</h2>
            <table className="w-full border-collapse border border-gray-200">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border border-gray-200 px-4 py-2 text-left">Description</th>
                        <th className="border border-gray-200 px-4 py-2 text-left">Amount</th>
                        <th className="border border-gray-200 px-4 py-2 text-left">Date</th>
                    </tr>
                </thead>
                <tbody>
                    {incomes?.map((income) => (
                        <tr key={income._id} className="hover:bg-gray-50">
                            <td className="border border-gray-200 px-4 py-2">{income.description}</td>
                            <td className="border border-gray-200 px-4 py-2">${income.amount.toFixed(2)}</td>
                            <td className="border border-gray-200 px-4 py-2">
                                {new Date(income.createdAt).toLocaleDateString()}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="flex justify-between items-center mt-4">
                <Button
                    onClick={handlePreviousPage}
                    disabled={page <= 1}
                    className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                >
                    Previous
                </Button>
                <span>
                    Page {pagination?.page} of {pagination?.totalPages}
                </span>
                <Button
                    onClick={handleNextPage}
                    disabled={page >= (pagination?.totalPages || 1)}
                    className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                >
                    Next
                </Button>
            </div>
        </div>
    );
}
