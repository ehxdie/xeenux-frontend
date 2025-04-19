"use client";

import { useState } from "react";
import { PackageCard } from "@/components/packages/PackageCard";
import { PackageDetailsModal } from "@/components/packages/PackageDetailsModal";
import { PurchaseForm } from "@/components/packages/PurchaseForm";

export default function PackagesPage() {
    const [selectedPackageId, setSelectedPackageId] = useState<string | null>(null);
    const [selectedPackageIndex, setSelectedPackageIndex] = useState<number | null>(null);

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Available Packages</h1>
            <PackageCard
                onMoreInfo={(packageId, packageIndex) => {
                    setSelectedPackageId(packageId);
                    setSelectedPackageIndex(packageIndex);
                }}
            />
            {selectedPackageId !== null && (
                <PackageDetailsModal
                    packageId={Number(selectedPackageId)}
                    isOpen={selectedPackageId !== null}
                    onClose={() => setSelectedPackageId(null)}
                />
            )}
            {selectedPackageIndex !== null && (
                <PurchaseForm
                    packageIndex={selectedPackageIndex}
                    onSuccess={() => setSelectedPackageIndex(null)}
                />
            )}
        </div>
    );
}
