"use client";

import { Header } from "@/components/header";
import RegisterPage from "./register/page";
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
      {/* <div className="min-h-screen overflow-x-hidden">
      <Header />
      <RegisterPage />
    </div> */}
      <Loader />
    </>
  );
}
