import type { Specification } from "@/types";

export function ProductSpecs({ specifications }: { specifications: Specification[] }) {
  if (specifications.length === 0) return null;

  return (
    <section className="border-t border-[#d9dbe4] pt-7">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#ed0101]">Technical data</p>
          <h2 className="mt-2 text-xl font-semibold tracking-tight text-[#06065c]">Specifications</h2>
        </div>
        <span className="text-xs text-[#747785]">{specifications.length} fields</span>
      </div>

      <dl className="mt-5 border-t border-[#111322]">
        {specifications.map((spec, index) => (
          <div
            key={`${spec.label}-${index}`}
            className="grid gap-2 border-b border-[#d9dbe4] py-3.5 text-sm sm:grid-cols-[minmax(150px,.7fr)_1.3fr] sm:gap-8"
          >
            <dt className="text-[#656879]">{spec.label}</dt>
            <dd className="font-medium text-[#111322]">{spec.value}</dd>
          </div>
        ))}
      </dl>

      <p className="mt-3 max-w-2xl text-xs leading-5 text-[#747785]">
        Specifications are listed as supplied by the client or manufacturer. Confirm critical ratings and compatibility with Ventum before purchase.
      </p>
    </section>
  );
}
