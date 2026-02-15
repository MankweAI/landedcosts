export type Country = {
  id: string;
  slug: string;
  name: string;
};

export type ProductCluster = {
  id: string;
  slug: string;
  name: string;
  category?: string;
  canonicalClusterId?: string;
};

export type HsCode = {
  hs6: string;
  descriptionShort: string;
  chapter?: string;
  heading?: string;
};

export type ClusterHsMap = {
  clusterId: string;
  hs6: string;
  confidence: number;
  notes?: string;
};

export type TariffVersion = {
  id: string;
  label: string;
  effectiveDate: string;
  sourcePointerShort: string;
};

export type TariffRate = {
  tariffVersionId: string;
  hs6: string;
  originSlug: string;
  destSlug: string;
  dutyRate: number;
  vatRate: number;
  levies?: Record<string, number>;
};

export type DocRequirementGroup = "Always required" | "Commonly required" | "If applicable";

export type DocRequirement = {
  id: string;
  clusterId?: string;
  hs6?: string;
  originSlug: string;
  destSlug: string;
  group: DocRequirementGroup;
  title: string;
  whyShort: string;
};

export type RiskLevel = "low" | "medium" | "high";

export type RiskRule = {
  id: string;
  clusterId?: string;
  hs6?: string;
  originSlug: string;
  destSlug: string;
  riskLevel: RiskLevel;
  textShort: string;
};

export type PageType = "product" | "hs" | "hub" | "tool";
export type IndexStatus = "INDEX" | "NOINDEX";

export type PageRecord = {
  slug: string;
  type: PageType;
  origin: string;
  dest: string;
  indexStatus: IndexStatus;
  canonicalSlug: string;
  duplicateOfSlug?: string;
  readinessScore: number;
  hasComputedExampleOutputs: boolean;
  blockers: string[];
  lastBuiltAt: string;
  lastIndexStatusChangeAt: string;
};

