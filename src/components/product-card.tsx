import Image from "next/image";
import Link from "next/link";
import { productImageUrl } from "@/lib/appwrite/images";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/lib/types";

export function ProductCard({ product }: { product: Product }) {
  const image = product.imageIds[0];

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-navy-950/10 bg-white transition-shadow hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ventum-blue-500"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-mist-200">
        {image ? (
          <Image
            src={productImageUrl(image)}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 ease-editorial group-hover:scale-105"
          />
        ) : null}
        <div className="absolute left-3 top-3 z-10 flex flex-col items-start gap-1.5">
          {product.isNewArrival && (
            <span className="rounded-full bg-ventum-blue-600 border border-white/30 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-navy-950/40 backdrop-blur-xs">
              New Arrival
            </span>
          )}
          {product.isNowAvailable && (
            <span className="rounded-full bg-emerald-700 border border-white/30 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-navy-950/40 backdrop-blur-xs">
              Now Available
            </span>
          )}
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-steel-600">
          {product.brand}
        </p>
        <h3 className="font-display text-lg font-bold leading-snug text-navy-950">
          {product.name}
        </h3>
        {product.model && (
          <p className="text-sm text-steel-600">Model: {product.model}</p>
        )}
        <div className="mt-auto flex items-center justify-between pt-3">
          <span className="font-display text-lg font-extrabold text-ventum-red-600">
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
