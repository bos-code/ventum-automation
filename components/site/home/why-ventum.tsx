const REASONS = [
  {
    code: "01",
    title: "Product clarity",
    body: "Models, categories and available specifications are kept visible before you enquire.",
  },
  {
    code: "02",
    title: "Direct sales access",
    body: "Move from a product page to a product-specific sales conversation without extra steps.",
  },
  {
    code: "03",
    title: "Availability confirmation",
    body: "Pricing and stock can be confirmed directly instead of relying on invented catalogue claims.",
  },
  {
    code: "04",
    title: "Physical presence",
    body: "Ventum operates from Alaba International Market, Lagos.",
  },
];

export function WhyVentum() {
  return (
    <section className="border-y border-[#d9dbe4] bg-[#f8f8f5]">
      <div className="ventum-shell py-14 sm:py-18 lg:py-20">
        <div className="grid gap-6 border-b border-[#d9dbe4] pb-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-end">
          <div>
            <p className="ventum-technical-label text-[#ed0101]">Confidence / 04</p>
            <h2 className="mt-4 max-w-xl text-3xl font-bold tracking-[-0.035em] text-[#06065c] sm:text-4xl">
              Clear information. Direct access. No unnecessary friction.
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-7 text-[#686b79] lg:justify-self-end">
            Ventum is presented as a practical supply business: find the equipment,
            inspect what is known, then speak directly with sales when confirmation is needed.
          </p>
        </div>

        <ol className="grid border-x border-[#d9dbe4] sm:grid-cols-2 lg:grid-cols-4">
          {REASONS.map((reason) => (
            <li
              key={reason.code}
              className="min-h-[230px] border-b border-r border-[#d9dbe4] p-5 last:border-r-0 sm:p-6 lg:border-b-0"
            >
              <div className="flex items-center justify-between border-b border-[#e4e5ea] pb-4">
                <span className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-[#8a8d99]">
                  VGA / {reason.code}
                </span>
                <span className="h-2 w-2 bg-[#ed0101]" aria-hidden="true" />
              </div>
              <h3 className="mt-6 text-xl font-bold tracking-[-0.025em] text-[#111322]">
                {reason.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-[#717482]">{reason.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
