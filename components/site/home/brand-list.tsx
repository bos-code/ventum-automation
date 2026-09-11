import Link from "next/link";

export function BrandList({ brands }: { brands: string[] }) {
  if (brands.length === 0) return null;

  return (
    <section id="brands" className="border-b border-[#d9dbe4] bg-[#f8f8f5] py-14 sm:py-18 lg:py-20">
      <div className="ventum-shell">
        <div className="grid gap-6 border-b border-[#d9dbe4] pb-7 lg:grid-cols-[.8fr_1.2fr] lg:items-end">
          <div>
            <p className="ventum-technical-label text-[#ed0101]">Manufacturer index / 05</p>
            <h2 className="mt-4 text-3xl font-bold tracking-[-0.035em] text-[#06065c] sm:text-4xl">
              Browse by brand.
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-7 text-[#6c6f7d] lg:justify-self-end lg:text-right">
            Move directly into the catalogue range for the manufacturer you are looking for.
          </p>
        </div>

        <ul className="grid border-l border-t border-[#d9dbe4] sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {brands.map((brand, index) => (
            <li key={brand}>
              <Link
                href={`/products?brand=${encodeURIComponent(brand)}`}
                className="group grid min-h-24 grid-cols-[42px_1fr_auto] items-center border-b border-r border-[#d9dbe4] px-4 transition-colors hover:bg-[#06065c] hover:text-white sm:px-5"
              >
                <span className="font-mono text-[9px] font-bold text-[#9699a5] group-hover:text-white/35">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="text-base font-bold tracking-[-0.015em] text-[#111322] group-hover:text-white">{brand}</span>
                <span className="text-[#ed0101] transition-transform group-hover:translate-x-0.5" aria-hidden="true">↗</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
