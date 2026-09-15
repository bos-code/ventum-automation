import Link from "next/link";
import { ProductPhoto } from "@/components/product-photo";
import { productImageUrl } from "@/lib/appwrite/images";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/lib/types";
import { AddToEnquiryButton } from "@/components/enquiry/add-to-enquiry-button";

export function ProductCard({ product }: { product: Product }) {
  // One status marker only — stacked badges competed with the product itself.
  const status = product.isNewArrival
    ? { label: "New", className: "bg-ventum-blue-600" }
    : product.isNowAvailable
      ? { label: "In stock", className: "bg-emerald-700" }
      : null;

  return (
    /* The link is stretched over the card via ::after rather than wrapping it.
       A <button> inside an <a> is invalid HTML, and before hydration the tap
       fell through to the anchor and navigated instead of adding to the list. */
    <article className="group relative flex h-full flex-col overflow-hidden rounded-lg border border-white/10 bg-white/5 backdrop-blur-md transition-colors hover:border-white/25 hover:bg-white/10 focus-within:border-white/25 has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-2 has-[a:focus-visible]:outline-ventum-blue-400">
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

        <h3 className="mt-1.5 font-display text-base font-bold leading-tight tracking-tight text-offwhite pr-8">
          <Link
            href={`/products/${product.slug}`}
            className="outline-none after:absolute after:inset-0 after:content-['']"
          >
            {product.name}
          </Link>
        </h3>

        <div className="mt-auto flex items-end justify-between gap-2 pt-4">
          <span className="font-display text-lg font-bold tracking-tight text-offwhite">
            {formatPrice(product.price, product.currency)}
          </span>
          {/* z-10 lifts the button above the stretched link's ::after overlay.
              Always visible: it now carries selected state, which must not
              be hidden behind hover. */}
          <div className="relative z-10">
            <AddToEnquiryButton
              product={product}
              imageUrl={product.imageIds[0] ? productImageUrl(product.imageIds[0]) : null}
              variant="icon"
            />
          </div>
        </div>
      </div>
    </article>
  );
}
