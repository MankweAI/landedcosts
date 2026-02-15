"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { CalcOutput, ScenarioPreset } from "@/lib/calc/types";
import { formatCurrencyZar, formatDate, titleFromSlug } from "@/lib/format";
import type { MoneyPageViewModel } from "@/lib/types";
import { trackEvent } from "@/lib/events/track";
import { BreakdownTable } from "@/components/money-page/BreakdownTable";
import { BusinessDashboard } from "@/components/money-page/BusinessDashboard";
import { CalcCard, type CalcFormState } from "@/components/money-page/CalcCard";
import { ConfidenceBadge } from "@/components/money-page/ConfidenceBadge";
import { DocChecklist } from "@/components/money-page/DocChecklist";
import { InternalLinkGrid } from "@/components/money-page/InternalLinkGrid";
import { PreferencePill } from "@/components/money-page/PreferencePill";
import { PremiumCtaCard } from "@/components/money-page/PremiumCtaCard";
import { ReferencesAccordion } from "@/components/money-page/ReferencesAccordion";
import { RiskBanner } from "@/components/money-page/RiskBanner";
import { ScenarioPresetCard } from "@/components/money-page/ScenarioPresetCard";
import { ScenarioPresets } from "@/components/money-page/ScenarioPresets";
import { SectionReveal } from "@/components/money-page/SectionReveal";
import { SensitivityCard } from "@/components/money-page/SensitivityCard";
import { StickyActionBar } from "@/components/money-page/StickyActionBar";
import { VerdictCard } from "@/components/money-page/VerdictCard";

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

        <CalcCard value={form} onChange={setForm} onSubmit={recalculate} />

        <BusinessDashboard
          output={output}
          form={form}
          onChange={setForm}
          activePreset={activePreset}
        />

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

          <SensitivityCard output={output} />
          <ScenarioPresetCard presets={model.presets} />
          <PremiumCtaCard onClick={() => handlePremiumAction("save")} />
        </aside>
      </div>

      <StickyActionBar onAction={handlePremiumAction} />

      {modalState === "signup" ? (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/30 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-4">
            <h2 className="text-lg font-semibold text-slate-900">Sign in to continue</h2>
            <p className="mt-2 text-sm text-slate-700">
              Save, Export and Watchlist are premium workflow actions. Core calculation remains free.
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setModalState(null)}
                className="rounded-md border border-slate-300 px-3 py-2 text-sm"
              >
                Not now
              </button>
              <button type="button" className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white">
                Sign up
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
