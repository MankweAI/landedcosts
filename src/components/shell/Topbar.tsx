import { Menu, ShieldCheck } from "lucide-react";
import { UpgradeCTA } from "@/components/shell/UpgradeCTA";
import { Logo } from "@/components/brand/Logo";

type TopbarProps = {
  title?: string;
  onToggleSidebar?: () => void;
};

export function Topbar({ title = "LandedCost Intelligence", onToggleSidebar }: TopbarProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 px-4 py-3 backdrop-blur-md transition-all">
      <div className="mx-auto flex w-full max-w-[1400px] items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onToggleSidebar}
            className="rounded-md p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-700 lg:hidden transition-colors"
            aria-label="Toggle menu"
          >
            <Menu className="h-6 w-6" />
          </button>

          <div className="flex flex-col">
            <div className="flex flex-wrap items-baseline gap-x-2">
              <Logo variant="dark" className="h-6" textClassName="text-sm sm:text-base" iconClassName="h-5 w-5" />
              <span className="rounded-full bg-blue-100 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-700 ml-2">
                Beta
              </span>
            </div>

            <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[10px] sm:text-xs text-slate-500">
              <a
                href="https://bigdataquery.co.za"
                target="_blank"
                rel="noreferrer"
                className="font-medium text-slate-600 hover:text-blue-600 decoration-slate-300 underline-offset-2 hover:underline"
              >
                By BigDataQuery
              </a>
              <span className="hidden h-3 w-px bg-slate-300 sm:block"></span>
              <div className="flex items-center gap-1">
                <ShieldCheck className="h-3 w-3 text-emerald-500" />
                <span>Verified Data</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:block">
            <UpgradeCTA compact />
          </div>
          {/* Mobile Upgrade Button (Icon only) could go here if needed */}
        </div>
      </div>
    </header>
  );
}

