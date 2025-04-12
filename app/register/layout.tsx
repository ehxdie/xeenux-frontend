"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";


export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // If user is already authenticated, redirect to dashboard
    if (isAuthenticated) {
      router.push("/user/dashboard");
    }
  }, [isAuthenticated, router]);

  // If user is not authenticated, show register page
  return <>{children}</>;
}