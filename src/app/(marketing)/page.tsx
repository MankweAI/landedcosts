import Link from "next/link";
import { Metadata } from "next";
import { Calculator, Search, Globe, ShieldCheck, ArrowRight, TrendingUp } from "lucide-react";

export const metadata: Metadata = {
  robots: "noindex, follow"
};

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white selection:bg-blue-500 selection:text-white">
      {/* Background Gradients */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 -mr-40 -mt-40 h-[600px] w-[600px] rounded-full bg-blue-600/10 blur-[100px]" />
        <div className="absolute bottom-0 left-0 -ml-40 -mb-40 h-[600px] w-[600px] rounded-full bg-indigo-600/10 blur-[100px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-6 pt-20 pb-16 lg:pt-32">
        {/* Hero Section */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-400 backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500"></span>
            </span>
            Live Customs Data 2024
          </div>

          <h1 className="mt-8 text-5xl font-extrabold tracking-tight text-white lg:text-7xl">
            Stop Guessing. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
              Start Importing.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400 leading-relaxed">
            Decision-grade landed cost simulations for South African importers.
            Calibrated against the official SARS Tariff Book and live forex markets.
          </p>
        </div>

        {/* The Control Grid */}
        <div className="mt-16 grid gap-6 md:grid-cols-3">

          {/* Card 1: Calculator */}
          <Link
            href="/calculator"
            className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50 p-8 transition-all hover:border-blue-500/50 hover:bg-slate-900 duration-300"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Calculator size={120} />
            </div>
            <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/20 text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors">
              <Calculator size={24} />
            </div>
            <h3 className="mt-6 text-xl font-bold text-white">Universal Calculator</h3>
            <p className="mt-2 text-sm text-slate-400 group-hover:text-slate-300">
              Run a custom simulation for any product, value, or origin country.
            </p>
            <div className="mt-6 flex items-center gap-2 text-sm font-medium text-blue-400 group-hover:text-blue-300">
              Launch Tool <ArrowRight size={16} />
            </div>
          </Link>

          {/* Card 2: HS Finder */}
          <Link
            href="/hs-classifier"
            className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50 p-8 transition-all hover:border-indigo-500/50 hover:bg-slate-900 duration-300"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Search size={120} />
            </div>
            <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
              <Search size={24} />
            </div>
            <h3 className="mt-6 text-xl font-bold text-white">HS Code Finder</h3>
            <p className="mt-2 text-sm text-slate-400 group-hover:text-slate-300">
              Search 50,000+ codes by keyword. AI-assisted classification.
            </p>
            <div className="mt-6 flex items-center gap-2 text-sm font-medium text-indigo-400 group-hover:text-indigo-300">
              Search Codes <ArrowRight size={16} />
            </div>
          </Link>

          {/* Card 3: Directory */}
          <Link
            href="/import-duty-vat-landed-cost"
            className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50 p-8 transition-all hover:border-emerald-500/50 hover:bg-slate-900 duration-300"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Globe size={120} />
            </div>
            <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
              <Globe size={24} />
            </div>
            <h3 className="mt-6 text-xl font-bold text-white">Route Directory</h3>
            <p className="mt-2 text-sm text-slate-400 group-hover:text-slate-300">
              Browse pre-calculated "Money Pages" for popular import routes.
            </p>
            <div className="mt-6 flex items-center gap-2 text-sm font-medium text-emerald-400 group-hover:text-emerald-300">
              Browse Index <ArrowRight size={16} />
            </div>
          </Link>
        </div>

        {/* Trust & Footer */}
        <div className="mt-20 border-t border-slate-800 pt-10 text-center">
          <p className="text-sm font-medium text-slate-500 uppercase tracking-widest">Powered by</p>
          <div className="mt-6 flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale transition-all hover:opacity-100 hover:grayscale-0">
            <div className="flex items-center gap-2 text-white font-semibold text-lg">
              <ShieldCheck className="text-blue-500" /> SARS Tariff Book
            </div>
            <div className="flex items-center gap-2 text-white font-semibold text-lg">
              <TrendingUp className="text-emerald-500" /> Live Forex
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
