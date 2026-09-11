import type { ProductView } from "@/types";
import { ProductGrid } from "./product-grid";

export function RelatedProducts({ products }: { products: ProductView[] }) {
  if (products.length === 0) return null;

  return (
    <section className="border-t border-border pt-10">
      <h2 className="mb-6 text-xl font-semibold tracking-tight">
        Related products
      </h2>
      <ProductGrid products={products} />
    </section>
  );
}
