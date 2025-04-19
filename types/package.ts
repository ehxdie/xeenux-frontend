// Interface for a single package
export interface Package {
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
export interface GetAllPackagesResponse {
    status: string;
    data: {
        packages: Package[];
        xeenuxPrice: number;
    };
}

// Interface for the getPackageDetails response
export interface GetPackageDetailsResponse {
    status: string;
    data: {
        package: Package;
    };
}

// Interface for the user package
export interface UserPackage {
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
export interface Activity {
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
export interface PurchasePackageResponse {
    status: string;
    data: {
        userPackage: UserPackage;
        activity: Activity;
    };
}
