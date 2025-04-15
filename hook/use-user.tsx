import { Address } from "viem";
import { useAccount } from "wagmi";
import { useState } from "react";
import { WalletNotConnectedException } from "@/lib/exceptions";
import {
    useScaffoldReadContract,
    useScaffoldWriteContract,
    useTransactor,
} from "./scaffold-eth";
import { useContractsInfo } from "./use-contract";

// Hook for 'getUserInfo' function
export function useUserInfo(_address: Address) {
    const { xeenuxContractInfo } = useContractsInfo();
    return useScaffoldReadContract({
        contractName: xeenuxContractInfo.name,
        functionName: "getUserInfo",
        args: [_address],
    });
}

export function useUserDirectRefNo(_id: bigint) {
    const { xeenuxContractInfo } = useContractsInfo();
    return useScaffoldReadContract({
        contractName: xeenuxContractInfo.name,
        functionName: "usersDirectRefNo",
        args: [_id],
    });
}

export function useUserPackages(_id: bigint) {
    const { xeenuxContractInfo } = useContractsInfo();
    return useScaffoldReadContract({
        contractName: xeenuxContractInfo.name,
        functionName: "getUserPackages",
        args: [_id],
    });
}

export function useUserTeamStats(_id: bigint) {
    const { xeenuxContractInfo } = useContractsInfo();
    return useScaffoldReadContract({
        contractName: xeenuxContractInfo.name,
        functionName: "getUserTeamStats",
        args: [_id],
    });
}

export function useUserClaims(_id: bigint) {
    const { xeenuxContractInfo } = useContractsInfo();
    return useScaffoldReadContract({
        contractName: xeenuxContractInfo.name,
        functionName: "getUserClaims",
        args: [_id],
    });
}

export function useUserVolumes(_id: bigint) {
    const { xeenuxContractInfo } = useContractsInfo();
    return useScaffoldReadContract({
        contractName: xeenuxContractInfo.name,
        functionName: "getUserVolumes",
        args: [_id],
    });
}

export const useWithdraw = () => {
    const { address, isConnected } = useAccount();
    const [status, setStatus] = useState<"idle" | "withdrawing">("idle");
    const [error, setError] = useState<Error | null>(null);
    const { xeenuxContractInfo } = useContractsInfo();
    const { writeContractAsync: writeXeenuxContractAsync } =
        useScaffoldWriteContract({
            contractName: xeenuxContractInfo.name,
        });

    const withdraw = async (amount: bigint) => {
        try {
            if (!isConnected) {
                throw new WalletNotConnectedException();
            }

            setStatus("withdrawing");

            // Call the withdraw function on the contract
            const txHash = await writeXeenuxContractAsync({
                functionName: "withdraw",
                args: [amount],
            });

            // await waitForTransactionReceipt(config, { hash: txHash });
            setStatus("idle");
            return txHash as Address;
        } catch (err) {
            setStatus("idle");
            setError(
                err instanceof Error ? err : new Error("Withdrawal failed"),
            );
            throw err;
        }
    };

    return {
        withdraw,
        status,
        error,
    };
};

export function useGetUserBinaryTree(_userId: bigint) {
    const { xeenuxContractInfo } = useContractsInfo();
    return useScaffoldReadContract({
        contractName: xeenuxContractInfo.name,
        functionName: "getUserBinaryTree",
        args: [_userId],
    });
}

export function useIncomeHistory(_userId: bigint, _type: number) {
    const [page, setPage] = useState(BigInt(1));
    const { xeenuxContractInfo } = useContractsInfo();
    const query = useScaffoldReadContract({
        contractName: xeenuxContractInfo.name,
        functionName: "getFilteredActivities",
        args: [_userId, _type, page],
    });
    return { ...query, page, setPage };
}

export function useGetAllUserLevels(_userId: bigint) {
    const { xeenuxContractInfo } = useContractsInfo();
    return useScaffoldReadContract({
        contractName: xeenuxContractInfo.name,
        functionName: "getAllLevelDetails",
        args: [_userId],
    });
}

export function useGetUserLevelDetails(_userId: bigint) {
    const [level, setLevel] = useState(BigInt(0));
    const { xeenuxContractInfo } = useContractsInfo();
    return {
        ...useScaffoldReadContract({
            contractName: xeenuxContractInfo.name,
            functionName: "getLevelDetails",
            args: [_userId, level],
        }),
        setLevel,
    };
}

export function usePendingROI(_userId: bigint) {
    const { xeenuxContractInfo } = useContractsInfo();
    return useScaffoldReadContract({
        contractName: xeenuxContractInfo.name,
        functionName: "getPendingRoi",
        args: [_userId],
    });
}
export function usePendingBinary(_userId: bigint) {
    const { xeenuxContractInfo } = useContractsInfo();
    return useScaffoldReadContract({
        contractName: xeenuxContractInfo.name,
        functionName: "getPendingBinaryIncome",
        args: [_userId],
    });
}

export function useClaimIncome(_userId: bigint) {
    const { xeenuxContractInfo } = useContractsInfo();
    const { writeContractAsync: writeXeenuxContractAsync } =
        useScaffoldWriteContract({
            contractName: xeenuxContractInfo.name,
        });
    const claimRoi = async () => {
        await writeXeenuxContractAsync({
            functionName: "claimRoi",
            // args: [_userId],
        });
    };
    const claimBinary = async () => {
        await writeXeenuxContractAsync({
            functionName: "claimBinaryIncome",
            // args: [_userId],
        });
    };
    return { claimRoi, claimBinary };
}
