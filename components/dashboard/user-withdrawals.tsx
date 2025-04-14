import React, { useEffect } from "react";
import { useIncomeHistory } from "@/hooks/use-user";
import { useUser } from "@/context/user";
import { bigIntToString } from "@/lib/utils";
import { useTokenInfo } from "@/hooks/use-contract";
import { UserActivityMode } from "@/types";

const UserWithdrawals: React.FC = () => {
    const { userInfo } = useUser();
    const {
        data: withdrawals,
        isLoading,
        error,
        page,
        setPage,
    } = useIncomeHistory(
        userInfo?.id || BigInt(0),
        UserActivityMode.WITHDRAWAL,
    );
    const { data: tokenInfo } = useTokenInfo();
    useEffect(() => {
        console.log({ withdrawals });
    }, [withdrawals]);
    return (
        <div className="">
            {isLoading && (
                <p className="text-gray-500">Loading withdrawals...</p>
            )}

            {/* Error State */}
            {error && (
                <p className="text-red-500">
                    Error fetching data: {error.message}
                </p>
            )}

            {/* Withdrawals List */}
            {!isLoading && withdrawals?.length === 0 && (
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
                        </tr>
                    </thead>
                    <tbody>
                        {withdrawals.map((withdrawal, index) => (
                            <tr key={index} className="hover:border-purple-500">
                                <td className="border border-purple-500/50 px-4 py-2 text-left">
                                    {new Date(
                                        Number(withdrawal.timestamp) * 1000,
                                    ).toLocaleDateString()}
                                </td>
                                <td className="border border-purple-500/50 px-4 py-2 text-right">
                                    {bigIntToString(
                                        withdrawal.amount,
                                        tokenInfo?.decimals,
                                        0,
                                    )}{" "}
                                    {tokenInfo?.symbol}
                                </td>
                                {/* <td className="border border-purple-500/50 px-4 py-2 text-right">
                  {withdrawal.mode.toString()}
                </td> */}
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {/* Pagination Controls */}
            <div className="flex justify-between items-center mt-4">
                <button
                    className="px-4 py-2 bg-purple-500/50 rounded-md disabled:opacity-50"
                    onClick={() => setPage(page - BigInt(1))}
                    disabled={page === BigInt(1)}
                >
                    Previous
                </button>
                <span className="text-purple-500/80">
                    Page {page.toString()}
                </span>
                <button
                    className="px-4 py-2 bg-purple-500/50 rounded-md"
                    onClick={() => setPage(page + BigInt(1))}
                    disabled={(withdrawals?.length || 0) < 10}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default UserWithdrawals;
