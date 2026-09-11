import Link from "next/link";
import { ArrowRight } from "lucide-react";
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
    <article className={cn("group min-w-0", className)}>
      <Link href={`/products/${product.slug}`} className="flex h-full flex-col">
        <div className="relative overflow-hidden bg-[#f6f6f3]">
          <ProductImage
            src={product.imageUrls[0]}
            alt={product.name}
            priority={priority}
            className="aspect-[4/3] bg-transparent [&_img]:p-[7%] [&_img]:transition-transform [&_img]:duration-700 [&_img]:ease-out group-hover:[&_img]:scale-[1.04]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
          <div className="absolute left-4 top-4 flex items-center gap-2 bg-white/92 px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#545767] backdrop-blur-sm">
            <span className={cn("size-1.5 rounded-full", product.inStock ? "bg-[#157447]" : "bg-[#92929e]")} />
            {product.inStock ? "In stock" : "Check stock"}
          </div>
        </div>

        <div className="flex flex-1 flex-col pt-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.11em] text-[#777a88]">{product.brand}</p>
          <h3 className="mt-2 text-lg font-semibold leading-snug tracking-[-0.02em] text-[#111322] transition-colors group-hover:text-[#06065c] sm:text-xl">
            {product.name}
          </h3>
          {product.model && (
            <p className="mt-2 break-words font-mono text-[11px] text-[#777a88]">{product.model}</p>
          )}

          <div className="mt-auto flex items-end justify-between gap-4 border-b border-[#cfd1d8] pb-4 pt-6 transition-colors group-hover:border-[#06065c]">
            <PriceTag
              price={product.price}
              currency={product.currency}
              className="text-base font-semibold text-[#111322] sm:text-lg"
            />
            <span className="flex size-10 shrink-0 items-center justify-center border border-[#06065c]/15 text-[#06065c] transition-all duration-300 group-hover:translate-x-1 group-hover:bg-[#06065c] group-hover:text-white">
              <ArrowRight size={16} />
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
