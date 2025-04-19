export interface Transaction {
    _id: string;
    userId: number;
    user: string;
    type: string;
    amount: number;
    amountUSD: number;
    fee: number;
    status: string;
    description: string;
    walletAddress: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

export interface Pagination {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface GetMyTransactionsResponse {
    status: string;
    data: {
        transactions: Transaction[];
        pagination: Pagination;
    };
}

export interface GetTransactionByIdResponse {
    status: string;
    data: Transaction;
}

export interface DepositTransaction extends Transaction {
    meta: {
        paymentMethod: string;
        xeenuxPrice: number;
    };
}

export interface PaymentInfo {
    gatewayUrl: string;
    transactionId: string;
    amount: number;
    currency: string;
}

export interface DepositTokensResponse {
    status: string;
    data: {
        transaction: DepositTransaction;
        paymentInfo: PaymentInfo;
    };
}

export interface WithdrawalTransaction extends Transaction {
    meta: {
        finalAmount: number;
        feePercentage: number;
        xeenuxPrice: number;
    };
}

export interface RequestWithdrawalResponse {
    status: string;
    data: {
        transaction: WithdrawalTransaction;
        fee: number;
        finalAmount: number;
        status: string;
    };
}

export interface TransactionStats {
    totalDeposits: number;
    totalWithdrawals: number;
    totalPurchases: number;
    pendingDeposits: number;
    pendingWithdrawals: number;
    balance: number;
}

export interface GetTransactionStatsResponse {
    status: string;
    data: {
        stats: TransactionStats;
        recentTransactions: Transaction[];
    };
}

export interface SwapTransaction extends Transaction {
    meta: {
        direction: string;
        xeenuxAmount: number;
        usdtAmount: number;
        xeenuxPrice: number;
        swapFee: number;
        burnRate: number;
        burnAmount: number;
    };
}

export interface SwapDetails {
    direction: string;
    inputAmount: number;
    outputAmount: number;
    fee: number;
    burnAmount: number;
    xeenuxPrice: number;
}

export interface SwapTokensResponse {
    status: string;
    data: {
        transaction: SwapTransaction;
        swapDetails: SwapDetails;
    };
}

export interface ConfirmDepositResponse {
    status: string;
    data: {
        transaction: Transaction;
    };
}
