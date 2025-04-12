export interface User {
    name: string;
    email: string;
    phone: string;
    walletAddress: string;
    role: 'user' | 'admin';
    isActive: boolean;
    userId: number;
    referrerId: number;
    position: 0 | 1;
    registeredAt: string; // or Date, depending on how it's returned from API
    refCount: number;
    rank: 0 | 1 | 2 | 3 | 4;
    lastRankSaved: number;
    roiIncome: number;
    levelIncome: number;
    autopoolIncome: number;
    rewardIncome: number;
    binaryIncome: number;
    lastROIDistributed: string; // or Date
    lastBinaryDistributed: string; // or Date
    lastRewardDistributed: string; // or Date
    totalWithdraw: number;
    purchaseWallet: number;
    createdAt: string;
    updatedAt: string;
    _id?: string;
}
