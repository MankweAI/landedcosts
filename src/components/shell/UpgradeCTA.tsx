"use client";

type UpgradeCTAProps = {
  state?: "logged_out" | "logged_in_free" | "premium";
  compact?: boolean;
};

const copyByState: Record<NonNullable<UpgradeCTAProps["state"]>, string> = {
  logged_out: "Sign up to save & download",
  logged_in_free: "Upgrade to export + watchlist",
  premium: "Manage plan"
};

import { useState } from "react";
import { WaitlistModal } from "@/components/shell/WaitlistModal";

export function UpgradeCTA({ state = "logged_out", compact = false }: UpgradeCTAProps) {
  const [showWaitlist, setShowWaitlist] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setShowWaitlist(true)}
        className={`rounded-lg bg-blue-500 px-3 py-2 text-sm font-semibold text-white shadow-md shadow-blue-500/20 hover:bg-blue-400 ${compact ? "w-auto" : "w-full"
          }`}
      >
        {copyByState[state]}
      </button>
      <WaitlistModal isOpen={showWaitlist} onClose={() => setShowWaitlist(false)} />
    </>
  );
}

