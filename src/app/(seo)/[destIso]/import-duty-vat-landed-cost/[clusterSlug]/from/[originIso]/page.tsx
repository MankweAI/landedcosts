import type { Metadata } from "next";
import Link from "next/link";
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
  const productModule = model.hs6 ? getProductModule(model.hs6) : undefined;

  let description = "SSR decision-grade import report with duty, VAT, risks, docs, and presets.";
  if (productModule) {
    const fieldNames = productModule.fields.map(f => f.label).join(", ");
    description = `Calculate landed cost for ${productModule.name} including ${fieldNames} adjustments, duty, and VAT.`;
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

  const productModule = model.hs6 ? getProductModule(model.hs6) : undefined;

  return (
    <SeoPageShell title="Money Page">
      {productModule && (
        <ProductSchema
          module={productModule}
          origin={model.origin}
          dest={model.dest}
          faqs={model.faqs}
          template={model.template}
          clusterSlug={model.clusterSlug}
          hs6={model.hs6}
        />
      )}

      {model.template === 'hs' && model.clusterSlug && (
        <div className="mb-6 rounded-xl border border-indigo-100 bg-indigo-50 p-4 text-sm text-indigo-900">
          <p>
            Looking for general information? <Link href={`/import-duty-vat-landed-cost/${model.clusterSlug}/from/${model.origin}/to/${model.dest}`} className="underline font-semibold hover:text-indigo-700">View the main guide for this product category &rarr;</Link>
          </p>
        </div>
      )}

      {model.context && (
        <div className="mb-6 rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-900">
          <p className="font-semibold">{model.context.intro}</p>
          {model.context.shippingTips && (
            <ul className="mt-2 list-disc pl-5">
              {model.context.shippingTips.map((tip, i) => (
                <li key={i}>{tip}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      <MoneyPageClient model={model} />
      <div className="mt-4">
        <SeoFaqBlock customFaqs={model.faqs} />
      </div>
    </SeoPageShell>
  );
}

