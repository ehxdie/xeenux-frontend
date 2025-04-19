"use client";

import { useState } from "react";
import { useGetUserProfile, useUpdateUserProfile } from "@/hooks/use-users";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";

export function ProfileForm() {
  const { data, isLoading } = useGetUserProfile();
  const { fetchUpdateUserProfile, isUpdating } = useUpdateUserProfile();
  const [formData, setFormData] = useState({
    name: data?.user?.name || "",
    phone: data?.user?.phone || "",
    walletAddress: data?.user?.walletAddress || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetchUpdateUserProfile(formData);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Profile</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Name</label>
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Phone</label>
            <Input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Wallet Address</label>
            <Input
              name="walletAddress"
              value={formData.walletAddress}
              onChange={handleChange}
              placeholder="Enter your wallet address"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isUpdating}>
            {isUpdating ? "Updating..." : "Save Changes"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
