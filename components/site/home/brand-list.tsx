import Image from "next/image";
import Link from "next/link";

/**
 * Supplied brand logos. Only brands with an actual client-supplied
 * logo file get an image — everything else falls back to a text link
 * rather than inventing or substituting a logo. Files live in
 * public/brand-logos/ (see project-source/data/brand-assets.json for
 * the source manifest).
 */
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
    <section id="brands" className="border-y border-[#d9dbe4] bg-white py-9">
      <div className="ventum-shell grid gap-6 lg:grid-cols-[180px_1fr] lg:items-center">
        <h2 className="text-sm font-medium text-[#656879]">
          Brands in our catalogue
        </h2>
        <ul className="flex flex-wrap items-center gap-x-9 gap-y-4">
          {brands.map((brand) => {
            const logo = BRAND_LOGOS[brand.trim().toLowerCase()];
            return (
              <li key={brand}>
                <Link
                  href={`/products?brand=${encodeURIComponent(brand)}`}
                  className="group inline-flex min-h-11 items-center text-lg font-semibold tracking-tight text-[#111322] transition-colors hover:text-[#ed0101]"
                  aria-label={`Filter by ${brand}`}
                >
                  {logo ? (
                    <span className="relative h-7 w-24 grayscale transition-[filter] duration-200 group-hover:grayscale-0 sm:h-8 sm:w-28">
                      <Image
                        src={logo}
                        alt={brand}
                        fill
                        sizes="112px"
                        className="object-contain object-left"
                      />
                    </span>
                  ) : (
                    brand
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
