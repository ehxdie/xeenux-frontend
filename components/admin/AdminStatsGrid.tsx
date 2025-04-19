"use client";

import { useGetDashboardStats } from "@/hooks/use-admin";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function AdminStatsGrid() {
  const { data, isLoading } = useGetDashboardStats();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Total Users</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{data?.users.total || 0}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Active Packages</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{data?.packages.length || 0}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Turnover</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">${data?.transactions.deposits || 0}</p>
        </CardContent>
      </Card>
    </div>
  );
}
