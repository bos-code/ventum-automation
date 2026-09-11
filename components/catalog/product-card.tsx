import Link from "next/link";
import type { ProductView } from "@/types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ProductImage } from "./product-image";
import { PriceTag } from "./price-tag";

export function ProductCard({
  product,
  priority = false,
  className,
}: {
  product: ProductView;
  priority?: boolean;
  className?: string;
}) {
  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-shadow hover:shadow-md focus-within:ring-2 focus-within:ring-ring",
        className,
      )}
    >
      <ProductImage
        src={product.imageUrls[0]}
        alt={product.name}
        priority={priority}
      />

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-muted-foreground">
          <span className="font-medium text-foreground">{product.brand}</span>
          {product.category && (
            <>
              <span aria-hidden="true">·</span>
              <span>{product.category.name}</span>
            </>
          )}
        </div>

        <h3 className="text-sm font-semibold leading-snug">
          <Link
            href={`/products/${product.slug}`}
            className="outline-none after:absolute after:inset-0"
          >
            {product.name}
          </Link>
        </h3>

        {product.model && (
          <p className="text-xs text-muted-foreground">Model {product.model}</p>
        )}

        <div className="mt-auto flex items-center justify-between gap-2 pt-2">
          <PriceTag
            price={product.price}
            currency={product.currency}
            className="text-sm"
          />
          {!product.inStock && (
            <Badge variant="warning" className="relative shrink-0">
              Out of stock
            </Badge>
          )}
        </div>
      </div>
    </article>
  );
}
