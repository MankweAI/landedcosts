"use client";

import { X, ShieldCheck, FileText, Calendar, ExternalLink } from "lucide-react";
import { useEffect, useRef } from "react";
import Link from "next/link";

type DataFreshnessModalProps = {
    isOpen: boolean;
    onClose: () => void;
    tariffVersionLabel: string;
    effectiveDate: string;
    sourcePointerShort: string;
};

export function DataFreshnessModal({
    isOpen,
    onClose,
    tariffVersionLabel,
    effectiveDate,
    sourcePointerShort
}: DataFreshnessModalProps) {
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        if (isOpen) {
            document.addEventListener("keydown", handleEscape);
            document.body.style.overflow = "hidden";
        }
        return () => {
            document.removeEventListener("keydown", handleEscape);
            document.body.style.overflow = "unset";
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div
                ref={modalRef}
                className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl animate-in zoom-in-95 duration-200"
            >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 p-4">
                    <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                            <ShieldCheck className="h-4 w-4" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900">Verified Data</h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                        aria-label="Close modal"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-4">
                        <div className="flex gap-3">
                            <Calendar className="h-5 w-5 text-emerald-600 shrink-0" />
                            <div>
                                <h4 className="font-medium text-emerald-900">Current & Effective</h4>
                                <p className="mt-1 text-sm text-emerald-700">
                                    Rates are synchronized with the <strong>{tariffVersionLabel}</strong> tariff book, effective from <strong>{effectiveDate}</strong>.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-sm font-medium text-slate-900 uppercase tracking-wider">Source Reference</h4>
                        <div className="flex items-start gap-3">
                            <FileText className="h-5 w-5 text-slate-400 shrink-0" />
                            <div>
                                <p className="text-sm text-slate-700 font-medium">{sourcePointerShort}</p>
                                <p className="text-xs text-slate-500 mt-1">
                                    South African Revenue Service (SARS) / International Trade Administration Commission (ITAC).
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-50 rounded-lg p-4 text-xs text-slate-500">
                        <p>
                            <strong>Methodology:</strong> We manually verify HS code classifications and duty rates against the weekly Government Gazette amendments to ensure decision-grade accuracy.
                        </p>
                    </div>
                </div>

                {/* Footer (Close Tab) */}
                <div className="flex items-center justify-end gap-3 border-t border-slate-100 bg-slate-50 p-4">
                    <Link href="/data-sources" className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1 mr-auto">
                        View all sources <ExternalLink className="h-3 w-3" />
                    </Link>
                    <button
                        onClick={onClose}
                        className="rounded-lg bg-white border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-200 transition-all"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
