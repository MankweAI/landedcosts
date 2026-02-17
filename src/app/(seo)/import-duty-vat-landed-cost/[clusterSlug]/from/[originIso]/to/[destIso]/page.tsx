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
  const module = model.hs6 ? getProductModule(model.hs6) : undefined;

  let description = "SSR decision-grade import report with duty, VAT, risks, docs, and presets.";
  if (module) {
    const fieldNames = module.fields.map(f => f.label).join(", ");
    description = `Calculate landed cost for ${module.name} including ${fieldNames} adjustments, duty, and VAT.`;
  }

  return buildSeoMetadata({
    title: `Import duty & landed cost for ${clusterSlug} from ${originIso} to South Africa`,
    description,
    canonicalPath: model.canonicalSlug,
    indexStatus: model.indexStatus
  });
}

import { ProductSchema } from "@/components/seo/ProductSchema";
import { getProductModule } from "@/lib/products/registry";

// ... (existing imports)

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

  const module = model.hs6 ? getProductModule(model.hs6) : undefined;

  return (
    <SeoPageShell title="Money Page">
      {module && (
        <ProductSchema module={module} origin={model.origin} dest={model.dest} />
      )}
      <MoneyPageClient model={model} />
      <div className="mt-4">
        <SeoFaqBlock />
      </div>
    </SeoPageShell>
  );
}

