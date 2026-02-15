import type { CalcOutput, ScenarioPreset } from "@/lib/calc/types";
import type { DocRequirement, RiskRule } from "@/lib/data/types";
import type { InternalLink } from "@/lib/seo/internalLinks";

export type MoneyPageViewModel = {
  slug: string;
  canonicalSlug: string;
  indexStatus: "INDEX" | "NOINDEX";
  template: "product" | "hs";
  headingLabel: string;
  subtitle: string;
  origin: string;
  dest: string;
  clusterSlug?: string;
  hs6?: string;
  docs: DocRequirement[];
  risks: RiskRule[];
  internalLinks: InternalLink[];
  presets: ScenarioPreset[];
  initialOutput: CalcOutput | null;
  readinessScore: number;
  blockers: string[];
  tariffVersionLabel: string;
  tariffEffectiveDate: string;
  sourcePointerShort: string;
  lastUpdated: string;
};
