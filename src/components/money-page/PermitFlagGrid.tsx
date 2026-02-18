"use client";

import type { Requirement } from "@/lib/compliance/types";
import {
    FileCheck,
    Clock,
    AlertTriangle,
    ExternalLink,
    ChevronDown,
    ChevronUp,
} from "lucide-react";
import { useState } from "react";

type Props = {
    permits: Requirement[];
    title?: string;
    subtitle?: string;
};

const CATEGORY_META: Record<string, { color: string; bgLight: string }> = {
    permit: { color: "text-violet-700", bgLight: "bg-violet-50" },
    registration: { color: "text-blue-700", bgLight: "bg-blue-50" },
    inspection: { color: "text-amber-700", bgLight: "bg-amber-50" },
    standard: { color: "text-teal-700", bgLight: "bg-teal-50" },
    testing: { color: "text-indigo-700", bgLight: "bg-indigo-50" },
    labeling: { color: "text-orange-700", bgLight: "bg-orange-50" },
    documentation: { color: "text-slate-700", bgLight: "bg-slate-50" },
};

function RequirementRow({ req }: { req: Requirement }) {
    const meta = CATEGORY_META[req.category] ?? CATEGORY_META.documentation;

    return (
        <div className="group flex items-start gap-3 p-3 transition-colors hover:bg-slate-50">
            <div className={`mt-0.5 rounded-md p-1.5 ${meta.bgLight}`}>
                <FileCheck className={`h-4 w-4 ${meta.color}`} />
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-slate-700 group-hover:text-slate-900">
                        {req.name}
                    </span>
                    {req.required && !req.conditional && (
                        <span className="rounded bg-rose-50 px-1.5 py-0.5 text-[10px] font-bold text-rose-600 uppercase border border-rose-100">
                            Required
                        </span>
                    )}
                    {req.conditional && (
                        <span className="rounded bg-amber-50 px-1.5 py-0.5 text-[10px] font-bold text-amber-600 uppercase border border-amber-100">
                            Conditional
                        </span>
                    )}
                </div>

                <div className="mt-0.5 flex items-center gap-3 text-xs text-slate-400">
                    <span className="capitalize">{req.authorityId}</span>
                    {req.leadTimeDays && (
                        <span className="flex items-center gap-1">
                            • {req.leadTimeDays}d lead time
                        </span>
                    )}
                    {req.sourceRefs.length > 0 && (
                        <span className="hidden group-hover:inline-flex items-center gap-1 text-blue-500">
                            • {req.sourceRefs.length} source{req.sourceRefs.length > 1 ? "s" : ""}
                        </span>
                    )}
                </div>
            </div>

            {req.sourceRefs.length > 0 && (
                <a
                    href={req.sourceRefs[0].url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-blue-600 transition-opacity"
                    title="View Source"
                >
                    <ExternalLink className="h-4 w-4" />
                </a>
            )}
        </div>
    );
}

export function PermitFlagGrid({ permits, title = "Required Permits & Registrations", subtitle }: Props) {
    if (permits.length === 0) return null;

    // Sort: Required first, then Conditional
    const sorted = [...permits].sort((a, b) => {
        if (a.required === b.required) return 0;
        return a.required ? -1 : 1;
    });

    return (
        <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
            <div className="bg-slate-50/50 px-4 py-3 border-b border-slate-100">
                <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                    {title}
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500 font-medium">
                        {permits.length}
                    </span>
                </h3>
                {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
            </div>

            <div className="divide-y divide-slate-100">
                {sorted.map((req) => (
                    <RequirementRow key={req.requirementId} req={req} />
                ))}
            </div>
        </div>
    );
}
