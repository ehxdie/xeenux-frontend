"use client";
import { useEffect } from "react";
import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/user";
import { Loader } from "@/components/ui/loader";

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isConnected, isConnecting, isDisconnected } = useAccount();
  const { userInfo, isLoadingUserInfo, isPendingUserInfo } = useUser();

  useEffect(() => {
    console.log({
      isConnected,
      userInfo,
      isLoadingUserInfo,
      isPendingUserInfo,
      isConnecting,
      isDisconnected,
    });
    if (
      !isLoadingUserInfo &&
      !isPendingUserInfo &&
      !isConnecting &&
      !isDisconnected
    ) {
      if (!isConnected || !userInfo || Number(userInfo.id) != 0) {
        router.push("/user/dashboard");
      }
    }
  }, [
    isConnected,
    userInfo,
    isLoadingUserInfo,
    isPendingUserInfo,
    isConnecting,
    isDisconnected,
  ]);

  if (isLoadingUserInfo) {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  return (
    <>
      {children}
    </>
  );
}
