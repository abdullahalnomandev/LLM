"use client";

import React from "react";
import Contents from "@/components/UI/Contents";
import Sidebar from "@/components/UI/Sidebar";
import DashboardHeader from "@/components/UI/DashboardHeader";

type DashboardLayoutProps = {
  children: React.ReactNode;
  role: "USER" | "ADMIN";
  handleLogout: () => void;
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader />
      <div className="flex mt-[56px]">
        <Sidebar />
        <Contents>{children}</Contents>
      </div>
    </div>
  );
}
