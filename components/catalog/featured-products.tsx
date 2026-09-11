import Link from "next/link";
import type { ProductView } from "@/types";
import { ProductGrid } from "./product-grid";

export function FeaturedProducts({ products }: { products: ProductView[] }) {
  if (products.length === 0) return null;

  return (
    <section className="border-b border-[#d9dbe4] bg-white py-16 sm:py-20 lg:py-24">
      <div className="ventum-shell">
        <div className="grid gap-7 border-b border-[#d9dbe4] pb-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="ventum-technical-label text-[#ed0101]">Catalogue preview / 03</p>
            <h2 className="mt-4 max-w-3xl text-4xl font-bold leading-[0.98] tracking-[-0.045em] text-[#06065c] sm:text-5xl lg:text-6xl">
              Selected equipment from the current range.
            </h2>
          </div>
          <Link
            href="/products"
            className="inline-flex h-11 items-center border border-[#06065c] px-4 text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#06065c] transition-colors hover:bg-[#06065c] hover:text-white"
          >
            View all products <span className="ml-2 text-[#ed0101]" aria-hidden="true">↗</span>
          </Link>
        </div>

        <div className="pt-8">
          <ProductGrid products={products} priorityCount={4} />
        </div>
      </div>
    </section>
  );
}
