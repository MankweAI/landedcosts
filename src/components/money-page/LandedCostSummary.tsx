
import { formatCurrencyZar } from "@/lib/format";
import type { CalcOutput } from "@/lib/calc/types";
import { ArrowRight, Info } from "lucide-react";
import { DataFreshnessBadge } from "@/components/money-page/DataFreshnessBadge";

type LandedCostSummaryProps = {
    output: CalcOutput;
    tariffVersionLabel?: string;
    effectiveDate?: string;
    sourcePointerShort?: string;
    sellingPrice?: number;
    isVatVendor?: boolean;
};

export function LandedCostSummary({
    output,
    tariffVersionLabel = "",
    effectiveDate = "",
    sourcePointerShort = "",
    sellingPrice,
    isVatVendor = true
}: LandedCostSummaryProps) {
    if (output.landedCostTotalZar === 0) return null;

    // Optional Profit Calculation
    const profit = sellingPrice ? sellingPrice - output.landedCostPerUnitZar : 0;
    const margin = sellingPrice && sellingPrice > 0 ? (profit / sellingPrice) * 100 : 0;
    const isProfitable = profit > 0;

    return (
        <section className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="bg-slate-50 px-5 py-3 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
                    Calculation Result
                </h3>
                <span className="text-xs font-semibold text-slate-400 flex items-center gap-3">
                    <DataFreshnessBadge
                        tariffVersionLabel={tariffVersionLabel}
                        effectiveDate={effectiveDate}
                        sourcePointerShort={sourcePointerShort}
                    />
                    <span className="hidden sm:inline">Confidence: {output.confidenceLabel}</span>
                </span>
            </div>

            <div className="p-5 grid gap-6 md:grid-cols-2 lg:grid-cols-3 items-center">
                {/* Primary Hero: Total and Unit Cost */}
                <div className="lg:col-span-2 space-y-1">
                    <p className="text-sm text-slate-500 font-medium">Total Landed Cost (Cash Outlay)</p>
                    <div className="flex items-baseline gap-3">
                        <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">
                            {formatCurrencyZar(output.landedCostTotalZar)}
                        </h2>
                        <span className="text-xl font-medium text-slate-500">
                            / {formatCurrencyZar(output.landedCostPerUnitZar)} ea
                        </span>
                    </div>
                    <p className="text-xs text-slate-400 max-w-md">
                        Includes customs duty, VAT, levies, shipping, and estimated agency disbursements.
                    </p>
                </div>

                {/* Secondary: Duty & VAT Split */}
                <div className="flex flex-col gap-3 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6">
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-600">Import Duty</span>
                        <span className="font-bold text-slate-900">{formatCurrencyZar(output.dutyAmountZar)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-600">VAT (15%)</span>
                        <span className="font-bold text-slate-900">{formatCurrencyZar(output.vatAmountZar)}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs text-slate-400 pt-2 border-t border-slate-50">
                        <span>Total Taxes</span>
                        <span className="font-medium text-slate-500">{formatCurrencyZar(output.totalTaxesZar)}</span>
                    </div>
                </div>

                {/* Optional: Business Viability (Compact) */}
                {sellingPrice && sellingPrice > 0 && (
                    <div className="flex flex-col gap-3 border-t lg:border-t-0 lg:border-l border-slate-100 pt-4 lg:pt-0 lg:pl-6">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-slate-600">Selling Price</span>
                            <span className="font-medium text-slate-900">{formatCurrencyZar(sellingPrice)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-slate-600">Net Profit</span>
                            <span className={`font-bold ${isProfitable ? "text-emerald-600" : "text-red-600"}`}>
                                {formatCurrencyZar(profit)}
                            </span>
                        </div>
                        <div className="flex justify-between items-center text-xs text-slate-400 pt-2 border-t border-slate-50">
                            <span>Margin</span>
                            <span className={`font-medium ${margin >= 30 ? "text-emerald-500" : margin >= 15 ? "text-amber-500" : "text-red-500"}`}>
                                {margin.toFixed(1)}%
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
