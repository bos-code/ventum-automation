import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
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
    <article className={cn("group min-w-0 bg-white", className)}>
      <Link href={`/products/${product.slug}`} className="flex h-full flex-col">
        <ProductImage
          src={product.imageUrls[0]}
          alt={product.name}
          priority={priority}
          className="bg-[#f2f2f2] [&_img]:p-[8%] [&_img]:transition-transform [&_img]:duration-500 group-hover:[&_img]:scale-[1.035]"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        <div className="flex flex-1 flex-col py-5">
          <p className="text-xs text-[#656879]">{product.brand}</p>
          <h3 className="mt-2 text-lg font-semibold leading-snug tracking-tight group-hover:text-[#06065c]">
            {product.name}
          </h3>
          {product.model && (
            <p className="mt-2 break-words font-mono text-xs text-[#656879]">
              {product.model}
            </p>
          )}
          <div className="mt-5 flex items-center gap-2 text-xs text-[#656879]">
            <span
              className={cn(
                "size-1.5 rounded-full",
                product.inStock ? "bg-[#157447]" : "bg-[#92929e]",
              )}
            />
            {product.inStock ? "In stock" : "Contact for availability"}
          </div>
          <div className="mt-auto flex items-center justify-between gap-4 border-b border-[#d9dbe4] pb-4 pt-5">
            <PriceTag
              price={product.price}
              currency={product.currency}
              className="text-lg font-semibold text-[#111322]"
            />
            <span className="inline-flex items-center gap-2 text-xs font-medium">
              View product <ArrowUpRight size={16} />
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
