import React from "react";
import { ProfileCard } from "@/components/profile/ProfileCard";
import { ProfileForm } from "@/components/profile/ProfileForm";

export default function ProfilePage() {
  return (
    <div className="space-y-8">
      <ProfileCard />
      <ProfileForm />
    </div>
  );
}
