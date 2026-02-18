"use client";

import { AppShell } from "@/components/shell/AppShell";

export default function PrivacyPage() {
    return (
        <AppShell title="Privacy Policy">
            <div className="mx-auto max-w-3xl py-12 prose prose-slate">
                <h2>Data Privacy</h2>
                <p>
                    We respect your privacy. ImportOS does not sell your data.
                    Calculation inputs are processed locally or ephemerally.
                </p>
            </div>
        </AppShell>
    );
}
