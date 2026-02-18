
import { LegalityDecisionCard } from "@/components/money-page/LegalityDecisionCard";
import type { LegalityDecision } from "@/lib/compliance/types";
import { ArrowRight } from "lucide-react";

type LegalityGatewayProps = {
    isOpen: boolean;
    onDismiss: () => void;
    legality: LegalityDecision;
    productName: string;
};

export function LegalityGateway({ isOpen, onDismiss, legality, productName }: LegalityGatewayProps) {
    if (!isOpen) return null;

    const isProhibited = legality.status === "prohibited";
    const isRestricted = legality.status === "restricted";
    const isAllowed = legality.status === "allowed";

    // Dynamic Headline Construction
    let headline = "";
    let subtext = "";

    if (isProhibited) {
        headline = `You CANNOT import ${productName}`;
        subtext = "This product is strictly prohibited. Customs will seize this shipment.";
    } else if (isRestricted) {
        headline = `You CAN import ${productName}, BUT...`;
        subtext = "Specific permits and documents are required before you pay your supplier.";
    } else {
        headline = `You CAN import ${productName}`;
        subtext = "Standard customs declarations apply. Ensure your invoice is correct.";
    }

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/95 p-4 backdrop-blur-md animate-in fade-in duration-300 overflow-y-auto">
            <div className="relative w-full max-w-lg my-auto space-y-4 sm:space-y-6 animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">

                <div className="text-center space-y-2 mt-4 sm:mt-0">
                    <h2 className="text-2xl font-bold text-white tracking-tight">
                        {headline}
                    </h2>
                    <p className="text-slate-400 text-sm max-w-sm mx-auto">
                        {subtext}
                    </p>
                </div>

                {/* The Card Itself - Reused */}
                <div className="shadow-2xl ring-1 ring-white/10 rounded-2xl overflow-hidden bg-white flex flex-col max-h-[70vh] sm:max-h-none">
                    <div className="overflow-y-auto p-1">
                        <LegalityDecisionCard legality={legality} />
                    </div>

                    {/* Action Bar */}
                    <div className="bg-slate-50 p-4 border-t border-slate-100 flex justify-end shrink-0">
                        <button
                            onClick={onDismiss}
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-slate-900/20 hover:bg-slate-800 hover:scale-[1.02] active:scale-[0.98] transition-all"
                        >
                            {isProhibited ? "I Understand the Risk" : "I Have Reviewed the Requirements"}
                            <ArrowRight size={16} />
                        </button>
                    </div>
                </div>

                <p className="text-center text-xs text-white/30">
                    Dismissing this notice acknowledges your responsibility as the importer of record.
                </p>
            </div>
        </div>
    );
}
