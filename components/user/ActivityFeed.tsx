"use client";

import { useGetActivities } from "@/hooks/use-users";
import { Loader } from "@/components/ui/loader";

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

export function ActivityFeed() {
    const { data, isLoading, error } = useGetActivities(1, 10); // Fetch first page with 10 activities

    if (isLoading) {
        return <Loader />;
    }

    if (error) {
        return <div className="text-red-500">Failed to load activities.</div>;
    }

    const { activities } = data || {};
    return (
        <div className="p-6 bg-white shadow-md rounded-lg max-h-96 overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">Recent Activities</h2>
            <ul className="space-y-4">
                {activities?.map((activity) => (
                    <li key={activity.referenceId || activity.userId} className="flex flex-col">
                        <span className="font-medium">{activity.description || "No description available"}</span>
                        <span className="text-sm text-gray-500">
                            {activity.createdAt ? new Date(activity.createdAt).toLocaleString() : "Unknown date"}
                        </span>
                        <span className="text-sm text-gray-700">
                            Amount: ${activity.amount.toFixed(2)}
                        </span>
                        <span className="text-sm text-gray-500">
                            Type: {getActivityType(activity.type)}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

// Helper function to map activity types to readable strings
function getActivityType(type: number): string {
    switch (type) {
        case 0:
            return "Investment/Purchase";
        case 1:
            return "Referral/Level Income";
        case 2:
            return "ROI";
        case 3:
            return "Autopool";
        case 4:
            return "Weekly Reward";
        case 5:
            return "Binary Income";
        case 6:
            return "Withdrawal";
        default:
            return "Unknown";
    }
}
