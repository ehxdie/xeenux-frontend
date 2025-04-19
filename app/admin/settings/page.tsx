"use client";

import { SettingsForm } from "@/components/admin/SettingsForm";
import { TokenPriceCard } from "@/components/admin/TokenPriceCard";

export default function AdminSettingsPage() {
    return (
        <div className="space-y-8">
            <h1 className="text-4xl font-bold">Admin Settings</h1>
            <TokenPriceCard />
            <SettingsForm />
        </div>
    );
}
