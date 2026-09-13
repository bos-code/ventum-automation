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
        {product.featured && (
          <span className="absolute left-3 top-3 rounded-full bg-ventum-red-600 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-offwhite">
            Featured
          </span>
        )}
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
