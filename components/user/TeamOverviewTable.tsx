"use client";

import { useGetActivities } from "@/hooks/use-users";
import { Loader } from "../ui/loader";
import { useState } from "react";

// Interfaces for activities
interface Activity {
    userId: number; // Unique identifier for the user
    user: string; // Reference to the User object (ObjectId as a string)
    amount: number; // Amount involved in the activity
    type: 0 | 1 | 2 | 3 | 4 | 5 | 6;
    // Activity type:
    // 0 - Investment/Purchase
    // 1 - Referral/Level Income
    // 2 - ROI
    // 3 - Autopool
    // 4 - Weekly Reward
    // 5 - Binary Income
    // 6 - Withdrawal
    level?: number; // Level associated with the activity (default: 0)
    description?: string; // Description of the activity
    referenceId?: string; // Reference to another entity (ObjectId as a string)
    meta?: Record<string, any>; // Additional metadata specific to the activity type
    createdAt?: Date; // Automatically added by Mongoose timestamps
    updatedAt?: Date; // Automatically added by Mongoose timestamps
}

interface ActivitiesResponse {
    status: string;
    data: {
        activities: Activity[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    };
}

export function TeamOverviewTable() {
    const [page, setPage] = useState(1);
    const limit = 10; // Number of rows per page
    const { data, isLoading, error } = useGetActivities(page, limit, 1); // Type 1 for referrals

    if (isLoading) {
        return <Loader />;
    }

    if (error) {
        return <div className="text-red-500">Failed to load team overview data.</div>;
    }

    const { activities, pagination } = data || {};

    return (
        <div className="p-6 bg-white shadow-md rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Team Overview</h2>
            <table className="w-full border-collapse border border-gray-200">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border border-gray-200 px-4 py-2 text-left">User</th>
                        <th className="border border-gray-200 px-4 py-2 text-left">Amount</th>
                        <th className="border border-gray-200 px-4 py-2 text-left">Level</th>
                        <th className="border border-gray-200 px-4 py-2 text-left">Description</th>
                        <th className="border border-gray-200 px-4 py-2 text-left">Date</th>
                    </tr>
                </thead>
                <tbody>
                    {activities?.map((activity) => (
                        <tr key={activity.referenceId || activity.userId} className="hover:bg-gray-50">
                            <td className="border border-gray-200 px-4 py-2">{activity.user || "Unknown User"}</td>
                            <td className="border border-gray-200 px-4 py-2">${activity.amount.toFixed(2)}</td>
                            <td className="border border-gray-200 px-4 py-2">{activity.level || "N/A"}</td>
                            <td className="border border-gray-200 px-4 py-2">{activity.description || "No description"}</td>
                            <td className="border border-gray-200 px-4 py-2">
                                {activity.createdAt ? new Date(activity.createdAt).toLocaleDateString() : "Unknown date"}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="flex justify-between items-center mt-4">
                <button
                    className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                    disabled={page <= 1}
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                >
                    Previous
                </button>
                <span>
                    Page {pagination?.page} of {pagination?.totalPages}
                </span>
                <button
                    className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                    disabled={page >= (pagination?.totalPages || 1)}
                    onClick={() => setPage((prev) => prev + 1)}
                >
                    Next
                </button>
            </div>
        </div>
    );
}
