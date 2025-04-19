"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useGetUserProfile } from "@/hooks/use-users";

export function ProfileCard() {
  const { data, isLoading } = useGetUserProfile();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const user = data?.user;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center gap-4">
        <Avatar>
          <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-lg font-semibold">{user?.name}</p>
          <p className="text-sm text-muted-foreground">{user?.email}</p>
          <p className="text-sm text-muted-foreground">Referrer: {user?.referrerId || "N/A"}</p>
          <p className="text-sm text-muted-foreground">Wallet: {user?.walletAddress || "N/A"}</p>
        </div>
      </CardContent>
    </Card>
  );
}
