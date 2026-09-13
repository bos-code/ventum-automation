const POINTS = [
  {
    number: "01",
    title: "Nameplate-accurate",
    description:
      "We publish the exact rating printed on the unit — no rounding, no substitutions, no guessing at an equivalent.",
  },
  {
    number: "02",
    title: "Real stock, real photos",
    description:
      "Every listing is the actual unit in our Alaba International Market store, not a manufacturer's catalogue render.",
  },
  {
    number: "03",
    title: "WhatsApp-fast",
    description:
      "Message us directly for stock checks, bulk pricing, or technical questions — no call centre, no ticket queue.",
  },
];

export function WhyVentum() {
  return (
    <section className="bg-navy-950 py-16 text-offwhite sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <p className="text-sm font-semibold uppercase tracking-widest text-ventum-blue-400">
          Why Ventum
        </p>
        <h2 className="mt-2 max-w-xl font-display text-display font-extrabold tracking-tight">
          Built on the parts we actually sell.
        </h2>

        <div className="mt-12 grid gap-10 md:grid-cols-3 md:gap-8">
          {POINTS.map((point) => (
            <div
              key={point.number}
              className="border-t border-white/15 pt-6"
            >
              <span className="font-display text-sm font-bold text-ventum-red-400">
                {point.number}
              </span>
              <h3 className="mt-3 font-display text-xl font-bold">
                {point.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-steel-200">
                {point.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
