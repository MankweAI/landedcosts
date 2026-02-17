"use client";

import { formatCurrencyZar } from "@/lib/format";
import type { CalcOutput } from "@/lib/calc/types";
import type { CalcFormState } from "@/components/money-page/SteppedCalc";
import { ConfidenceBadge } from "@/components/money-page/ConfidenceBadge";
import { BusinessOutcomeCard } from "@/components/money-page/BusinessOutcomeCard";
import { Info, TrendingUp, Wallet } from "lucide-react";
import { ProductMetrics } from "@/components/money-page/ProductMetrics";
import { getProductModule } from "@/lib/products/registry";

type BusinessDashboardProps = {
    output: CalcOutput;
    form: CalcFormState;
    onChange: (next: CalcFormState) => void;
    activePreset: string;
};

export function BusinessDashboard({ output, form, onChange, activePreset }: BusinessDashboardProps) {
    const activeModule = getProductModule(form.hs6);

    const handlePriceChange = (value: number) => {
        onChange({ ...form, sellingPricePerUnitZar: value });
    };

    // VAT Logic
    // Assuming output.landedCostTotalZar is the "Final Cost to Company"
    // If VAT Vendor: Cost = Total - VAT Amount (if included) -> Wait, let's look at the "Total Taxes"
    // Let's simplify: 
    // Cash Outlay = Duty + VAT + Levies + Fees + FOB + Freight + Ins
    // We can reconstruct "Total Cash Outlay" roughly as landedCostTotalZar if it's inclusive, or add VAT if exclusive.
    // To be safe, let's use the breakdown components if available, but output.landedCostTotalZar is the source of truth.
    // We will assume output.landedCostTotalZar is the "Effective Cost".
    // If `importerIsVatVendor` was TRUE during calc, then landedCostTotalZar likely EXCLUDES VAT?
    // Let's rely on the toggle to just Change the "View" conceptually.

    const vatAmount = output.vatAmountZar;
    const inlandValues = form.inlandTransportZar || 0;
    const totalCashOutlay = output.landedCostTotalZar + inlandValues + (form.importerIsVatVendor ? vatAmount : 0);

    // Effective Cost for Profitability
    // If VAT Vendor: Landed Cost (ex VAT) + Inland.
    // IF NOT Vendor: Landed Cost (incl VAT) + Inland.
    const netEffectiveCost = output.landedCostTotalZar + inlandValues;

    // Re-calculate Landed Cost Per Unit to include Inland
    const totalUnits = form.quantity || 1;
    const landedCostPerUnit = (netEffectiveCost / totalUnits);

    return (
        <section className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900">Business Decision Dashboard</h2>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">Based on {activePreset} View</span>
                    <ConfidenceBadge label={output.confidenceLabel} />
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                {/* Dynamic Product Metrics (if any) - Inserts as first card for emphasis if present */}
                {activeModule && activeModule.metrics && activeModule.metrics.length > 0 && (
                    <ProductMetrics module={activeModule} output={output} inputs={form.productSpecificData || {}} />
                )}

                {/* Card 1: Cash Flow */}
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex items-start justify-between mb-3">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Cash Flow</p>
                            <h3 className="mt-1 text-2xl font-extrabold text-slate-900">{formatCurrencyZar(totalCashOutlay)}</h3>
                            <p className="text-xs text-slate-500">Total cash required to land goods</p>
                        </div>
                        <Wallet size={20} className="text-slate-400" />
                    </div>

                    <div className="space-y-2 mb-3 rounded-lg bg-slate-50 p-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-slate-600">Import Duty</span>
                            <span className="font-semibold text-slate-900">{formatCurrencyZar(output.dutyAmountZar)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-600">VAT (15%)</span>
                            <span className="font-semibold text-slate-900">{formatCurrencyZar(output.vatAmountZar)}</span>
                        </div>
                        {form.inlandTransportZar && form.inlandTransportZar > 0 && (
                            <div className="flex justify-between border-t border-slate-200 pt-1 mt-1">
                                <span className="text-slate-600">Inland Transport</span>
                                <span className="font-semibold text-slate-900">{formatCurrencyZar(form.inlandTransportZar)}</span>
                            </div>
                        )}
                    </div>

                    <div className="pt-3 border-t border-slate-100">
                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 text-sm text-slate-600">
                                <input
                                    type="checkbox"
                                    checked={form.importerIsVatVendor}
                                    onChange={(e) => onChange({ ...form, importerIsVatVendor: e.target.checked })}
                                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                />
                                VAT Vendor
                            </label>
                            {form.importerIsVatVendor && (
                                <div className="text-right">
                                    <span className="block text-xs text-emerald-600 font-medium">Reclaimable</span>
                                    <span className="text-sm font-bold text-emerald-700">{formatCurrencyZar(vatAmount)}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                {/* Card 2: Business Outcome (Profit & ROI) */}
                <BusinessOutcomeCard
                    landedCostPerUnit={landedCostPerUnit}
                    quantity={form.quantity}
                    initialSellingPrice={form.sellingPricePerUnitZar}
                    onPriceChange={handlePriceChange}
                />
            </div>
        </section>
    );
}
