"use client";

import { useState } from "react";
import { UserSearchBar } from "@/components/admin/UserSearchBar";
import { UserListTable } from "@/components/admin/UserListTable";
import { UserDetailsModal } from "@/components/admin/UserDetailsModal";
import { AdjustBalanceForm } from "@/components/admin/AdjustBalanceForm";

export default function AdminUsersPage() {
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

    return (
        <div className="space-y-8">
            <h1 className="text-4xl font-bold">Manage Users</h1>
            <UserSearchBar onSearch={(query) => console.log("Search query:", query)} />
            <UserListTable onSelectUser={(userId) => setSelectedUserId(userId)} />
            {selectedUserId && (
                <>
                    <UserDetailsModal userId={selectedUserId} onClose={() => setSelectedUserId(null)} />
                    <AdjustBalanceForm userId={selectedUserId} />
                </>
            )}
        </div>
    );
}
