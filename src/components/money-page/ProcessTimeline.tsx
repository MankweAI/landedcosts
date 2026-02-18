"use client";

import type { Requirement } from "@/lib/compliance/types";
import { useMemo } from "react";
import { Clock, AlertTriangle, ArrowRight } from "lucide-react";

type Props = {
    requirements: Requirement[];
};

interface TimelineStep {
    name: string;
    authority: string;
    category: string;
    days: number;
    isCritical: boolean;
    isConditional: boolean;
}

export function ProcessTimeline({ requirements }: Props) {
    const timeline = useMemo(() => {
        // Only include items with lead times
        const withLeadTime = requirements
            .filter((r) => r.leadTimeDays && r.leadTimeDays > 0)
            .sort((a, b) => (b.leadTimeDays ?? 0) - (a.leadTimeDays ?? 0));

        if (withLeadTime.length === 0) return null;

        const maxDays = withLeadTime[0].leadTimeDays ?? 1;

        const steps: TimelineStep[] = withLeadTime.map((req, i) => ({
            name: req.name,
            authority: req.authorityId.toUpperCase(),
            category: req.category,
            days: req.leadTimeDays ?? 0,
            isCritical: i === 0, // Longest lead time = critical path
            isConditional: req.conditional,
        }));

        const totalEstimate = maxDays; // Parallel execution: total = longest

        return { steps, maxDays, totalEstimate };
    }, [requirements]);

    if (!timeline || timeline.steps.length === 0) {
        return null;
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-indigo-600" />
                    <h3 className="text-base font-bold text-slate-900">Preparation Timeline</h3>
                </div>
                <div className="flex items-center gap-1.5 rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-700">
                    <span>Est. Total:</span>
                    <span className="text-base">{timeline.totalEstimate}</span>
                    <span>days</span>
                </div>
            </div>

            <div className="space-y-3">
                {timeline.steps.map((step, i) => {
                    const widthPercent = Math.max(
                        15,
                        Math.round((step.days / timeline.maxDays) * 100)
                    );

                    return (
                        <div key={i} className="space-y-1.5">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 min-w-0">
                                    <span className="text-sm font-medium text-slate-800 truncate">
                                        {step.name}
                                    </span>
                                    {step.isCritical && (
                                        <span className="flex-shrink-0 inline-flex items-center gap-1 rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-600 uppercase">
                                            <AlertTriangle className="h-3 w-3" />
                                            Critical Path
                                        </span>
                                    )}
                                    {step.isConditional && (
                                        <span className="flex-shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700 uppercase">
                                            If Required
                                        </span>
                                    )}
                                </div>
                                <span className="flex-shrink-0 text-xs font-semibold text-slate-500 ml-2">
                                    {step.authority}
                                </span>
                            </div>

                            {/* Bar */}
                            <div className="relative h-7 w-full rounded-lg bg-slate-100 overflow-hidden">
                                <div
                                    className={`h-full rounded-lg flex items-center justify-end px-2 transition-all ${step.isCritical
                                            ? "bg-gradient-to-r from-indigo-500 to-rose-500"
                                            : step.isConditional
                                                ? "bg-gradient-to-r from-amber-300 to-amber-400"
                                                : "bg-gradient-to-r from-blue-400 to-indigo-500"
                                        }`}
                                    style={{ width: `${widthPercent}%` }}
                                >
                                    <span className="text-xs font-bold text-white drop-shadow-sm">
                                        {step.days}d
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Explanation */}
            <div className="flex items-start gap-2 rounded-lg bg-slate-50 border border-slate-200 p-3">
                <ArrowRight className="h-4 w-4 text-slate-400 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-slate-500 leading-relaxed">
                    Requirements can often be processed <strong>in parallel</strong>. The critical path
                    ({timeline.steps[0].name}) determines the minimum preparation time of{" "}
                    <strong>{timeline.totalEstimate} days</strong>.
                </p>
            </div>
        </div>
    );
}
