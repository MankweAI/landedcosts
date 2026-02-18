import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MoneyPageClient } from "@/components/money-page/MoneyPageClient";
import { SeoFaqBlock } from "@/app/(seo)/_components/SeoFaqBlock";
import { SeoPageShell } from "@/app/(seo)/_components/SeoPageShell";
import { buildSeoMetadata } from "@/lib/seo/meta";
import { buildHsPath } from "@/lib/seo/paths";
import { validateDestinationSlug, validateHs6 } from "@/lib/seo/slug";
import { getMoneyPageViewModel } from "@/lib/viewModel";

type HsMoneyPageProps = {
  params: Promise<{
    hs6: string;
    originIso: string;
    destIso: string;
  }>;
};

export async function generateMetadata({ params }: HsMoneyPageProps): Promise<Metadata> {
  const { hs6, originIso, destIso } = await params;
  const pathname = buildHsPath(hs6, originIso, destIso);
  const model = getMoneyPageViewModel(pathname);
  if (!model) {
    return {
      title: "Not found",
      robots: "noindex,follow"
    };
  }
  return buildSeoMetadata({
    title: `Import duty & landed cost for HS ${hs6} from ${originIso} to South Africa`,
    description: "HS-specific SSR landed cost report with scenarios and explainability drawers.",
    canonicalPath: model.canonicalSlug,
    indexStatus: model.indexStatus
  });
}

export default async function HsMoneyPage({ params }: HsMoneyPageProps) {
  const { hs6, originIso, destIso } = await params;
  if (!validateDestinationSlug(destIso) || !validateHs6(hs6)) {
    notFound();
  }
  const pathname = buildHsPath(hs6, originIso, destIso);
  const model = getMoneyPageViewModel(pathname);
  if (!model) {
    notFound();
  }
  return (
    <SeoPageShell title="HS Money Page">
      <MoneyPageClient model={model} />
      <div className="mt-4">
        <SeoFaqBlock />
      </div>
    </SeoPageShell>
  );
}

