"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Star } from "lucide-react";
import type { CalcOutput, ScenarioPreset } from "@/lib/calc/types";
import { formatCurrencyZar, formatDate, titleFromSlug } from "@/lib/format";
import type { MoneyPageViewModel } from "@/lib/types";
import { trackEvent } from "@/lib/events/track";
import { BreakdownTable } from "@/components/money-page/BreakdownTable";
import { BusinessDashboard } from "@/components/money-page/BusinessDashboard";
import { SteppedCalc, type CalcFormState } from "@/components/money-page/SteppedCalc";
import { ConfidenceBadge } from "@/components/money-page/ConfidenceBadge";
import { DocChecklist } from "@/components/money-page/DocChecklist";
import { InternalLinkGrid } from "@/components/money-page/InternalLinkGrid";
import { PreferencePill } from "@/components/money-page/PreferencePill";
import { PremiumCtaCard } from "@/components/money-page/PremiumCtaCard";
import { ReferencesAccordion } from "@/components/money-page/ReferencesAccordion";
import { RiskBanner } from "@/components/money-page/RiskBanner";
import { ScenarioPresets } from "@/components/money-page/ScenarioPresets";
import { SectionReveal } from "@/components/money-page/SectionReveal";
import { StickyActionBar } from "@/components/money-page/StickyActionBar";
import { VerdictCard } from "@/components/money-page/VerdictCard";
import { SensitivityGrid } from "@/components/money-page/SensitivityGrid";
import { WaitlistModal } from "@/components/shell/WaitlistModal";
import { LegalityDecisionCard } from "@/components/money-page/LegalityDecisionCard";
import { PermitFlagGrid } from "@/components/money-page/PermitFlagGrid";
import { CertificationMatrix } from "@/components/money-page/CertificationMatrix";
import { ChecklistBuilder } from "@/components/money-page/ChecklistBuilder";
import { ProcessTimeline } from "@/components/money-page/ProcessTimeline";
import { CompliancePackPreview } from "@/components/money-page/CompliancePackPreview";
import { CompliancePackPrintView } from "@/components/money-page/CompliancePackPrintView";

type MoneyPageClientProps = {
  model: MoneyPageViewModel;
};

function initialForm(model: MoneyPageViewModel): CalcFormState {
  const mediumPreset = model.presets.find((preset) => preset.id === "R50k") ?? model.presets[0];
  return {
    hs6: model.hs6 ?? "854140",
    origin: model.origin,
    incoterm: "FOB",
    invoiceValueZar: mediumPreset?.invoiceValueZar ?? 50_000,
    freightZar: 6_000,
    insuranceZar: 900,
    otherFeesZar: 1_200,
    quantity: 100,
    importerIsVatVendor: true,
    sellingPricePerUnitZar: 900,
    fxRate: 18.2,
    hsConfidence: 0.9,
    portOfEntry: "DBN",
    shippingMode: "LCL",
    useAgencyEstimate: true,
    risk_demurrageDays: 0,
    risk_forexBuffer: 0
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
    verdict: "Missing tariff data: page remains noindex until data is available.",
    confidenceLabel: "low",
    warnings: ["No rate available for this route yet."],
    breakdown: [],
    tariffVersionLabel: "",
    effectiveDate: "",
    sourcePointerShort: ""
  };
}

