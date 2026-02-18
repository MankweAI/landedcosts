"use client";

import { Methodology } from "@/components/money-page/Methodology";
import { AppShell } from "@/components/shell/AppShell";

export default function MethodologyPage() {
    return (
        <AppShell title="Calculation Methodology">
            <div className="mx-auto max-w-3xl py-12">
                <Methodology />

                <div className="mt-8 text-sm text-slate-500 text-center">
                    This methodology applies to all HS Codes and routes on ImportOS.
                </div>
            </div>
        </AppShell>
    );
}
