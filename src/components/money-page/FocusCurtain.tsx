"use client";

import { ChevronDown, ChevronUp, type LucideIcon } from "lucide-react";
import { useState, type ReactNode } from "react";

type FocusCurtainProps = {
    children: ReactNode;
    labelOpen?: string;
    labelClosed?: string;
    defaultOpen?: boolean;
};

export function FocusCurtain({
    children,
    labelOpen = "Hide detailed breakdown",
    labelClosed = "Show detailed breakdown & references",
    defaultOpen = false
}: FocusCurtainProps) {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="space-y-6">
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="group flex w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-blue-300 bg-blue-50/50 p-8 text-center transition-all hover:bg-blue-50 hover:shadow-md"
                >
                    <span className="text-lg font-bold text-blue-700">{labelClosed}</span>
                    <span className="text-sm text-blue-600/80">
                        View line-item costs, documentation requirements, and risks
                    </span>
                    <ChevronDown className="mt-2 text-blue-500 transition-transform group-hover:translate-y-1" />
                </button>
            )}

            <div className={isOpen ? "animate-in slide-in-from-top-4 fade-in duration-500" : "hidden"}>
                {children}

                <div className="mt-8 flex justify-center">
                    <button
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                    >
                        <ChevronUp size={16} />
                        {labelOpen}
                    </button>
                </div>
            </div>
        </div>
    );
}
