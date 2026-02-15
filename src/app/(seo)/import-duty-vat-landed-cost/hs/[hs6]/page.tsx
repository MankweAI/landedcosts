import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBuiltPages } from "@/lib/seo/pageRegistry";
import { validateHs6 } from "@/lib/seo/slug";

type HsHubPageProps = {
  params: Promise<{ hs6: string }>;
};

export async function generateMetadata({ params }: HsHubPageProps): Promise<Metadata> {
  const { hs6 } = await params;
  return {
    title: `HS ${hs6} import routes`,
    description: `Hub for HS ${hs6} money pages and route variants.`,
    robots: "index,follow"
  };
}

export default async function HsHubPage({ params }: HsHubPageProps) {
  const { hs6 } = await params;
  if (!validateHs6(hs6)) {
    notFound();
  }
  const pages = getBuiltPages().filter((page) => page.type === "hs" && page.hs6 === hs6);
  if (pages.length === 0) {
    notFound();
  }
  return (
    <main className="mx-auto max-w-4xl p-6">
      <h1 className="text-2xl font-bold">HS {hs6} Routes</h1>
      <p className="mt-2 text-slate-700">Route-level money pages by origin.</p>
      <ul className="mt-3 space-y-2">
        {pages.map((page) => (
          <li key={page.slug} className="rounded-lg border border-slate-200 p-2">
            <Link href={page.slug} className="text-blue-700 underline">
              {page.slug}
            </Link>
            <p className="text-xs text-slate-600">
              {page.indexStatus} | readiness {page.readinessScore}
            </p>
          </li>
        ))}
      </ul>
    </main>
  );
}

