"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { ProductView } from "@/types";
import { cn } from "@/lib/utils";
import { ProductImage } from "./product-image";
import { PriceTag } from "./price-tag";
import { AddToEnquiryButton } from "./enquiry-selection";

export function ProductCard({
  product,
  priority = false,
  className,
}: {
  product: ProductView;
  priority?: boolean;
  className?: string;
}) {
  const selectedProduct = {
    id: product.id,
    slug: product.slug,
    name: product.name,
    brand: product.brand,
    model: product.model,
    price: product.price,
    currency: product.currency,
  };

  return (
    <article className={cn("group flex min-w-0 flex-col", className)}>
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative overflow-hidden bg-[#f3f3ef]">
          <ProductImage
            src={product.imageUrls[0]}
            alt={product.name}
            priority={priority}
            className="aspect-[4/3] bg-transparent [&_img]:p-[7%] [&_img]:transition-transform [&_img]:duration-500 [&_img]:ease-out group-hover:[&_img]:scale-[1.025]"
            sizes="(max-width: 429px) 100vw, (max-width: 767px) 50vw, (max-width: 1199px) 33vw, 25vw"
          />
          <div className="absolute left-3 top-3 flex items-center gap-2 bg-white/94 px-2.5 py-1.5 text-xs font-medium text-[#555967] backdrop-blur-sm">
            <span className={cn("size-1.5 rounded-full", product.inStock ? "bg-[#157447]" : "bg-[#92929e]")} />
            {product.inStock ? "In stock" : "Check stock"}
          </div>
        </div>
      </Link>

      <div className="flex flex-1 flex-col pt-4">
        <p className="text-xs font-semibold text-[#06065c]">{product.brand}</p>
        <Link href={`/products/${product.slug}`} className="mt-1 block">
          <h3 className="text-lg font-semibold leading-snug tracking-[-0.025em] text-[#111322] transition-colors group-hover:text-[#06065c] sm:text-xl">
            {product.name}
          </h3>
        </Link>
        {product.model && (
          <p className="mt-2 break-words font-mono text-[13px] font-medium text-[#555967]">{product.model}</p>
        )}

        <div className="mt-auto border-b border-[#d9dbe4] pb-4 pt-5">
          <PriceTag
            price={product.price}
            currency={product.currency}
            className="text-base font-semibold text-[#111322] sm:text-lg"
          />
          <div className="mt-4 grid grid-cols-[1fr_auto] gap-2">
            <AddToEnquiryButton product={selectedProduct} compact className="min-w-0" />
            <Link
              href={`/products/${product.slug}`}
              className="inline-flex min-h-11 items-center justify-center gap-1.5 px-3 text-sm font-semibold text-[#06065c] hover:bg-[#f2f2f2]"
            >
              View <ArrowUpRight size={15} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
