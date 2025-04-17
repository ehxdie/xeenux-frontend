import React from "react";
import { useIncome, IncomeType } from "@/hooks/use-income";
import { formatDistance } from "date-fns";

const incomeTypeMap: Record<number, IncomeType> = {
    0: IncomeType.ROI,
    1: IncomeType.BINARY,
    2: IncomeType.REFERRAL,
    3: IncomeType.AUTOPOOL,
    4: IncomeType.LEVEL
};

export const UserIncomes: React.FC<{
    _type: number;
}> = ({ _type }) => {
    const {
        data: userIncomes,
        isLoading,
        error,
        page,
        setPage,
    } = useIncome(incomeTypeMap[_type]);

    return (
        <div className="">
            {isLoading && (
                <p className="text-gray-500">Loading income history...</p>
            )}

            {error && (
                <p className="text-red-500">
                    Error fetching data: {error.message}
                </p>
            )}

            {!isLoading && (!userIncomes || userIncomes.length === 0) && (
                <p className="text-gray-500">No income history found.</p>
            )}

            {!isLoading && userIncomes && userIncomes.length > 0 && (
                <table className="w-full border-none">
                    <thead className="bg-purple-500/50">
                        <tr>
                            <th className="border border-purple-500/50 px-4 py-2 text-left">
                                Date
                            </th>
                            {[IncomeType.REFERRAL].includes(incomeTypeMap[_type]) && (
                                <th className="border border-purple-500/50 px-4 py-2 text-left">
                                    User
                                </th>
                            )}
                            <th className="border border-purple-500/50 px-4 py-2 text-right">
                                Amount
                            </th>
                            {[IncomeType.REFERRAL, IncomeType.AUTOPOOL].includes(incomeTypeMap[_type]) && (
                                <th className="border border-purple-500/50 px-4 py-2 text-right">
                                    Level
                                </th>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {userIncomes.map((income, index) => (
                            <tr key={index} className="hover:border-purple-500">
                                <td className="border border-purple-500/50 px-4 py-2 text-left">
                                    {new Date(income.timestamp * 1000).toLocaleDateString()}
                                </td>
                                {[IncomeType.REFERRAL].includes(incomeTypeMap[_type]) && (
                                    <td className="border border-purple-500/50 px-4 py-2 text-left">
                                        USER{income.id}
                                    </td>
                                )}
                                <td className="border border-purple-500/50 px-4 py-2 text-right">
                                    {income.amount} XNX
                                </td>
                                {[IncomeType.REFERRAL, IncomeType.AUTOPOOL].includes(incomeTypeMap[_type]) && (
                                    <td className="border border-purple-500/50 px-4 py-2 text-right">
                                        {income.level || '-'}
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {/* Pagination Controls */}
            <div className="flex justify-between items-center mt-4">
                <button
                    className="px-4 py-2 bg-purple-500/50 rounded-md disabled:opacity-50"
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                >
                    Previous
                </button>
                <span className="text-purple-500/80">Page {page}</span>
                <button
                    className="px-4 py-2 bg-purple-500/50 rounded-md"
                    onClick={() => setPage(page + 1)}
                    disabled={(userIncomes?.length || 0) < 10}
                >
                    Next
                </button>
            </div>
        </div>
    );
};