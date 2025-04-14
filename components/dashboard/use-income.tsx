import React from "react";
import { useIncomeHistory } from "@/hooks/use-user";
import { useUser } from "@/context/user";
import { bigIntToString } from "@/lib/utils";
import { useTokenInfo } from "@/hooks/use-contract";
import { UserActivityMode } from "@/types";

export const UserIncomes: React.FC<{
    _type: number;
}> = ({ _type }) => {
    const { userInfo } = useUser();
    const {
        data: userIncomes,
        isLoading,
        error,
        page,
        setPage,
    } = useIncomeHistory(userInfo?.id || BigInt(0), _type);
    const { data: tokenInfo } = useTokenInfo();
    return (
        <div className="">
            {isLoading && (
                <p className="text-gray-500">Loading userIncomes...</p>
            )}

            {/* Error State */}
            {error && (
                <p className="text-red-500">
                    Error fetching data: {error.message}
                </p>
            )}

            {/* userIncomes List */}
            {!isLoading && userIncomes?.length === 0 && (
                <p className="text-gray-500">No userIncomes found.</p>
            )}

            {!isLoading && userIncomes && userIncomes.length > 0 && (
                <table className="w-full border-none">
                    <thead className="bg-purple-500/50">
                        <tr className="">
                            <th className="border border-purple-500/50 px-4 py-2 text-left">
                                Date
                            </th>
                            {[UserActivityMode.REFERRAL].includes(_type) && (
                                <th className="border border-purple-500/50 px-4 py-2 text-left">
                                    User
                                </th>
                            )}
                            <th className="border border-purple-500/50 px-4 py-2 text-right">
                                Amount
                            </th>
                            {[
                                UserActivityMode.REFERRAL,
                                UserActivityMode.AUTOPOOL,
                            ].includes(_type) && (
                                <th className="border border-purple-500/50 px-4 py-2 text-right">
                                    Level
                                </th>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {userIncomes.map((withdrawal, index) => (
                            <tr key={index} className="hover:border-purple-500">
                                <td className="border border-purple-500/50 px-4 py-2 text-left">
                                    {new Date(
                                        Number(withdrawal.timestamp) * 1000,
                                    ).toLocaleDateString()}
                                </td>
                                {[UserActivityMode.REFERRAL].includes(
                                    _type,
                                ) && (
                                    <td className="border border-purple-500/50 px-4 py-2 text-left">
                                        USER{Number(withdrawal.id)}
                                    </td>
                                )}
                                <td className="border border-purple-500/50 px-4 py-2 text-right">
                                    {bigIntToString(
                                        withdrawal.amount,
                                        tokenInfo?.decimals,
                                        0,
                                    )}{" "}
                                    {tokenInfo?.symbol}
                                </td>
                                {[
                                    UserActivityMode.REFERRAL,
                                    UserActivityMode.AUTOPOOL,
                                ].includes(_type) && (
                                    <td className="border border-purple-500/50 px-4 py-2 text-left">
                                        {Number(withdrawal.level)}
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
                    disabled={(userIncomes?.length || 0) < 10}
                >
                    Next
                </button>
            </div>
        </div>
    );
};
