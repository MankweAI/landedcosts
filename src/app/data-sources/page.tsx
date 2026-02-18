"use client";

import { AppShell } from "@/components/shell/AppShell";

export default function DataSourcesPage() {
    return (
        <AppShell title="Data Sources">
            <div className="mx-auto max-w-3xl py-12 prose prose-slate">
                <h2>Verified Data</h2>
                <p>
                    Our intelligence is powered by official government publications:
                </p>
                <ul>
                    <li><strong>SARS Tariff Book</strong> (Schedule 1, Part 1)</li>
                    <li><strong>ITAC Permit Guidelines</strong></li>
                    <li><strong>NRCS Levies and Fees</strong></li>
                    <li><strong>Transnet Port Authority</strong> Tariff Book</li>
                </ul>
            </div>
        </AppShell>
    );
}
