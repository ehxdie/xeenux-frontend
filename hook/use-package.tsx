import { useState } from "react";
import { getAllPackages, getPackageDetails, purchasePackage } from "@/api/package";
import { notification } from "@/utils/scaffold-eth/notification";

// Interface for a single package
interface Package {
    _id: string;
    name: string;
    priceUSD: number;
    description: string;
    isActive: boolean;
    packageIndex: number;
    maxROIMultiplier: number;
    features: string[];
    createdAt: string;
    updatedAt: string;
    __v: number;
    xeenuxAmount: number;
}

// Interface for the getAllPackages response
interface GetAllPackagesResponse {
    status: string;
    data: {
        packages: Package[];
        xeenuxPrice: number;
    };
}

// Interface for the getPackageDetails response
interface GetPackageDetailsResponse {
    status: string;
    data: {
        package: Package;
    };
}

// Interface for the user package
interface UserPackage {
    _id: string;
    user: string; // ObjectId reference to the user
    userId: number;
    package: string; // ObjectId reference to the package
    packageIndex: number;
    purchaseDate: string;
    amountPaid: number;
    xeenuxAmount: number;
    ceilingLimit: number;
    earned: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

// Interface for the activity record
interface Activity {
    _id: string;
    userId: number;
    user: string; // ObjectId reference to the user
    amount: number;
    type: number; // Activity type (e.g., 0 for purchase)
    level: number;
    description: string;
    referenceId: string; // ObjectId reference to the user package
    meta: {
        packageIndex: number;
        packageName: string;
        priceUSD: number;
    };
    createdAt: string;
    updatedAt: string;
    __v: number;
}

// Interface for the purchasePackage response
interface PurchasePackageResponse {
    status: string;
    data: {
        userPackage: UserPackage;
        activity: Activity;
    };
}

// Hook for getAllPackages
export function useGetAllPackages() {
    const [packages, setPackages] = useState<Package[]>([]);
    const [xeenuxPrice, setXeenuxPrice] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchPackages = async (): Promise<void> => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await getAllPackages();
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
    const [packageDetails, setPackageDetails] = useState<Package | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchPackageDetails = async (packageId: number): Promise<void> => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await getPackageDetails(packageId);
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
    const [userPackage, setUserPackage] = useState<UserPackage | null>(null);
    const [activity, setActivity] = useState<Activity | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const purchasePackageHook = async (
        data: { packageIndex: number; position: number },
        token: string
    ): Promise<void> => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await purchasePackage(data);
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