export function MoneyPageClient({ model }: MoneyPageClientProps) {
  const initialOutput = model.initialOutput ?? model.presets[0]?.output ?? emptyOutput();
  const [form, setForm] = useState<CalcFormState>(() => initialForm(model));
  const [output, setOutput] = useState<CalcOutput>(initialOutput);
  const [activePreset, setActivePreset] = useState<string>("R50k");
  const [modalState, setModalState] = useState<null | "signup">();

  useEffect(() => {
    trackEvent("page_view", {
      pageTemplate: model.template,
      origin: model.origin,
      productCluster: model.clusterSlug
    });
  }, [model.clusterSlug, model.origin, model.template]);

  const headingLabel = useMemo(() => {
    if (model.template === "hs") {
      return `HS ${model.hs6}`;
    }
    return titleFromSlug(model.clusterSlug ?? model.headingLabel);
  }, [model.clusterSlug, model.headingLabel, model.hs6, model.template]);

  async function recalculate() {
    trackEvent("calc_started", {
      pageTemplate: model.template,
      origin: model.origin,
      productCluster: model.clusterSlug
    });
    const response = await fetch("/api/calc", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        dest: model.dest
      })
    });
    if (!response.ok) {
      return;
    }
    const data = (await response.json()) as { output: CalcOutput | null };
    if (data.output) {
      setOutput(data.output);
      trackEvent("calc_completed", {
        pageTemplate: model.template,
        origin: model.origin,
        productCluster: model.clusterSlug
      });
    }
  }

  function applyPreset(preset: ScenarioPreset) {
    setForm((current) => ({
      ...current,
      invoiceValueZar: preset.invoiceValueZar
    }));
    setOutput(preset.output);
    setActivePreset(preset.id);
  }

  function handlePremiumAction(action: "save" | "export" | "compare" | "watchlist") {
    trackEvent("paywall_viewed", {
      pageTemplate: model.template,
      origin: model.origin,
      productCluster: model.clusterSlug,
      action
    });
    setModalState("signup");
  }

  const complianceResult = model.complianceResult;
  const isProhibited = complianceResult?.legality.status === "prohibited";

  const allRequirements = complianceResult
    ? [
      ...complianceResult.compliance.permitsRequired,
      ...complianceResult.compliance.certificationsRequired,
      ...complianceResult.compliance.inspectionsRequired,
      ...complianceResult.compliance.labelingRequired,
    ]
    : [];

  function handleDownloadPack() {
    trackEvent("compliance_pack_download", {
      pageTemplate: model.template,
      origin: model.origin,
      productCluster: model.clusterSlug,
    });
    window.print();
  }

  return (
    <>
      <div className="mb-8 space-y-4">
        <nav className="flex items-center gap-2 text-sm text-slate-500">
          <Link href="/" className="hover:text-blue-600 hover:underline">
            Home
          </Link>
          <span className="text-slate-300">/</span>
          <Link href="/import-duty-vat-landed-cost" className="hover:text-blue-600 hover:underline">
            Import Duty Directory
          </Link>
          <span className="text-slate-300">/</span>
          <span className="font-medium text-slate-700">{headingLabel}</span>
        </nav>

        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 lg:text-4xl">
            Import duty & landed cost for {headingLabel} from {titleFromSlug(model.origin)} to South Africa
          </h1>
          <p className="text-lg text-slate-600 max-w-3xl leading-relaxed">{model.subtitle}</p>
        </div>

        {/* ── Section 1: LEGALITY (Decision-First) ── */}
        {complianceResult && (
          <LegalityDecisionCard legality={complianceResult.legality} />
        )}

        {/* ── Section 2: PERMITS & COMPLIANCE ── */}
        {complianceResult && (
          <SectionReveal title="Permits & Compliance" subtitle="Required permits, registrations, and inspections for this route." defaultOpen={true} variant="blue">
            <PermitFlagGrid
              permits={[
                ...complianceResult.compliance.permitsRequired,
                ...complianceResult.compliance.inspectionsRequired,
              ]}
              title="Permits & Registrations"
              subtitle="Regulatory approvals needed before importing."
            />
          </SectionReveal>
        )}

        {/* ── Section 3: STANDARDS & CERTIFICATIONS ── */}
        {complianceResult && (
          <SectionReveal title="Standards & Certifications" subtitle="Technical standards, testing, and labeling requirements." defaultOpen={true} variant="emerald">
            <CertificationMatrix
              certifications={complianceResult.compliance.certificationsRequired}
              labeling={complianceResult.compliance.labelingRequired}
            />
          </SectionReveal>
        )}

        {/* ── Section 4: COSTS (existing engine) ── */}
        {!isProhibited && (
          <>
            <SteppedCalc value={form} onChange={setForm} onSubmit={recalculate} />

            <BusinessDashboard
              output={output}
              form={form}
              onChange={setForm}
              activePreset={activePreset}
            />

            <SensitivityGrid form={form} baseOutput={output} />
          </>
        )}

        {isProhibited && (
          <section className="rounded-xl border-2 border-rose-300 bg-rose-50 p-6 text-center">
            <p className="text-lg font-bold text-rose-800">Cost calculation unavailable</p>
            <p className="text-sm text-rose-600 mt-1">This product is prohibited for import on this route. Cost calculations are hidden.</p>
          </section>
        )}

      </div>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 space-y-4 lg:col-span-8">
          <SectionReveal title="Line-item Costs" subtitle="Detailed breakdown of duties, taxes, and fees." defaultOpen={true} variant="blue">
            {output.breakdown.length > 0 ? (
              <BreakdownTable output={output} />
            ) : (
              <section className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-900">
                Missing route-specific tariff data. This page is kept <strong>NOINDEX</strong> and shows a data-gap state.
              </section>
            )}
          </SectionReveal>



          <SectionReveal title="Required Documents" subtitle="Checklist of commercial and regulatory documents." variant="emerald">
            <DocChecklist docs={model.docs} />
          </SectionReveal>

          <SectionReveal title="Risks & Alerts" subtitle="Compliance warnings, trade agreements, and restrictions." variant="amber">
            <div className="space-y-4">
              <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="text-lg font-bold text-slate-900">Preference Eligibility</h2>
                <p className="mb-4 text-sm text-slate-600">Traffic-light status for preference/rebate checks.</p>
                <PreferencePill status="unknown" />
              </section>
              <RiskBanner risks={model.risks} />
            </div>
          </SectionReveal>

          <SectionReveal title="Related Tools" subtitle="Comparison tools, HS code directory, and import guides." variant="violet">
            <div className="space-y-4">
              <InternalLinkGrid links={model.internalLinks} />
              <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="text-lg font-bold text-slate-900">Next Best Actions</h2>
                <div className="mt-3 flex flex-wrap gap-3">
                  <Link href="/compare" className="inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-medium text-blue-800 transition-colors hover:bg-blue-100">
                    Compare with other origins
                  </Link>
                  <Link
                    href="/import-duty-vat-landed-cost"
                    className="inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-medium text-blue-800 transition-colors hover:bg-blue-100"
                  >
                    View HS code directory
                  </Link>
                  <Link href="/how-it-works" className="inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-medium text-blue-800 transition-colors hover:bg-blue-100">
                    See import checklist
                  </Link>
                </div>
              </section>
            </div>
          </SectionReveal>

          <SectionReveal title="Data References" subtitle={`Tariff info sourced from ${model.tariffVersionLabel}.`} variant="slate">
            <ReferencesAccordion
              tariffVersionLabel={model.tariffVersionLabel}
              tariffEffectiveDate={model.tariffEffectiveDate}
              sourcePointerShort={model.sourcePointerShort}
            />
          </SectionReveal>

          <SectionReveal title="Scenario Presets" subtitle="Quickly compare different invoice values (R10k, R50k, R250k)." variant="indigo">
            <ScenarioPresets presets={model.presets} onApply={applyPreset} />
            <VerdictCard output={output} />
          </SectionReveal>
        </div>

        <aside className="col-span-12 space-y-4 lg:col-span-4 lg:sticky lg:top-24 lg:self-start">
          {complianceResult && allRequirements.length > 0 && (
            <ChecklistBuilder requirements={allRequirements} />
          )}
          {complianceResult && (
            <CompliancePackPreview
              onDownload={handleDownloadPack}
              hasComplianceData={complianceResult.legality.status !== "unknown"}
            />
          )}
          <PremiumCtaCard onClick={() => handlePremiumAction("save")} />
        </aside>
      </div>

      <StickyActionBar onAction={handlePremiumAction} />

      <WaitlistModal isOpen={modalState === "signup"} onClose={() => setModalState(null)} />

      {/* Hidden print-only compliance pack */}
      {complianceResult && (
        <CompliancePackPrintView
          complianceResult={complianceResult}
          output={output}
          headingLabel={headingLabel}
          origin={titleFromSlug(model.origin)}
          dest="South Africa"
          generatedDate={new Date().toLocaleDateString("en-ZA")}
        />
      )}
    </>
  );
}
