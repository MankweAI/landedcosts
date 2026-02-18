"use client";

import { useState } from "react";
import { FunnelStep } from "./FunnelStep";
import { LegalityDecisionCard } from "@/components/money-page/LegalityDecisionCard";
import { PermitFlagGrid } from "@/components/money-page/PermitFlagGrid";
import type { ComplianceResult } from "@/lib/compliance/types";
import { ArrowRight, Calculator, CheckCircle } from "lucide-react";

type ComplianceFunnelProps = {
    complianceResult: ComplianceResult;
    productName: string;
    calculatorNode: React.ReactNode;
    summaryNode?: React.ReactNode;
    onStepChange?: (step: number) => void;
};

export function ComplianceFunnel({
    complianceResult,
    productName,
    calculatorNode,
    summaryNode,
    onStepChange
}: ComplianceFunnelProps) {

    const [currentStep, setCurrentStepRaw] = useState(1);

    function setCurrentStep(step: number) {
        setCurrentStepRaw(step);
        onStepChange?.(step);
    }

    const legality = complianceResult.legality;
    const isProhibited = legality.status === "prohibited";
    const isRestricted = legality.status === "restricted";

    // Auto-advance if already completed before? 
    // No, let the user flow through.

    // Render only the current step (Mobile App Style)
    return (
        <div className="max-w-xl mx-auto py-8">

            {/* Progress Indicator */}
            <div className="flex items-center justify-between mb-8 px-4">
                {[1, 2, 3].map((step) => (
                    <div key={step} className="flex flex-col items-center gap-2">
                        <div className={`h-2 w-16 rounded-full transition-all duration-500 ${step <= currentStep ? 'bg-blue-600' : 'bg-slate-200'}`} />
                        <span className={`text-[10px] font-bold uppercase tracking-widest ${step <= currentStep ? 'text-blue-600' : 'text-slate-300'}`}>
                            {step === 1 ? 'Legality' : step === 2 ? 'Compliance' : 'Cost'}
                        </span>
                    </div>
                ))}
            </div>

            {/* STEP 1: LEGALITY */}
            {currentStep === 1 && (
                <div className="animate-in slide-in-from-right-8 fade-in duration-500">
                    <FunnelStep
                        stepNumber={1}
                        currentStep={1}
                        title={`Can I import ${productName}?`}
                        description="Check if this product is allowed for import into South Africa."
                        isCompleted={false}
                        isLocked={false}
                        action={
                            !isProhibited && (
                                <button
                                    onClick={() => setCurrentStep(2)}
                                    className="w-full inline-flex justify-center items-center gap-2 rounded-xl bg-blue-600 px-6 py-4 text-base font-bold text-white shadow-xl shadow-blue-600/20 hover:bg-blue-700 hover:scale-[1.02] active:scale-[0.98] transition-all"
                                >
                                    Legality Approved: Continue
                                    <ArrowRight size={20} />
                                </button>
                            )
                        }
                    >
                        <LegalityDecisionCard legality={legality} />
                    </FunnelStep>
                </div>
            )}

            {/* STEP 2: DOCUMENTS */}
            {currentStep === 2 && (
                <div className="animate-in slide-in-from-right-8 fade-in duration-500">
                    <div className="mb-4">
                        <button
                            onClick={() => setCurrentStep(1)}
                            className="text-sm text-slate-400 hover:text-slate-600 flex items-center gap-1"
                        >
                            ← Back to Legality
                        </button>
                    </div>
                    <FunnelStep
                        stepNumber={2}
                        currentStep={2}
                        title="Do I have the required documents?"
                        description="You must have these permits and certifications BEFORE you ship."
                        isCompleted={false}
                        isLocked={false}
                        action={
                            <button
                                onClick={() => setCurrentStep(3)}
                                className="w-full inline-flex justify-center items-center gap-2 rounded-xl bg-blue-600 px-6 py-4 text-base font-bold text-white shadow-xl shadow-blue-600/20 hover:bg-blue-700 hover:scale-[1.02] active:scale-[0.98] transition-all"
                            >
                                Documents Ready: Unlock Calculator
                                <Calculator size={20} />
                            </button>
                        }
                    >
                        <div className="space-y-6">
                            <PermitFlagGrid
                                permits={[
                                    ...complianceResult.compliance.permitsRequired,
                                    ...complianceResult.compliance.inspectionsRequired,
                                ]}
                                title="Permits & Inspections"
                                subtitle="Must be obtained BEFORE shipping."
                            />
                            {(complianceResult.compliance.certificationsRequired.length > 0 || complianceResult.compliance.labelingRequired.length > 0) && (
                                <div className="mt-4">
                                    <PermitFlagGrid
                                        permits={[
                                            ...complianceResult.compliance.certificationsRequired,
                                            ...complianceResult.compliance.labelingRequired,
                                        ]}
                                        title="Standards & Labeling"
                                        subtitle="Mandatory certifications and package markings."
                                    />
                                </div>
                            )}
                        </div>
                    </FunnelStep>
                </div>
            )}

            {/* STEP 3: CALCULATOR */}
            {currentStep === 3 && (
                <div className="animate-in slide-in-from-right-8 fade-in duration-500">
                    <div className="mb-4">
                        <button
                            onClick={() => setCurrentStep(2)}
                            className="text-sm text-slate-400 hover:text-slate-600 flex items-center gap-1"
                        >
                            ← Back to Compliance
                        </button>
                    </div>
                    <FunnelStep
                        stepNumber={3}
                        currentStep={3}
                        title="What is my total landed cost?"
                        description="Calculate duty, VAT, and cash outlay."
                        isCompleted={false}
                        isLocked={false}
                    >
                        <div className="space-y-6">
                            {calculatorNode}
                            {summaryNode}
                        </div>
                    </FunnelStep>
                </div>
            )}
        </div>
    );
}
