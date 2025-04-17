import React from "react";
import { useWithdrawals } from "@/hooks/use-withdrawals";
import { formatDistanceToNow } from "date-fns";

const UserWithdrawals: React.FC = () => {
    const {
        data: withdrawals,
        isLoading,
        error,
        page,
        setPage,
    } = useWithdrawals();

    return (
        <div className="">
            {isLoading && (
                <p className="text-gray-500">Loading withdrawals...</p>
            )}

            {error && (
                <p className="text-red-500">
                    Error fetching data: {error.message}
                </p>
            )}

            {!isLoading && (!withdrawals || withdrawals.length === 0) && (
                <p className="text-gray-500">No withdrawals found.</p>
            )}

            {!isLoading && withdrawals && withdrawals.length > 0 && (
                <table className="w-full border-none">
                    <thead className="bg-purple-500/50">
                        <tr className="">
                            <th className="border border-purple-500/50 px-4 py-2 text-left">
                                Date
                            </th>
                            <th className="border border-purple-500/50 px-4 py-2 text-right">
                                Amount
                            </th>
                            <th className="border border-purple-500/50 px-4 py-2 text-center">
                                Status
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {withdrawals.map((withdrawal, index) => (
                            <tr key={index} className="hover:border-purple-500">
                                <td className="border border-purple-500/50 px-4 py-2 text-left">
                                    {formatDistanceToNow(
                                        new Date(withdrawal.timestamp * 1000),
                                        { addSuffix: true }
                                    )}
                                </td>
                                <td className="border border-purple-500/50 px-4 py-2 text-right">
                                    {withdrawal.amount} XNX
                                </td>
                                <td className={`border border-purple-500/50 px-4 py-2 text-center ${withdrawal.status === 'completed'
                                        ? 'text-green-500'
                                        : withdrawal.status === 'rejected'
                                            ? 'text-red-500'
                                            : 'text-yellow-500'
                                    }`}>
                                    {withdrawal.status}
                                </td>
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
                <span className="text-purple-500/80">
                    Page {page}
                </span>
                <button
                    className="px-4 py-2 bg-purple-500/50 rounded-md"
                    onClick={() => setPage(page + 1)}
                    disabled={(withdrawals?.length || 0) < 10}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default UserWithdrawals;