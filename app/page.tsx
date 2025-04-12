"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader } from "@/components/ui/loader";

export default function DashboardPage() {
  const router = useRouter();
  useEffect(() => {
    router.push("/register");
  }, [router]);

  return (
    <>
       <Loader />
    </>
  );
}
