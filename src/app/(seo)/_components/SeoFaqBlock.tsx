export function SeoFaqBlock({ customFaqs }: { customFaqs?: { question: string; answer: string }[] }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4">
      <h2 className="text-lg font-semibold text-slate-900">FAQ</h2>
      <div className="mt-2 space-y-2 text-sm text-slate-700">
        {customFaqs?.map((faq, i) => (
          <details key={i} open={i === 0}>
            <summary className="cursor-pointer font-medium">{faq.question}</summary>
            <p className="mt-1">{faq.answer}</p>
          </details>
        ))}
        <details>
          <summary className="cursor-pointer font-medium">Can I use this without login?</summary>
          <p className="mt-1">Yes. Core calculations and decision outputs are available without login.</p>
        </details>
        <details>
          <summary className="cursor-pointer font-medium">Why are some pages noindex?</summary>
          <p className="mt-1">Pages remain NOINDEX if data quality or readiness gates are not met.</p>
        </details>
      </div>
    </section>
  );
}

