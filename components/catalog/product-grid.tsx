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
        "grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-4",
        className,
      )}
    >
      {products.map((product, index) => (
        <li key={product.id} className="flex">
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
