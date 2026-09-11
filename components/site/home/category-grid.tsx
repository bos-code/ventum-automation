import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Category } from "@/types";
import { Section, SectionHeading } from "@/components/site/section";

export function CategoryGrid({
  categories,
}: {
  categories: (Category & { productCount: number })[];
}) {
  if (categories.length === 0) return null;

  return (
    <Section id="categories">
      <SectionHeading
        eyebrow="Browse by type"
        title="Product categories"
        description="Protection, control and distribution equipment grouped by function."
        link={{ href: "/products", label: "View all products" }}
      />
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <li key={category.id}>
            <Link
              href={`/products?category=${category.slug}`}
              className="flex items-center justify-between gap-3 rounded-lg border border-border bg-card p-4 transition-colors hover:bg-muted"
            >
              <span>
                <span className="block font-medium">{category.name}</span>
                {category.description && (
                  <span className="mt-0.5 block text-sm text-muted-foreground">
                    {category.description}
                  </span>
                )}
              </span>
              <span className="flex shrink-0 items-center gap-2 text-sm text-muted-foreground">
                {category.productCount > 0 && <span>{category.productCount}</span>}
                <ArrowRight className="size-4" aria-hidden="true" />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </Section>
  );
}
