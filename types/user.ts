// Interfaces for the payload structure
export interface User {
    _id: string;
    name: string;
    email: string;
    phone: string;
    walletAddress: string;
    role: string;
    isActive: boolean;
    userId: number;
    referrerId: number;
    position: number;
    registeredAt: string;
    refCount: number;
    rank: number;
    lastRankSaved: number;
    roiIncome: number;
    levelIncome: number;
    autopoolIncome: number;
    rewardIncome: number;
    binaryIncome: number;
    lastROIDistributed: string;
    lastBinaryDistributed: string;
    lastRewardDistributed: string;
    totalWithdraw: number;
    purchaseWallet: number;
    createdAt: string;
    updatedAt: string;
    __v: number;
    totalIncome: number;
    id: string;
}

export interface Volume {
    _id: string;
    userId: number;
    user: string;
    selfVolume: number;
    directVolume: number;
    leftVolume: number;
    rightVolume: number;
    totalVolume: number;
    lastUpdated: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

export interface Incomes {
    roi: number;
    level: number;
    binary: number;
    autopool: number;
    reward: number;
    total: number;
}

export interface PendingIncome {
    roi: number;
    level: number;
    binary: number;
    autopool: number;
    reward: number;
    total: number;
}

export interface ActivePackage {
    _id: string;
    user: string;
    userId: number;
    package: string;
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

export interface UserProfileData {
    user: User;
    volume: Volume;
    incomes: Incomes;
    pendingIncome: PendingIncome;
    activePackages: ActivePackage[];
}

export interface UserProfileResponse {
    status: string;
    data: UserProfileData;
}

// Interface for the updateUserProfile response
export interface UpdateUserProfileResponse {
    status: string;
    data: {
        user: User;
    };
}

// Interface for the getDashboard response
export interface DashboardResponse {
    status: string;
    data: {
        user: User;
        volume: Volume;
        binaryNetwork: {
            _id: string;
            userId: number;
            user: string;
            position: number;
            parentId: number;
            leftChildId: number;
            rightChildId: number;
            leftVolume: number;
            rightVolume: number;
            leftCarryForward: number;
            rightCarryForward: number;
            totalLeftVolume: number;
            totalRightVolume: number;
            leftCount: number;
            rightCount: number;
            lastBinaryProcess: string;
            createdAt: string;
            updatedAt: string;
            __v: number;
        };
        teamStructure: {
            _id: string;
            userId: number;
            user: string;
            directTeam: number;
            totalTeam: number;
            directBusiness: number;
            totalBusiness: number;
            team: Record<string, any[]>;
            volume: Record<string, number>;
            teamRanks: Record<string, number>;
            lastUpdated: string;
            createdAt: string;
            updatedAt: string;
            __v: number;
        };
        activePackages: ActivePackage[];
        incomes: Incomes;
        recentActivities: {
            _id: string;
            userId: number;
            user: string;
            amount: number;
            type: number;
            level: number;
            description: string;
            meta: Record<string, any>;
            createdAt: string;
            updatedAt: string;
            __v: number;
        }[];
        referralLinks: {
            left: string;
            right: string;
        };
        binaryTree: {
            userId: number;
            name: string;
            position: number;
            leftVolume: number;
            rightVolume: number;
            totalLeftVolume: number;
            totalRightVolume: number;
            isEmpty: boolean;
            left: {
                userId: number;
                name: string;
                isEmpty: boolean;
            };
            right: {
                userId: number;
                name: string;
                isEmpty: boolean;
            };
        };
    };
}

// Interface for the getBinaryTree response
export interface BinaryTreeResponse {
    status: string;
    data: {
        binaryTree: {
            userId: number;
            name: string;
            position: number;
            leftVolume: number;
            rightVolume: number;
            totalLeftVolume: number;
            totalRightVolume: number;
            isEmpty: boolean;
            left: {
                userId: number;
                name: string;
                isEmpty: boolean;
            };
            right: {
                userId: number;
                name: string;
                isEmpty: boolean;
            };
        };
    };
}

export interface TeamStructure {
    userId: number; // Unique identifier for the user
    user: string; // Reference to the User object (ObjectId as a string)
    team: Map<string, number[]>; // Map of team members by level (e.g., 'level1', 'level2')
    volume: Map<string, number>; // Map of volume by level (e.g., 'level1', 'level2')
    teamRanks: Map<string, number>; // Map of rank counts (e.g., 'rank0', 'rank1')
    directTeam: number; // Total direct team members
    totalTeam: number; // Total team members across all levels
    directBusiness: number; // Direct business volume
    totalBusiness: number; // Total business volume
    lastUpdated: Date; // Timestamp of the last update
    createdAt?: Date; // Automatically added by Mongoose timestamps
    updatedAt?: Date; // Automatically added by Mongoose timestamps
}

// Interface for the getTeamMembers response
export interface TeamMembersResponse {
    status: string;
    data: {
        members: TeamStructure[]; // Replace `any` with a specific type if available
        pagination: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    };
}

export interface Activity {
    userId: number; // Unique identifier for the user
    user: string; // Reference to the User object (ObjectId as a string)
    amount: number; // Amount involved in the activity
    type: 0 | 1 | 2 | 3 | 4 | 5 | 6;
    level?: number; // Level associated with the activity (default: 0)
    description?: string; // Description of the activity
    referenceId?: string; // Reference to another entity (ObjectId as a string)
    meta?: Record<string, any>; // Additional metadata specific to the activity type
    createdAt?: Date; // Automatically added by Mongoose timestamps
    updatedAt?: Date; // Automatically added by Mongoose timestamps
}

export interface ActivitiesResponse {
    status: string;
    data: {
        activities: Activity[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    };
}

// Interface for a single package
export interface UserPackage {
    _id: string; // Unique identifier for the package
    user: string; // Reference to the User object (ObjectId as a string)
    userId: number; // Unique identifier for the user
    package: string; // Reference to the Package object (ObjectId as a string)
    packageIndex: number; // Index of the package
    purchaseDate: string; // Date when the package was purchased
    amountPaid: number; // Amount paid for the package
    xeenuxAmount: number; // Xeenux amount associated with the package
    ceilingLimit: number; // Ceiling limit for the package
    earned: number; // Amount earned from the package
    isActive: boolean; // Whether the package is active
    createdAt: string; // Timestamp when the package was created
    updatedAt: string; // Timestamp when the package was last updated
    __v: number; // Version key
}

// Interface for the getUserPackages response
export interface UserPackagesResponse {
    status: string; // Status of the response
    data: {
        packages: UserPackage[]; // Array of user packages
    };
}


