"use client";

import { UpgradeCTA } from "@/components/shell/UpgradeCTA";

type TopbarProps = {
  title?: string;
  onToggleSidebar?: () => void;
};

export function Topbar({ title = "LandedCost OS", onToggleSidebar }: TopbarProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden text-slate-500 hover:text-slate-700"
            aria-label="Toggle menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
          <div>
            <p className="text-sm font-semibold text-slate-900">{title}</p>
            <p className="text-xs text-slate-500">Decision-grade import costing</p>
          </div>
        </div>
        <div className="hidden sm:block">
          <UpgradeCTA compact />
        </div>
      </div>
    </header>
  );
}

