"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { MobileNav } from "@/components/shell/MobileNav";
import { Sidebar } from "@/components/shell/Sidebar";
import { Topbar } from "@/components/shell/Topbar";
import { Footer } from "@/components/shell/Footer";

type AppShellProps = {
  children: ReactNode;
  title?: string;
};

export function AppShell({ children, title }: AppShellProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex">
        <Sidebar collapsed={isSidebarCollapsed} onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />
        <div className="min-w-0 flex-1">
          <Topbar title={title} onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />
          <main className="mx-auto max-w-[1400px] px-4 pb-36 pt-6 md:px-6 lg:pb-10">{children}</main>
          <Footer />
        </div>
      </div>
      <MobileNav />
    </div>
  );
}

