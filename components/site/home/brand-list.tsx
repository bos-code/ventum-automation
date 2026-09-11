import Image from "next/image";
import Link from "next/link";

const BRAND_LOGOS: Record<string, string> = {
  "schneider electric": "/brand-logos/schneider-electric-logo.png",
  schneider: "/brand-logos/schneider-electric-logo.png",
  abb: "/brand-logos/abb-logo.png",
  joyelec: "/brand-logos/joyelec-logo.png",
  legrand: "/brand-logos/legrand-logo.png",
  posmith: "/brand-logos/posmith-logo.png",
  siemens: "/brand-logos/siemens-logo.png",
};

export function BrandList({ brands }: { brands: string[] }) {
  if (!brands.length) return null;

  return (
    <section id="brands" className="border-b border-[#d9dbe4] bg-white py-7 sm:py-8">
      <div className="ventum-shell grid gap-5 lg:grid-cols-[210px_1fr] lg:items-center">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#777a88]">Manufacturers</p>
          <p className="mt-1 text-sm font-medium text-[#2b2e3b]">Source by brand</p>
        </div>

        <ul className="flex items-center gap-x-9 gap-y-4 overflow-x-auto pb-1 lg:flex-wrap lg:justify-end lg:overflow-visible lg:pb-0">
          {brands.map((brand) => {
            const logo = BRAND_LOGOS[brand.trim().toLowerCase()];
            return (
              <li key={brand} className="shrink-0">
                <Link
                  href={`/products?brand=${encodeURIComponent(brand)}`}
                  className="group inline-flex min-h-12 items-center text-base font-semibold tracking-tight text-[#111322] transition-colors hover:text-[#ed0101]"
                  aria-label={`Filter by ${brand}`}
                >
                  {logo ? (
                    <span className="relative h-7 w-24 opacity-65 grayscale transition-all duration-300 group-hover:opacity-100 group-hover:grayscale-0 sm:h-8 sm:w-28">
                      <Image src={logo} alt={brand} fill sizes="112px" className="object-contain object-left" />
                    </span>
                  ) : (
                    <span className="whitespace-nowrap text-sm text-[#555866] group-hover:text-[#06065c]">{brand}</span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
