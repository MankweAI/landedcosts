"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { useState, type ReactNode } from "react";

type SectionVariant = "slate" | "blue" | "emerald" | "amber" | "violet" | "indigo" | "rose";

type SectionRevealProps = {
    title: string;
    subtitle?: string;
    children: ReactNode;
    defaultOpen?: boolean;
    variant?: SectionVariant;
};

const variantStyles: Record<SectionVariant, { border: string; bg: string; icon: string; text: string }> = {
    slate: { border: "border-l-slate-400", bg: "hover:bg-slate-50", icon: "text-slate-400 group-hover:bg-slate-100", text: "group-hover:text-slate-700" },
    blue: { border: "border-l-blue-500", bg: "hover:bg-blue-50", icon: "text-blue-400 group-hover:bg-blue-100 group-hover:text-blue-600", text: "group-hover:text-blue-700" },
    emerald: { border: "border-l-emerald-500", bg: "hover:bg-emerald-50", icon: "text-emerald-400 group-hover:bg-emerald-100 group-hover:text-emerald-600", text: "group-hover:text-emerald-700" },
    amber: { border: "border-l-amber-500", bg: "hover:bg-amber-50", icon: "text-amber-400 group-hover:bg-amber-100 group-hover:text-amber-600", text: "group-hover:text-amber-700" },
    violet: { border: "border-l-violet-500", bg: "hover:bg-violet-50", icon: "text-violet-400 group-hover:bg-violet-100 group-hover:text-violet-600", text: "group-hover:text-violet-700" },
    indigo: { border: "border-l-indigo-500", bg: "hover:bg-indigo-50", icon: "text-indigo-400 group-hover:bg-indigo-100 group-hover:text-indigo-600", text: "group-hover:text-indigo-700" },
    rose: { border: "border-l-rose-500", bg: "hover:bg-rose-50", icon: "text-rose-400 group-hover:bg-rose-100 group-hover:text-rose-600", text: "group-hover:text-rose-700" }
};

export function SectionReveal({
    title,
    subtitle,
    children,
    defaultOpen = false,
    variant = "slate"
}: SectionRevealProps) {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    const styles = variantStyles[variant];

    if (isOpen) {
        return (
            <div className="animate-in fade-in duration-300">
                <div className={`mb-2 flex items-center justify-between border-l-4 ${styles.border} pl-3`}>
                    <h2 className="text-lg font-bold text-slate-900">{title}</h2>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                    >
                        Hide
                        <ChevronUp size={14} />
                    </button>
                </div>
                <div className="pl-4 border-l border-slate-100 ml-1">
                    {children}
                </div>
            </div>
        );
    }

    return (
        <button
            onClick={() => setIsOpen(true)}
            className={`group flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white p-5 text-left shadow-sm transition-all hover:shadow-md border-l-4 ${styles.border} ${styles.bg}`}
        >
            <div>
                <h2 className={`text-lg font-bold text-slate-900 ${styles.text}`}>{title}</h2>
                {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
            </div>
            <div className={`rounded-full p-2 transition-colors ${styles.icon}`}>
                <ChevronDown size={20} />
            </div>
        </button>
    );
}
