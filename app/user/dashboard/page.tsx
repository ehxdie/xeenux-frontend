"use client";

import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";
import { SwapSection } from "@/components/swap-section";
import { MainContent } from "@/components/main-content";
import { Hero } from "@/components/hero";

export default function DashboardPage() {
  return (
     <div className="min-h-screen overflow-x-hidden">
      <Header />
      <div className="container mx-auto py-8">
        <Hero />
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-[30%]">
            <Sidebar />
          </div>
          <div className="flex-1 space-y-8 w-full lg:w-[70%]">
            <MainContent />
          </div>
        </div>
      </div>
    // </div>
  );
}
