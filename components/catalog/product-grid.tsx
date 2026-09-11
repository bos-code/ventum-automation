import type { ProductView } from "@/types";
import { cn } from "@/lib/utils";
import { ProductCard } from "./product-card";

export function ProductGrid({
  products,
  priorityCount = 0,
  className,
}: {
  products: ProductView[];
  /** Mark the first N images as priority (above the fold). */
  priorityCount?: number;
  className?: string;
}) {
  return (
    <ul
      className={cn(
        "grid grid-cols-1 gap-x-5 gap-y-10 sm:grid-cols-2 sm:gap-y-12 xl:grid-cols-4 xl:gap-x-6",
        className,
      )}
    >
      {products.map((product, index) => (
        <li key={product.id} className="flex min-w-0">
          <ProductCard
            product={product}
            priority={index < priorityCount}
            className="w-full"
          />
        </li>
      ))}
    </ul>
  );
}
