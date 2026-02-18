"use client";

import { CheckCircle2, Circle, Lock } from "lucide-react";

type FunnelStepProps = {
    stepNumber: number;
    currentStep: number;
    title: string;
    description: string;
    isCompleted: boolean;
    isLocked: boolean;
    children: React.ReactNode;
    action?: React.ReactNode;
};

export function FunnelStep({
    stepNumber,
    currentStep,
    title,
    description,
    isCompleted,
    isLocked,
    children,
    action,
}: FunnelStepProps) {
    const isActive = currentStep === stepNumber;

    // If locked and not active, show compact locked state
    if (isLocked && !isActive && !isCompleted) {
        return (
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 opacity-60 grayscale select-none flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 text-slate-400 font-bold shrink-0">
                    {stepNumber}
                </div>
                <div>
                    <h3 className="font-semibold text-slate-500">{title}</h3>
                    <p className="text-sm text-slate-400">Complete previous step to unlock.</p>
                </div>
                <Lock className="ml-auto text-slate-300" size={20} />
            </div>
        );
    }

    // If completed and not active, show compact completed state (or full? let's do full for review, or compact?)
    // User wants "Progressive steps". Usually previous steps remain visible but minimized or marked done.
    // I'll keep them fully visible but with a "Done" badge, to allow review.

    return (
        <div className={`rounded-2xl border transition-all duration-500 ${isActive ? 'border-blue-200 bg-white ring-4 ring-blue-50/50 shadow-xl' : isCompleted ? 'border-emerald-100 bg-slate-50/50' : 'border-slate-200 bg-white'}`}>
            <div className={`p-6 border-b ${isActive ? 'border-blue-100' : 'border-slate-100'}`}>
                <div className="flex items-center gap-4">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-full font-bold text-lg transition-colors ${isCompleted ? 'bg-emerald-100 text-emerald-600' :
                        isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' :
                            'bg-slate-100 text-slate-500'
                        }`}>
                        {isCompleted ? <CheckCircle2 size={24} /> : stepNumber}
                    </div>
                    <div className="flex-1">
                        <h2 className={`text-xl md:text-2xl font-bold ${isActive ? 'text-slate-900' : 'text-slate-700'}`}>
                            {title}
                        </h2>
                        <p className="text-sm text-slate-500 leading-relaxed">
                            {description}
                        </p>
                    </div>
                </div>
            </div>

            <div className="p-6">
                {children}
            </div>

            {isActive && action && (
                <div className="p-4 bg-slate-50 border-t border-slate-100 rounded-b-2xl flex justify-end">
                    {action}
                </div>
            )}
        </div>
    );
}
