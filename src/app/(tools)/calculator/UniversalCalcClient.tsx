"use client";

import Link from "next/link";
import { useState } from "react";
import type { CalcOutput } from "@/lib/calc/types";
import { trackEvent } from "@/lib/events/track";
import { BusinessDashboard } from "@/components/money-page/BusinessDashboard";
import { SteppedCalc, type CalcFormState } from "@/components/money-page/SteppedCalc";
import { BreakdownTable } from "@/components/money-page/BreakdownTable";
import { SectionReveal } from "@/components/money-page/SectionReveal";
import { WaitlistModal } from "@/components/shell/WaitlistModal";
import { StickyActionBar } from "@/components/money-page/StickyActionBar";
import { PremiumCtaCard } from "@/components/money-page/PremiumCtaCard";

function initialForm(): CalcFormState {
    return {
        hs6: "",
        origin: "china",
        incoterm: "FOB",
        invoiceValueZar: 50000,
        freightZar: 0,
        insuranceZar: 0,
        otherFeesZar: 0,
        quantity: 100,
        importerIsVatVendor: true,
        sellingPricePerUnitZar: 1000,
        fxRate: 18.5, // Default, should ideally be fetched
        hsConfidence: 0,
        portOfEntry: "DBN",
        shippingMode: "LCL",
        useAgencyEstimate: true,
        risk_demurrageDays: 0,
        risk_forexBuffer: 0,
        overrideCifFreightInsurance: false,
        customDutyRate: undefined
    };
}

function emptyOutput(): CalcOutput {
    return {
        dutyAmountZar: 0,
        vatAmountZar: 0,
        levyAmountZar: 0,
        totalTaxesZar: 0,
        landedCostTotalZar: 0,
        landedCostPerUnitZar: 0,
        grossMarginPercent: 0,
        verdict: "Enter details to calculate",
        confidenceLabel: "low",
        warnings: [],
        breakdown: [],
        tariffVersionLabel: "",
        effectiveDate: "",
        sourcePointerShort: ""
    };
}

