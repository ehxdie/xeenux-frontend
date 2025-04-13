"use client";

import { AdminOverview } from "@/components/admin/overview";
import { AdminControls } from "@/components/admin/controls";
import { useState } from "react";
import { notification } from "@/utils/scaffold-eth";

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
    // <div className="min-h-screen bg-gradient-to-b from-[#12021c] to-[#1a0329]">
    //   <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 gradient-text">
          Admin Dashboard
        </h1>
        
        <AdminOverview />
        <AdminControls onAction={handleAction} isLoading={isLoading} />
      </div>
    // </div>
  );
}
