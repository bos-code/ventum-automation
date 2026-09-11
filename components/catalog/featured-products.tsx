import type { ProductView } from "@/types";
import { Section, SectionHeading } from "@/components/site/section";
import { ProductGrid } from "./product-grid";

export function FeaturedProducts({ products }: { products: ProductView[] }) {
  if (products.length === 0) return null;

  return (
    <Section>
      <SectionHeading
        eyebrow="Selected stock"
        title="Featured products"
        description="A cross-section of what we currently supply."
        link={{ href: "/products", label: "See the full catalogue" }}
      />
      <ProductGrid products={products} priorityCount={4} />
    </Section>
  );
}
