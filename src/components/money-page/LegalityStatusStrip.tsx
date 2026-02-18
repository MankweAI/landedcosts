
import { STATUS_CONFIG } from "@/components/money-page/LegalityDecisionCard";
import type { LegalityDecision } from "@/lib/compliance/types";
import { Info } from "lucide-react";

type Props = {
    legality: LegalityDecision;
    onOpenDetails: () => void;
};

export function LegalityStatusStrip({ legality, onOpenDetails }: Props) {
    const config = STATUS_CONFIG[legality.status];
    const { Icon } = config;

    return (
        <div className={`rounded-xl border ${config.border} ${config.bg} p-3 flex items-center justify-between shadow-sm animate-in fade-in slide-in-from-top-2 duration-500`}>
            <div className="flex items-center gap-3">
                <div className={`p-1.5 rounded-lg ${config.badge} bg-opacity-10`}>
                    <Icon className={`h-5 w-5 ${config.iconColor}`} />
                </div>
                <div>
                    <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold tracking-wider ${config.iconColor}`}>
                            {config.label}
                        </span>
                        <span className="text-xs text-slate-400">&bull;</span>
                        <span className="text-xs text-slate-500 font-medium">Import Legality Verification</span>
                    </div>
                </div>
            </div>

            <button
                onClick={onOpenDetails}
                className="text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg px-3 py-1.5 shadow-sm transition-colors flex items-center gap-1.5"
            >
                <Info size={14} className="text-slate-400" />
                View Details
            </button>
        </div>
    );
}
