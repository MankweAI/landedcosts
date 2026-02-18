"use client";

import { AppShell } from "@/components/shell/AppShell";

export default function TermsPage() {
    return (
        <AppShell title="Terms of Use">
            <div className="mx-auto max-w-3xl py-12 prose prose-slate">
                <h2>Terms</h2>
                <p>
                    By using ImportOS, you agree to these terms.
                    The service is provided "as is" without warranty of any kind.
                </p>
            </div>
        </AppShell>
    );
}
