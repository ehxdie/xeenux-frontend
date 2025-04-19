import { useState } from "react";
import { getAllPackages, getPackageDetails, purchasePackage } from "@/api/package";
import { notification } from "@/utils/scaffold-eth/notification";
import { useAuth } from "@/context/auth-context"; // Import AuthContext
import {
    Package,
    GetAllPackagesResponse,
    GetPackageDetailsResponse,
    UserPackage,
    Activity,
    PurchasePackageResponse,
} from "@/types/package";

// Hook for getAllPackages
export function useGetAllPackages() {
    const { token } = useAuth(); // Get token from AuthContext
    const [packages, setPackages] = useState<Package[]>([]);
    const [xeenuxPrice, setXeenuxPrice] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchPackages = async (): Promise<void> => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await getAllPackages(token!); // Pass token
            const result = response as GetAllPackagesResponse;

            setPackages(result.data.packages);
            setXeenuxPrice(result.data.xeenuxPrice);
            notification.success("Packages fetched successfully");
        } catch (err) {
            setError(err as Error);
            notification.error("Failed to fetch packages");
            console.error("Fetch packages error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        packages,
        xeenuxPrice,
        isLoading,
        error,
        fetchPackages,
    };
}

// Hook for getPackageDetails
export function useGetPackageDetails() {
    const { token } = useAuth(); // Get token from AuthContext
    const [packageDetails, setPackageDetails] = useState<Package | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchPackageDetails = async (packageId: number): Promise<void> => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await getPackageDetails(token!, packageId); // Pass token
            const result = response as GetPackageDetailsResponse;

            setPackageDetails(result.data.package);
            notification.success("Package details fetched successfully");
        } catch (err) {
            setError(err as Error);
            notification.error("Failed to fetch package details");
            console.error("Fetch package details error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        packageDetails,
        isLoading,
        error,
        fetchPackageDetails,
    };
}

export function usePurchasePackage() {
    const { token } = useAuth(); // Get token from AuthContext
    const [userPackage, setUserPackage] = useState<UserPackage | null>(null);
    const [activity, setActivity] = useState<Activity | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const purchasePackageHook = async (data: { packageIndex: number; position: number }): Promise<void> => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await purchasePackage(token!, data); // Pass token
            const result = response as PurchasePackageResponse;

            setUserPackage(result.data.userPackage);
            setActivity(result.data.activity);
            notification.success("Package purchased successfully");
        } catch (err) {
            setError(err as Error);
            notification.error("Failed to purchase package");
            console.error("Purchase package error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        userPackage,
        activity,
        isLoading,
        error,
        purchasePackageHook,
    };
}