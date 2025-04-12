"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";


export default function LoginLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        if (isAuthenticated) {
            router.push("/user/dashboard");
        }
    }, [isAuthenticated, router]);

    return <>{children}</>;
}