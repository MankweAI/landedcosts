type PremiumCtaCardProps = {
  onClick: () => void;
};

export function PremiumCtaCard({ onClick }: PremiumCtaCardProps) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-blue-900">Save this import quote</h2>
      <ul className="mt-2 list-disc pl-5 text-sm text-blue-900">
        <li>Save scenarios</li>
        <li>Download PDF</li>
        <li>Watch FX and tariff changes</li>
      </ul>
      <button
        type="button"
        onClick={onClick}
        className="mt-3 w-full rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700"
      >
        Sign up (free)
      </button>
    </section>
  );
}

