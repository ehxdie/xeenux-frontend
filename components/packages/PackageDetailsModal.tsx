"use client";

import { useState, useEffect } from "react";
import { useGetPackageDetails } from "@/hooks/use-package";
import { Loader } from "@/components/ui/loader";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface PackageDetailsModalProps {
    packageId: number;
    isOpen: boolean;
    onClose: () => void;
}

export function PackageDetailsModal({ packageId, isOpen, onClose }: PackageDetailsModalProps) {
    const { packageDetails, isLoading, error, fetchPackageDetails } = useGetPackageDetails();

    // Fetch package details when the modal opens
    useEffect(() => {
        if (isOpen) {
            fetchPackageDetails(packageId);
        }
    }, [isOpen, packageId]);

    if (!isOpen) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Package Details</DialogTitle>
                </DialogHeader>
                {isLoading ? (
                    <Loader />
                ) : error ? (
                    <div className="text-red-500">Failed to load package details.</div>
                ) : (
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">{packageDetails?.name}</h3>
                        <p className="text-gray-600">{packageDetails?.description}</p>
                        <p className="text-gray-800 font-bold">
                            Price: ${packageDetails?.priceUSD.toFixed(2)}
                        </p>
                        <ul className="list-disc pl-5">
                            {packageDetails?.features.map((feature, index) => (
                                <li key={index} className="text-gray-600">
                                    {feature}
                                </li>
                            ))}
                        </ul>
                        <Button onClick={onClose} className="mt-4">
                            Close
                        </Button>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
