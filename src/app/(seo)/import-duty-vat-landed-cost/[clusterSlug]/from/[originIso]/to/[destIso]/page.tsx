import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MoneyPageClient } from "@/components/money-page/MoneyPageClient";
import { SeoFaqBlock } from "@/app/(seo)/_components/SeoFaqBlock";
import { SeoPageShell } from "@/app/(seo)/_components/SeoPageShell";
import { buildSeoMetadata } from "@/lib/seo/meta";
import { buildProductPath } from "@/lib/seo/paths";
import { validateDestinationSlug } from "@/lib/seo/slug";
import { getMoneyPageViewModel } from "@/lib/viewModel";

type ProductMoneyPageProps = {
  params: Promise<{
    clusterSlug: string;
    originIso: string;
    destIso: string;
  }>;
};

export async function generateMetadata({ params }: ProductMoneyPageProps): Promise<Metadata> {
  const { clusterSlug, originIso, destIso } = await params;
  const pathname = buildProductPath(clusterSlug, originIso, destIso);
  const model = getMoneyPageViewModel(pathname);
  if (!model) {
    return {
      title: "Not found",
      robots: "noindex,follow"
    };
  }
  return buildSeoMetadata({
    title: `Import duty & landed cost for ${clusterSlug} from ${originIso} to South Africa`,
    description: "SSR decision-grade import report with duty, VAT, risks, docs, and presets.",
    canonicalPath: model.canonicalSlug,
    indexStatus: model.indexStatus
  });
}

export default async function ProductMoneyPage({ params }: ProductMoneyPageProps) {
  const { clusterSlug, originIso, destIso } = await params;
  if (!validateDestinationSlug(destIso)) {
    notFound();
  }
  const pathname = buildProductPath(clusterSlug, originIso, destIso);
  const model = getMoneyPageViewModel(pathname);
  if (!model) {
    notFound();
  }
  return (
    <SeoPageShell title="Money Page">
      <MoneyPageClient model={model} />
      <div className="mt-4">
        <SeoFaqBlock />
      </div>
    </SeoPageShell>
  );
}

