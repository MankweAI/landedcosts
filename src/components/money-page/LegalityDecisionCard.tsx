"use client";

import type { LegalityDecision } from "@/lib/compliance/types";
import {
    ShieldCheck,
    ShieldAlert,
    ShieldX,
    ShieldQuestion,
    ExternalLink,
} from "lucide-react";

type Props = {
    legality: LegalityDecision;
};

const STATUS_CONFIG = {
    allowed: {
        Icon: ShieldCheck,
        label: "ALLOWED",
        bg: "bg-emerald-50",
        border: "border-emerald-200",
        badge: "bg-emerald-600",
        text: "text-emerald-900",
        iconColor: "text-emerald-600",
    },
    restricted: {
        Icon: ShieldAlert,
        label: "RESTRICTED",
        bg: "bg-amber-50",
        border: "border-amber-200",
        badge: "bg-amber-600",
        text: "text-amber-900",
        iconColor: "text-amber-600",
    },
    prohibited: {
        Icon: ShieldX,
        label: "PROHIBITED",
        bg: "bg-rose-50",
        border: "border-rose-200",
        badge: "bg-rose-600",
        text: "text-rose-900",
        iconColor: "text-rose-600",
    },
    unknown: {
        Icon: ShieldQuestion,
        label: "UNKNOWN",
        bg: "bg-slate-50",
        border: "border-slate-200",
        badge: "bg-slate-500",
        text: "text-slate-700",
        iconColor: "text-slate-500",
    },
} as const;

export function LegalityDecisionCard({ legality }: Props) {
    const config = STATUS_CONFIG[legality.status];
    const { Icon } = config;

    return (
        <section
            className={`rounded-2xl border-2 ${config.border} ${config.bg} p-6 shadow-sm`}
        >
            {/* Hero Badge */}
            <div className="flex items-start gap-4">
                <div className={`rounded-xl p-3 ${config.bg}`}>
                    <Icon className={`h-10 w-10 ${config.iconColor}`} strokeWidth={1.5} />
                </div>
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                        <span
                            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold tracking-wider text-white ${config.badge}`}
                        >
                            {config.label}
                        </span>
                        <span className="text-xs text-slate-500 font-medium uppercase tracking-wide">
                            Import Legality
                        </span>
                    </div>
                    <h2 className={`text-lg font-bold leading-snug ${config.text}`}>
                        Can I import this product?
                    </h2>
                    <p className={`mt-1 text-sm leading-relaxed ${config.text} opacity-80`}>
                        {legality.summary}
                    </p>
                </div>
            </div>

            {/* Restriction Reasons */}
            {legality.restrictionReasons.length > 0 && (
                <div className="mt-4 space-y-1.5">
                    {legality.restrictionReasons.map((reason, i) => (
                        <p
                            key={i}
                            className={`text-sm ${config.text} opacity-70 pl-4 border-l-2 ${config.border}`}
                        >
                            {reason}
                        </p>
                    ))}
                </div>
            )}

            {/* Source References */}
            {legality.sourceRefs.length > 0 && (
                <div className="mt-4 pt-3 border-t border-slate-200/60">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                        Sources
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {legality.sourceRefs.map((ref, i) => (
                            <a
                                key={i}
                                href={ref.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-50 transition-colors shadow-sm"
                                title={ref.citation}
                            >
                                {ref.label}
                                <ExternalLink className="h-3 w-3 opacity-50" />
                            </a>
                        ))}
                    </div>
                </div>
            )}

            {/* Disclaimer */}
            <p className="mt-4 text-[10px] text-slate-400 leading-relaxed">
                This assessment is informational only and does not constitute legal advice.
                Always verify requirements with the relevant authority before importing.
            </p>
        </section>
    );
}
