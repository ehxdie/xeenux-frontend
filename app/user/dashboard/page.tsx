"use client";

import { UserStatsCard } from "@/components/user/UserStatsCard";
import { BinaryTreeGraph } from "@/components/user/BinaryTreeGraph";
import { TeamOverviewTable } from "@/components/user/TeamOverviewTable";
import { ActivityFeed } from "@/components/user/ActivityFeed";

export default function DashboardPage() {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <div className="container mx-auto py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 space-y-8 w-full lg:w-[70%]">
            <UserStatsCard />
            <BinaryTreeGraph />
            <TeamOverviewTable />
            <ActivityFeed />
          </div>
        </div>
      </div>
    </div>
  );
}
