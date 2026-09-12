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
    <section id="brands" className="border-b border-[#d9dbe4] bg-white py-9 sm:py-11">
      <div className="ventum-shell grid gap-7 lg:grid-cols-[220px_1fr] lg:items-center">
        <div>
          <p className="text-sm font-semibold text-[#ed0101]">Brands we supply</p>
          <p className="mt-1 text-sm text-[#656879]">Browse the catalogue by manufacturer.</p>
        </div>

        <ul className="grid grid-cols-2 gap-x-5 gap-y-3 sm:grid-cols-3 lg:grid-cols-6">
          {brands.map((brand) => {
            const logo = BRAND_LOGOS[brand.trim().toLowerCase()];
            return (
              <li key={brand} className="min-w-0">
                <Link
                  href={`/products?brand=${encodeURIComponent(brand)}`}
                  className="group flex min-h-16 items-center justify-center border border-[#e1e2e7] bg-white px-4 py-3 transition-colors hover:border-[#aeb0bb]"
                  aria-label={`Browse ${brand} products`}
                >
                  {logo ? (
                    <span className="relative h-8 w-full max-w-[118px]">
                      <Image
                        src={logo}
                        alt={`${brand} logo`}
                        fill
                        sizes="118px"
                        className="object-contain"
                      />
                    </span>
                  ) : (
                    <span className="truncate text-sm font-semibold text-[#111322]">{brand}</span>
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
