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

const CATEGORY_META: Record<string, { color: string; bgLight: string; border: string }> = {
    permit: { color: "text-violet-700", bgLight: "bg-violet-50", border: "border-violet-200" },
    registration: { color: "text-blue-700", bgLight: "bg-blue-50", border: "border-blue-200" },
    inspection: { color: "text-amber-700", bgLight: "bg-amber-50", border: "border-amber-200" },
    standard: { color: "text-teal-700", bgLight: "bg-teal-50", border: "border-teal-200" },
    testing: { color: "text-indigo-700", bgLight: "bg-indigo-50", border: "border-indigo-200" },
    labeling: { color: "text-orange-700", bgLight: "bg-orange-50", border: "border-orange-200" },
    documentation: { color: "text-slate-700", bgLight: "bg-slate-50", border: "border-slate-200" },
};

function getCategoryMeta(cat: string) {
    return CATEGORY_META[cat] ?? CATEGORY_META.documentation;
}

function RequirementCard({ req }: { req: Requirement }) {
    const [expanded, setExpanded] = useState(false);
    const meta = getCategoryMeta(req.category);

    return (
        <div
            className={`rounded-xl border ${meta.border} ${meta.bgLight} p-4 transition-shadow hover:shadow-md`}
        >
            <div className="flex items-start gap-3">
                <div className={`rounded-lg p-2 ${meta.bgLight}`}>
                    <FileCheck className={`h-5 w-5 ${meta.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        <h3 className={`text-sm font-bold ${meta.color}`}>{req.name}</h3>
                        {req.required && !req.conditional && (
                            <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-700 uppercase">
                                Required
                            </span>
                        )}
                        {req.conditional && (
                            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700 uppercase">
                                Conditional
                            </span>
                        )}
                    </div>

                    <p className="mt-1 text-xs text-slate-500 capitalize">{req.category} · {req.authorityId.toUpperCase()}</p>

                    {req.leadTimeDays && (
                        <div className="mt-2 inline-flex items-center gap-1.5 rounded-md bg-white px-2 py-1 text-xs text-slate-600 border border-slate-200">
                            <Clock className="h-3 w-3 text-slate-400" />
                            Est. {req.leadTimeDays} days lead time
                        </div>
                    )}

                    {req.conditional && req.conditions && (
                        <div className="mt-2 flex items-start gap-1.5 text-xs text-amber-700">
                            <AlertTriangle className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
                            <span>{req.conditions}</span>
                        </div>
                    )}

                    {/* Expandable sources */}
                    {req.sourceRefs.length > 0 && (
                        <div className="mt-3">
                            <button
                                onClick={() => setExpanded(!expanded)}
                                className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium"
                            >
                                {expanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                                {req.sourceRefs.length} source{req.sourceRefs.length > 1 ? "s" : ""}
                            </button>
                            {expanded && (
                                <div className="mt-2 space-y-1.5 pl-2 border-l-2 border-slate-200">
                                    {req.sourceRefs.map((ref, i) => (
                                        <div key={i} className="text-xs">
                                            <a
                                                href={ref.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1 text-blue-600 hover:underline"
                                            >
                                                {ref.label} <ExternalLink className="h-2.5 w-2.5" />
                                            </a>
                                            <p className="text-slate-400 mt-0.5">{ref.citation}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export function PermitFlagGrid({ permits, title = "Required Permits & Registrations", subtitle }: Props) {
    if (permits.length === 0) return null;

    const required = permits.filter((p) => p.required && !p.conditional);
    const conditional = permits.filter((p) => p.conditional);

    return (
        <div>
            <div className="mb-4">
                <h2 className="text-lg font-bold text-slate-900">{title}</h2>
                {subtitle && <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>}
            </div>

            {required.length > 0 && (
                <div className="space-y-3 mb-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-rose-600">
                        Mandatory ({required.length})
                    </p>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        {required.map((req) => (
                            <RequirementCard key={req.requirementId} req={req} />
                        ))}
                    </div>
                </div>
            )}

            {conditional.length > 0 && (
                <div className="space-y-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-amber-600">
                        Conditional ({conditional.length})
                    </p>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        {conditional.map((req) => (
                            <RequirementCard key={req.requirementId} req={req} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
