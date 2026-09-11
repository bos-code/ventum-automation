import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
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
        "group relative flex flex-col overflow-hidden border border-[#06065c]/12 bg-white transition-transform duration-300 hover:-translate-y-1 focus-within:ring-2 focus-within:ring-[#ed0101]",
        className,
      )}
    >
      <div className="relative bg-[#f4f4f5] p-3 sm:p-4">
        <ProductImage
          src={product.imageUrls[0]}
          alt={product.name}
          priority={priority}
          className="bg-white transition-transform duration-500 group-hover:scale-[1.025]"
        />
        <span className="absolute left-4 top-4 bg-[#06065c] px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.14em] text-white sm:left-5 sm:top-5">
          {product.brand}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="flex items-center justify-between gap-3 text-[10px] font-bold uppercase tracking-[0.13em] text-muted-foreground">
          <span>{product.category?.name ?? "Electrical equipment"}</span>
          {product.model && <span className="shrink-0">{product.model}</span>}
        </div>

        <h3 className="mt-3 text-base font-black leading-snug tracking-[-0.02em] text-[#111322] sm:text-lg">
          <Link
            href={`/products/${product.slug}`}
            className="outline-none after:absolute after:inset-0"
          >
            {product.name}
          </Link>
        </h3>

        <div className="mt-auto flex items-end justify-between gap-3 border-t border-[#06065c]/10 pt-4">
          <div>
            <p className="mb-1 text-[9px] font-black uppercase tracking-[0.14em] text-muted-foreground">Price</p>
            <PriceTag
              price={product.price}
              currency={product.currency}
              className="text-base font-black text-[#06065c]"
            />
          </div>

          <div className="flex items-center gap-2">
            {!product.inStock && (
              <Badge variant="warning" className="relative shrink-0 rounded-sm text-[9px] uppercase">
                Out of stock
              </Badge>
            )}
            <span className="grid size-10 place-items-center bg-[#ed0101] text-white transition-colors group-hover:bg-[#06065c]">
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
