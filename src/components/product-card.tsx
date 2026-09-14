import Link from "next/link";
import { ProductPhoto } from "@/components/product-photo";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/lib/types";

export function ProductCard({ product }: { product: Product }) {
  // One status marker only — stacked badges competed with the product itself.
  const status = product.isNewArrival
    ? { label: "New", className: "bg-ventum-blue-600" }
    : product.isNowAvailable
      ? { label: "In stock", className: "bg-emerald-700" }
      : null;

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-lg border border-white/10 bg-white/5 backdrop-blur-md transition-colors hover:border-white/25 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ventum-blue-400"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-navy-950">
        <ProductPhoto
          product={product}
          sizes="(min-width: 1152px) 280px, (min-width: 640px) 30vw, 45vw"
        />
        {/* Settles the varied phone-photo backgrounds into one consistent frame. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-navy-950/70 via-navy-950/10 to-transparent"
        />
        {status && (
          <span
            className={`absolute left-2 top-2 rounded px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white ${status.className}`}
          >
            {status.label}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-3.5 sm:p-4">
        <p className="truncate font-mono text-[10px] uppercase tracking-wider text-steel-400">
          {product.brand}
          {product.model ? ` · ${product.model}` : ""}
        </p>

        <h3 className="mt-1.5 font-display text-base font-bold leading-tight tracking-tight text-offwhite">
          {product.name}
        </h3>

        <div className="mt-auto flex items-end justify-between gap-2 pt-4">
          <span className="font-display text-lg font-bold tracking-tight text-offwhite">
            {formatPrice(product.price, product.currency)}
          </span>
          <span
            aria-hidden="true"
            className="text-steel-400 transition group-hover:translate-x-0.5 group-hover:text-ventum-blue-400"
          >
            &rarr;
          </span>
        </div>
      </div>
    </Link>
  );
}
