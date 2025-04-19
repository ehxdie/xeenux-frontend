"use client";

import { useGetAllPackages } from "@/hooks/use-package";
import { Loader } from "@/components/ui/loader";
import { Button } from "@/components/ui/button";

interface PackageCardProps {
    onMoreInfo: (packageId: string, packageIndex: number) => void;
}

export function PackageCard({ onMoreInfo }: PackageCardProps) {
    const { packages, isLoading, error } = useGetAllPackages();

    if (isLoading) {
        return <Loader />;
    }

    if (error) {
        return <div className="text-red-500">Failed to load packages.</div>;
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {packages?.map((pkg) => (
                <div
                    key={pkg._id}
                    className="p-4 bg-white shadow-md rounded-lg flex flex-col items-center"
                >
                    <h3 className="text-lg font-semibold text-gray-800">{pkg.name}</h3>
                    <p className="text-gray-600 mt-2">${pkg.priceUSD.toFixed(2)}</p>
                    <div className="flex gap-2 mt-4">
                        <Button
                            onClick={() => onMoreInfo(pkg._id, pkg.packageIndex)}
                        >
                            More Info
                        </Button>
                        <Button
                            onClick={() => alert(`Purchasing package: ${pkg.name}`)}
                        >
                            Purchase
                        </Button>
                    </div>
                </div>
            ))}
        </div>
    );
}