export function UniversalCalcClient() {
    const [form, setForm] = useState<CalcFormState>(initialForm);
    const [output, setOutput] = useState<CalcOutput>(emptyOutput);
    const [hasCalculated, setHasCalculated] = useState(false);
    const [modalState, setModalState] = useState<null | "signup">();
    const [isCalculating, setIsCalculating] = useState(false);

    const [showDutyOverride, setShowDutyOverride] = useState(false);
    const [resumeWithDuty, setResumeWithDuty] = useState(false);

    async function recalculate(overrideRate?: number) {
        // Ensure overrideRate is strictly a number if provided (react events can leak in)
        const safeOverrideRate = typeof overrideRate === "number" ? overrideRate : undefined;

        console.log("Recalculating with override rate:", safeOverrideRate);
        setIsCalculating(true);
        setShowDutyOverride(false);

        trackEvent("calc_started", {
            pageTemplate: "universal",
            origin: form.origin,
            productCluster: "universal"
        });

        try {
            const payload = {
                ...form,
                hs6: form.hs6.trim(),
                origin: form.origin.trim(),
                dest: "ZA",
                customDutyRate: safeOverrideRate !== undefined ? safeOverrideRate / 100 : (form.customDutyRate ?? undefined)
            };

            const response = await fetch("/api/calc", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                console.error("Calculation API error:", response.status);
                try {
                    const errData = await response.json();
                    console.error("Validation details:", errData);
                    const details = errData.details?.fieldErrors ? JSON.stringify(errData.details.fieldErrors) : (errData.error || "Unknown error");
                    alert(`Calculation failed: ${details}`);
                } catch (e) {
                    alert("Calculation failed (API Error).");
                }
                return;
            }

            const data = (await response.json()) as { output: CalcOutput | null, error?: string };

            if (data.output) {
                setOutput(data.output);
                setHasCalculated(true);
                if (safeOverrideRate !== undefined) {
                    setForm(prev => ({ ...prev, customDutyRate: safeOverrideRate / 100 }));
                }
                trackEvent("calc_completed", {
                    pageTemplate: "universal",
                    origin: form.origin,
                    productCluster: "universal"
                });
            } else {
                if (data.error && data.error.includes("Missing tariff")) {
                    setShowDutyOverride(true);
                } else {
                    console.warn("Calculation returned no output:", data.error);
                    alert(data.error || "No tariff data found.");
                }
            }
        } catch (error) {
            console.error("Calculation failed", error);
            alert("An unexpected error occurred.");
        } finally {
            setIsCalculating(false);
        }
    }

    function handlePremiumAction(action: "save" | "export" | "compare" | "watchlist") {
        trackEvent("paywall_viewed", {
            pageTemplate: "universal",
            origin: form.origin,
            productCluster: "universal",
            action
        });
        setModalState("signup");
    }

    return (
        <div className="mx-auto max-w-5xl p-4 lg:p-8">
            <div className="mb-8 space-y-4">
                <nav className="flex items-center gap-2 text-sm text-slate-500">
                    <Link href="/" className="hover:text-blue-600 hover:underline">
                        Home
                    </Link>
                    <span className="text-slate-300">/</span>
                    <span className="font-medium text-slate-700">Universal Calculator</span>
                </nav>

                <div className="space-y-2">
                    <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 lg:text-4xl">
                        Universal Landed Cost Calculator
                    </h1>
                    <p className="text-lg text-slate-600 max-w-3xl leading-relaxed">
                        Calculate import duties, VAT, and shipping costs for any product from any origin.
                    </p>
                </div>

                <SteppedCalc value={form} onChange={setForm} onSubmit={recalculate} />

                {hasCalculated && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
                        <BusinessDashboard
                            output={output}
                            form={form}
                            onChange={setForm}
                            activePreset="custom"
                        />

                        <div className="grid grid-cols-12 gap-4">
                            <div className="col-span-12 lg:col-span-8">
                                <SectionReveal title="Line-item Costs" subtitle="Detailed breakdown of duties, taxes, and fees." defaultOpen={true} variant="blue">
                                    <BreakdownTable output={output} />
                                </SectionReveal>
                            </div>
                            <aside className="col-span-12 lg:col-span-4 lg:sticky lg:top-24 lg:self-start">
                                <PremiumCtaCard onClick={() => handlePremiumAction("save")} />
                            </aside>
                        </div>

                        <StickyActionBar onAction={handlePremiumAction} />
                    </div>
                )}
            </div>

            <WaitlistModal isOpen={modalState === "signup"} onClose={() => setModalState(null)} />

            {/* Manual Duty Override Modal */}
            {showDutyOverride && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl animate-in zoom-in-95 duration-200">
                        <div className="mb-4">
                            <h3 className="text-xl font-bold text-slate-900">Tariff Rate Missing</h3>
                            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                                We don't have the official tariff for HS <strong>{form.hs6}</strong> from {form.origin} yet.
                            </p>
                            <p className="mt-2 text-sm text-slate-600">
                                Please enter an estimated duty rate to proceed.
                            </p>
                        </div>

                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                const data = new FormData(e.currentTarget);
                                const rate = Number(data.get("rate"));
                                if (!isNaN(rate)) {
                                    recalculate(rate);
                                }
                            }}
                        >
                            <label className="block mb-4">
                                <span className="block text-sm font-medium text-slate-700 mb-1">Import Duty Rate (%)</span>
                                <div className="relative">
                                    <input
                                        name="rate"
                                        type="number"
                                        step="0.1"
                                        min="0"
                                        max="100"
                                        defaultValue="20"
                                        autoFocus
                                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    />
                                    <span className="absolute right-3 top-2 text-slate-400">%</span>
                                </div>
                            </label>

                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowDutyOverride(false)}
                                    className="flex-1 rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700"
                                >
                                    Calculate
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
