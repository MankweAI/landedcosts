"use client";

import {
  Calculator,
  Search,
  ArrowRightLeft,
  Save,
  Bell,
  Database,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  type LucideIcon
} from "lucide-react";
import Link from "next/link";
import { UpgradeCTA } from "@/components/shell/UpgradeCTA";

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

const primaryNav: NavItem[] = [
  { href: "/calculator", label: "Calculator", icon: Calculator },
  { href: "/hs-classifier", label: "HS Code Finder", icon: Search },
  { href: "/compare", label: "Compare Scenarios", icon: ArrowRightLeft },
  { href: "/dashboard/saved", label: "Saved Scenarios", icon: Save },
  { href: "/dashboard/watchlist", label: "Watchlist & Alerts", icon: Bell }
];

const secondaryNav: NavItem[] = [
  { href: "/how-it-works", label: "Data Freshness", icon: Database },
  { href: "/contact", label: "Help / FAQ", icon: HelpCircle }
];

type SidebarProps = {
  collapsed?: boolean;
  onToggle?: () => void;
};

export function Sidebar({ collapsed = false, onToggle }: SidebarProps) {
  return (
    <aside
      className={`hidden min-h-screen shrink-0 border-r border-slate-800 bg-slate-900 duration-300 ease-in-out lg:flex lg:flex-col ${collapsed ? "lg:w-[80px]" : "lg:w-[280px]"
        }`}
    >
      <div className="flex h-16 items-center justify-between px-4">
        <Link href="/" className={`flex items-center gap-2 font-bold text-white ${collapsed ? "justify-center w-full" : ""}`}>
          {collapsed ? <span className="text-xl">LC</span> : <span className="text-xl tracking-tight">LandedCost<span className="text-blue-500">.io</span></span>}
        </Link>
        {!collapsed && (
          <button
            onClick={onToggle}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <ChevronLeft size={18} />
          </button>
        )}
      </div>

      <div className="flex-1 px-3 py-4">
        {!collapsed && <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Tools</p>}
        <nav className="space-y-1">
          {primaryNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={`group flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${collapsed ? "justify-center" : "justify-start"
                } text-slate-300 hover:bg-slate-800 hover:text-white hover:shadow-md hover:shadow-black/20`}
            >
              <item.icon
                size={20}
                className={`${collapsed ? "" : "mr-3"} shrink-0 text-slate-400 transition-colors group-hover:text-blue-400`}
              />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>

        <div className="my-6 border-t border-slate-800/50" />

        {!collapsed && <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Support</p>}
        <nav className="space-y-1">
          {secondaryNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={`group flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${collapsed ? "justify-center" : "justify-start"
                } text-slate-300 hover:bg-slate-800 hover:text-white hover:shadow-md hover:shadow-black/20`}
            >
              <item.icon
                size={20}
                className={`${collapsed ? "" : "mr-3"} shrink-0 text-slate-400 transition-colors group-hover:text-blue-400`}
              />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>
      </div>

      <div className="mt-auto border-t border-slate-800 p-4">
        {collapsed ? (
          <button
            onClick={onToggle}
            className="flex w-full justify-center rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            <ChevronRight size={20} />
          </button>
        ) : (
          <UpgradeCTA compact={false} />
        )}
      </div>
    </aside>
  );
}

