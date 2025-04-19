"use client";

import { useState } from "react";
import { notification } from "@/utils/scaffold-eth/notification";
import { AdminStatsGrid } from "@/components/admin/AdminStatsGrid";
import { RecentTransactions } from "@/components/admin/RecentTransactions";

export default function AdminDashboard() {
  const [isLoading, setIsLoading] = useState(false);

  const handleAction = async (action: string, value?: number | string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      notification.success(`${action} completed successfully`);
    } catch (error) {
      notification.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#12021c] to-[#1a0329]">
      <div className="container mx-auto px-4 py-8 space-y-8">
        <h1 className="text-4xl font-bold gradient-text">Admin Dashboard</h1>
        <AdminStatsGrid />
        <RecentTransactions />     
      </div>
    </div>
  );
}
