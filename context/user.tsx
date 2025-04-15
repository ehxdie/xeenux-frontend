import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";
import { Address } from "viem";
import {
    UserClaims,
    UserInfo,
    UserPackageInfo,
    UserTeamStats,
    UserVolumes,
} from "@/types";
import { useQueryClient } from "@tanstack/react-query";
import {
    useUserClaims,
    useUserDirectRefNo,
    useUserInfo,
    useUserPackages,
    useUserTeamStats,
    useUserVolumes,
    usePendingROI,
    usePendingBinary,
} from "@/hooks/use-user";

interface UserContextType {
    userInfo: UserInfo | undefined;
    userDirectRefNo: bigint | undefined;
    userTotalEarnings: bigint;
    userAvailableWithdraw: bigint;
    userPackages: readonly UserPackageInfo[] | undefined;
    userTeamStats: UserTeamStats | undefined;
    userVolumes: UserVolumes | undefined;
    userClaims: UserClaims | undefined;
    isLoadingUserInfo: boolean;
    isPendingUserInfo: boolean;
    userInfoError: Error | null;
    refreshUserData: (keys?: UserDataKeys[]) => void;
    pendingROI: bigint | undefined;
    pendingBinary: bigint | undefined;
}
export enum UserDataKeys {
    USER_INFO = "USER_INFO",
    USER_DIRECT_REF_NO = "USER_DIRECT_REF_NO",
    USER_PACKAGES = "USER_PACKAGES",
    USER_TEAM_STATS = "USER_TEAM_STATS",
    USER_VOLUMES = "USER_VOLUMES",
    USER_CLAIMS = "USER_CLAIMS",
}
const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
    const queryClient = useQueryClient();

    const router = useRouter();
    const { address, isConnected } = useAccount();
    const {
        data: userInfo,
        isLoading: isLoadingUserInfo,
        error: userInfoError,
        queryKey: userInfoQueryKey,
        isPending: isPendingUserInfo,
    } = useUserInfo(address as Address);

    const {
        data: userDirectRefNo,
        isLoading: isLoadingDirectRefNo,
        isError: isErrorDirectRefNo,
        queryKey: userDirectRefNoQueryKey,
    } = useUserDirectRefNo(userInfo?.id || BigInt(0));
    const {
        data: userPackages,
        isLoading: isLoadingPackages,
        isError: isErrorPackages,
        queryKey: userPackagesQueryKey,
    } = useUserPackages(userInfo?.id || BigInt(0));
    const {
        data: userTeamStats,
        isLoading: isLoadingUserTeamStats,
        isError: isErrorUserTeamStats,
        queryKey: userTeamStatsQueryKey,
    } = useUserTeamStats(userInfo?.id || BigInt(0));

    const {
        data: userVolumes,
        isLoading: isLoadingUserVolumes,
        isError: isErrorUserVolumes,
        queryKey: userVolumesQueryKey,
    } = useUserVolumes(userInfo?.id || BigInt(0));
    const {
        data: pendingROI,
        isLoading: isLoadingPendingROI,
        isError: isErrorPendingROI,
        queryKey: pendingROIQueryKey,
    } = usePendingROI(userInfo?.id);
    const {
        data: pendingBinary,
        isLoading: isLoadingPendingBinary,
        isError: isErrorPendingBinary,
        queryKey: pendingBinaryQueryKey,
    } = usePendingBinary(userInfo?.id);
    useEffect(() => {
        console.log({
            userInfo,
            isConnected,
            isLoadingUserInfo,
            userTeamStats,
            pendingROI,
        });
        if (!isLoadingUserInfo && isConnected) {
            // @ts-ignore
            if (!userInfo || Number(userInfo.id) === 0) {
            } else {
                // if (!window.location.pathname.startsWith("/user")) {
                //   router.push("/user/dashboard");
                // }
            }
        }
    }, [
        userInfo,
        isLoadingUserInfo,
        isConnected,
        router,
        userTeamStats,
        pendingROI,
    ]);
    const userTotalEarnings = useMemo(() => {
        if (!userInfo) return BigInt(0);
        return (
            userInfo.levelIncome +
            userInfo.rewardIncome +
            userInfo.autopoolIncome +
            userInfo.binaryIncome
        );
    }, [userInfo]);
    const {
        data: userClaims,
        isLoading: isLoadingUserClaims,
        isError: isErrorUserClaims,
        queryKey: userClaimsQueryKey,
    } = useUserClaims(userInfo?.id || BigInt(0));
    const userAvailableWithdraw = useMemo(() => {
        if (!userClaims) return BigInt(0);
        return (
            userClaims.roiIncome +
            userClaims.levelIncome +
            userClaims.autopoolIncome +
            userClaims.rewardIncome +
            userClaims.binaryIncome
        );
    }, [userClaims]);

    const refreshUserData = (keys?: UserDataKeys[]) => {
        if (!keys || keys.length === 0) {
            // Refresh all data if no keys are specified
            queryClient.invalidateQueries({ queryKey: userInfoQueryKey });
            queryClient.invalidateQueries({
                queryKey: userDirectRefNoQueryKey,
            });
            queryClient.invalidateQueries({ queryKey: userPackagesQueryKey });
            queryClient.invalidateQueries({ queryKey: userTeamStatsQueryKey });
            queryClient.invalidateQueries({ queryKey: userVolumesQueryKey });
            queryClient.invalidateQueries({ queryKey: userClaimsQueryKey });
        } else {
            keys.forEach((key) => {
                switch (key) {
                    case UserDataKeys.USER_INFO:
                        queryClient.invalidateQueries({
                            queryKey: userInfoQueryKey,
                        });
                        break;
                    case UserDataKeys.USER_DIRECT_REF_NO:
                        queryClient.invalidateQueries({
                            queryKey: userDirectRefNoQueryKey,
                        });
                        break;
                    case UserDataKeys.USER_PACKAGES:
                        queryClient.invalidateQueries({
                            queryKey: userPackagesQueryKey,
                        });
                        break;
                    case UserDataKeys.USER_TEAM_STATS:
                        queryClient.invalidateQueries({
                            queryKey: userTeamStatsQueryKey,
                        });
                        break;
                    case UserDataKeys.USER_VOLUMES:
                        queryClient.invalidateQueries({
                            queryKey: userVolumesQueryKey,
                        });
                        break;
                    case UserDataKeys.USER_CLAIMS:
                        queryClient.invalidateQueries({
                            queryKey: userClaimsQueryKey,
                        });
                        break;
                }
            });
        }
    };
    return (
        <UserContext.Provider
            value={{
                userInfo,
                userDirectRefNo,
                userTeamStats,
                userPackages,
                isLoadingUserInfo,
                isPendingUserInfo,
                userInfoError,
                refreshUserData,
                userVolumes,
                userTotalEarnings,
                userClaims,
                userAvailableWithdraw,
                pendingROI,
                pendingBinary,
            }}
        >
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
}
