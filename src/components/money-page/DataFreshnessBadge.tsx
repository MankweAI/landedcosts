"use client";

import { ShieldCheck } from "lucide-react";
import { useState } from "react";
import { DataFreshnessModal } from "./DataFreshnessModal";

type DataFreshnessBadgeProps = {
    tariffVersionLabel: string;
    effectiveDate: string;
    sourcePointerShort: string;
};

export function DataFreshnessBadge(props: DataFreshnessBadgeProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-600/20 hover:bg-emerald-100 transition-colors"
                title="Click to view verification details"
            >
                <ShieldCheck className="h-3.5 w-3.5" />
                Rates Verified: {props.tariffVersionLabel}
            </button>

            {isOpen && (
                <DataFreshnessModal
                    isOpen={isOpen}
                    onClose={() => setIsOpen(false)}
                    {...props}
                />
            )}
        </>
    );
}
