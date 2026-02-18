"use client";

import { AppShell } from "@/components/shell/AppShell";

export default function DisclaimerPage() {
    return (
        <AppShell title="Disclaimer">
            <div className="mx-auto max-w-3xl py-12 prose prose-slate">
                <h2>Legal Notice</h2>
                <p>
                    The calculations and information provided on this website are for estimation purposes only.
                    While we strive for accuracy, actual duties and taxes are determined by SARS Customs at the time of clearance.
                </p>
                <p>
                    ImportOS serves as a decision support tool, not a customs broker or legal advisor.
                    Use these figures for planning, but consult with a licensed clearing agent for final shipments.
                </p>
            </div>
        </AppShell>
    );
}
