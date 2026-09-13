import type { Metadata } from "next";
import { getPublishedProducts } from "@/lib/data/products";
import { ProductCard } from "@/components/product-card";

export const metadata: Metadata = {
  title: "Products",
  description:
    "Circuit breakers, contactors, solar protection and more from Schneider, JOYELEC, Posmith and other trusted manufacturers — every rating exactly as supplied.",
};

export default async function ProductsPage() {
  const products = await getPublishedProducts();

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <p className="text-sm font-semibold uppercase tracking-widest text-ventum-blue-600">
          Catalogue
        </p>
        <h1 className="mt-2 font-display text-display font-extrabold tracking-tight text-navy-950">
          All products.
        </h1>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-steel-600">
          Every listing here is a real unit we stock at Alaba International
          Market, with the rating exactly as printed on the nameplate.
        </p>

        {products.length === 0 ? (
          <p className="mt-12 text-steel-600">
            The catalogue is temporarily unavailable. Please check back
            shortly, or message us on WhatsApp for stock and pricing.
          </p>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
