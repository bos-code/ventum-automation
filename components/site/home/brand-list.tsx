import Link from "next/link";

export function BrandList({ brands }: { brands: string[] }) {
  if (!brands.length) return null;
  return (
    <section id="brands" className="border-y border-[#d9dbe4] bg-white py-9">
      <div className="ventum-shell grid gap-6 lg:grid-cols-[180px_1fr] lg:items-center">
        <h2 className="text-sm font-medium text-[#656879]">
          Brands in our catalogue
        </h2>
        <ul className="flex flex-wrap items-center gap-x-9 gap-y-3">
          {brands.map((brand) => (
            <li key={brand}>
              <Link
                href={`/products?brand=${encodeURIComponent(brand)}`}
                className="inline-flex min-h-11 items-center text-lg font-semibold tracking-tight text-[#111322] transition-colors hover:text-[#ed0101]"
              >
                {brand}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
