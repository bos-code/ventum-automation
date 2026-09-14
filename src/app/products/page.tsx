import type { Metadata } from "next";
import { getPublishedProducts } from "@/lib/data/products";
import { ProductCard } from "@/components/product-card";
import Link from "next/link";
import { getPublishedCategories } from "@/lib/data/categories";

export const metadata: Metadata = {
  title: "Products",
  description:
    "Circuit breakers, contactors, solar protection and more from Schneider, JOYELEC, Posmith and other trusted manufacturers — every rating exactly as supplied.",
};

export default async function ProductsPage(props: PageProps<"/products">) {
  const [products, categories, params] = await Promise.all([getPublishedProducts(), getPublishedCategories(), props.searchParams]);
  const query = typeof params.q === "string" ? params.q.trim() : "";
  const category = typeof params.category === "string" ? params.category : "";
  const matches = products.filter((product) => (!category || product.categoryId === category) &&
    `${product.name} ${product.brand} ${product.model ?? ""}`.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="bg-[#f2f3f1]">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <p className="text-sm font-semibold uppercase tracking-widest text-ventum-blue-600">
          Catalogue
        </p>
        <h1 className="mt-2 font-display text-display font-extrabold tracking-tight text-navy-950">
          Find your next part.
        </h1>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-steel-600">
          Browse electrical and solar protection equipment from our shop at Alaba.
          Check the model, explore the specifications, and ask us for current availability.
        </p>

        <form action="/products" className="mt-8 grid items-end gap-4 rounded-md border border-navy-950/10 bg-white p-5 sm:grid-cols-[1fr_1fr_auto]">
          <label className="text-sm font-semibold text-navy-950">Search products
            <input name="q" defaultValue={query} placeholder="Name, brand or model" className="mt-2 block h-12 w-full rounded border border-navy-950/20 px-3 font-normal focus-visible:outline-2 focus-visible:outline-ventum-blue-500" />
          </label>
          <label className="text-sm font-semibold text-navy-950">Category
            <select name="category" defaultValue={category} className="mt-2 block h-12 w-full rounded border border-navy-950/20 bg-white px-3 font-normal focus-visible:outline-2 focus-visible:outline-ventum-blue-500">
              <option value="">All categories</option>
              {categories.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
            </select>
          </label>
          <button className="h-12 rounded bg-navy-950 px-6 text-sm font-semibold text-white hover:bg-navy-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ventum-blue-500">Find products</button>
        </form>
        <div className="mt-8 flex items-center justify-between gap-4 text-sm text-steel-600">
          <p>{matches.length} {matches.length === 1 ? "product" : "products"}{query ? ` matching “${query}”` : ""}</p>
          {(query || category) && <Link href="/products" className="font-semibold text-navy-950 underline">Clear filters</Link>}
        </div>

        {products.length === 0 ? (
          <p className="mt-12 text-steel-600">
            The catalogue is temporarily unavailable. Please check back
            shortly, or message us on WhatsApp for stock and pricing.
          </p>
        ) : (
          matches.length === 0 ? <p className="py-16 text-steel-600">No matching products. Try another model or clear the filters to browse the full range.</p> :
          <div className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {matches.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
