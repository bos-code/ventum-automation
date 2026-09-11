import Link from "next/link";
import { Section, SectionHeading } from "@/components/site/section";

export function BrandList({ brands }: { brands: string[] }) {
  if (brands.length === 0) return null;

  return (
    <Section id="brands" muted>
      <SectionHeading
        eyebrow="Sourcing"
        title="Brands we sell"
        description="Genuine products from established electrical and automation manufacturers."
      />
      <ul className="flex flex-wrap gap-2">
        {brands.map((brand) => (
          <li key={brand}>
            <Link
              href={`/products?brand=${encodeURIComponent(brand)}`}
              className="inline-flex items-center rounded-md border border-border bg-card px-3 py-2 text-sm font-medium transition-colors hover:bg-muted"
            >
              {brand}
            </Link>
          </li>
        ))}
      </ul>
    </Section>
  );
}
