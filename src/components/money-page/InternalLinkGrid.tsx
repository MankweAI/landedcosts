import Link from "next/link";
import type { InternalLink } from "@/lib/seo/internalLinks";

export function InternalLinkGrid({ links }: { links: InternalLink[] }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-bold text-slate-900">Related Tools and Routes</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {links.map((link) => (
          <Link key={link.href} href={link.href} className="group rounded-lg border border-slate-200 p-3 hover:border-blue-300 hover:bg-blue-50 transition-all">
            <p className="text-sm font-semibold text-blue-700 group-hover:text-blue-900">{link.title}</p>
            <p className="mt-1 text-xs text-slate-500 group-hover:text-slate-700">{link.why}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

