"use client";
import { useEffect } from "react";
import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";
import { Loader } from "../ui/loader";
import { useIsAdmin } from "@/hooks/use-admin";
import { Address } from "viem";

export function AdminRoute({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const { address, isConnected, isConnecting, isDisconnected } = useAccount();
    const {
        data: isAdmin,
        isLoading: isLoadingAdmin,
        isPending,
    } = useIsAdmin(address as Address);

    useEffect(() => {
        console.log({
            isConnected,
            isAdmin,
            isLoadingAdmin,
            isConnecting,
            isPending,
            isDisconnected,
        });
        if (!isLoadingAdmin && !isConnecting && !isPending) {
            if (!isConnected || !isAdmin || isDisconnected) {
                console.log("redirecting", { isConnected, isAdmin });
                router.push("/");
            }
        }
    }, [
        isConnected,
        isAdmin,
        isLoadingAdmin,
        isConnecting,
        isPending,
        isDisconnected,
        router,
    ]);
    const isLoading = isLoadingAdmin || isConnecting || isPending;

    if (isLoading) {
        return (
            <div>
                <Loader />
            </div>
        );
    }

    return <>{children}</>;
}
