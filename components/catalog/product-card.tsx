import Link from "next/link";
import type { ProductView } from "@/types";
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
        "group relative flex flex-col border border-[#d9dbe4] bg-white transition-colors duration-200 hover:border-[#06065c]/45 focus-within:ring-2 focus-within:ring-[#ed0101]",
        className,
      )}
    >
      <Link href={`/products/${product.slug}`} className="relative block outline-none">
        <div className="relative border-b border-[#d9dbe4] bg-[#f4f4f2] p-3 sm:p-4">
          <ProductImage
            src={product.imageUrls[0]}
            alt={product.name}
            priority={priority}
            className="bg-[#f4f4f2]"
          />

          <div className="absolute inset-x-3 top-3 flex items-start justify-between gap-3 sm:inset-x-4 sm:top-4">
            <span className="bg-[#06065c] px-2.5 py-1.5 text-[9px] font-extrabold uppercase tracking-[0.13em] text-white">
              {product.brand}
            </span>
            <span
              className={cn(
                "border px-2 py-1 font-mono text-[8px] font-bold uppercase tracking-[0.12em]",
                product.inStock
                  ? "border-[#157447]/25 bg-white/95 text-[#157447]"
                  : "border-[#ed0101]/25 bg-white/95 text-[#ed0101]",
              )}
            >
              {product.inStock ? "Available" : "Confirm stock"}
            </span>
          </div>
        </div>

        <div className="flex min-h-[205px] flex-col p-4 sm:p-5">
          <div className="flex min-h-5 items-center justify-between gap-3 font-mono text-[9px] font-bold uppercase tracking-[0.11em] text-[#7a7d8b]">
            <span className="truncate">{product.category?.name ?? "Electrical equipment"}</span>
            {product.model ? <span className="shrink-0">{product.model}</span> : null}
          </div>

          <h3 className="mt-3 line-clamp-2 text-lg font-bold leading-[1.15] tracking-[-0.025em] text-[#111322] transition-colors group-hover:text-[#06065c]">
            {product.name}
          </h3>

          {product.specifications.length > 0 ? (
            <div className="mt-4 grid gap-1.5 border-t border-[#e5e6eb] pt-3">
              {product.specifications.slice(0, 2).map((spec) => (
                <div key={`${spec.label}-${spec.value}`} className="grid grid-cols-[minmax(0,1fr)_auto] gap-3 text-[10px] leading-4">
                  <span className="truncate uppercase tracking-[0.06em] text-[#858896]">{spec.label}</span>
                  <span className="max-w-[9rem] truncate text-right font-semibold text-[#333646]">{spec.value}</span>
                </div>
              ))}
            </div>
          ) : null}

          <div className="mt-auto flex items-end justify-between gap-4 border-t border-[#d9dbe4] pt-4">
            <div>
              <p className="font-mono text-[8px] font-bold uppercase tracking-[0.14em] text-[#8a8d99]">Price</p>
              <PriceTag
                price={product.price}
                currency={product.currency}
                className="mt-1 text-base font-bold text-[#06065c]"
              />
            </div>

            <span className="inline-flex h-10 items-center gap-2 border-l border-[#d9dbe4] pl-4 text-[9px] font-extrabold uppercase tracking-[0.12em] text-[#06065c]">
              Details
              <span className="text-[#ed0101] transition-transform group-hover:translate-x-0.5" aria-hidden="true">↗</span>
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
