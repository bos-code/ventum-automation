import Link from "next/link";
import { ProductPhoto } from "@/components/product-photo";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/lib/types";

export function ProductCard({ product }: { product: Product }) {

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-md border border-navy-950/10 bg-white transition-shadow hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ventum-blue-500"
    >
      <div className="relative aspect-[4/3] overflow-hidden border-b border-navy-950/10 bg-[#e9ece9]">
        <ProductPhoto product={product} sizes="(min-width: 1152px) 350px, (min-width: 640px) 45vw, 90vw" />
        <div className="absolute left-3 top-3 z-10 flex flex-col items-start gap-1.5">
          {product.isNewArrival && (
            <span className="rounded-full border border-white/30 bg-ventum-blue-600 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-navy-950/40 backdrop-blur-xs">
              New Arrival
            </span>
          )}
          {product.isNowAvailable && (
            <span className="rounded-full border border-white/30 bg-emerald-700 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-navy-950/40 backdrop-blur-xs">
              Now Available
            </span>
          )}
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-1 p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-steel-600">
          {product.brand}
        </p>
        <h3 className="font-display text-lg font-bold leading-snug text-navy-950">
          {product.name}
        </h3>
        {product.model && (
          <p className="text-sm text-steel-600">Model: {product.model}</p>
        )}
        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-navy-950/10 pt-4">
          <span className="font-display text-base font-bold text-navy-950">
            {formatPrice(product.price, product.currency)}
          </span>
          <span className="text-sm font-semibold text-ventum-blue-600 group-hover:underline">
            View details &rarr;
          </span>
        </div>
      </div>
    </Link>
  );
}
