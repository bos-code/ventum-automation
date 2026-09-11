import type { Metadata } from "next";
import Link from "next/link";
import { SearchX } from "lucide-react";
import { CatalogueFilters } from "@/components/catalog/catalogue-filters";
import { CataloguePagination } from "@/components/catalog/catalogue-pagination";
import { ProductGrid } from "@/components/catalog/product-grid";
import { EmptyState } from "@/components/site/empty-state";
import { getCatalogue } from "@/lib/appwrite/products";
import {
  buildCatalogueHref,
  hasActiveFilters,
  parseCatalogueParams,
} from "@/lib/catalogue";

export const metadata: Metadata = {
  title: "Products",
  description:
    "Browse electrical protection, industrial control and solar-protection products supplied by Ventum Global Automation.",
};

export default async function ProductsPage(props: PageProps<"/products">) {
  const query = parseCatalogueParams(await props.searchParams);
  const result = await getCatalogue(query);
  const { items, total, page, pageCount, brands, categories } = result;
  const activeCategory = categories.find((c) => c.slug === query.category);
  const filtered = hasActiveFilters(query);

  return (
    <main>
      <section className="border-b border-[#d9dbe4] bg-[#f2f2f2] text-[#111322]">
        <div className="ventum-shell py-10 sm:py-14">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#ed0101]">
            Ventum catalogue
          </p>
          <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
                {activeCategory ? activeCategory.name : "Electrical & automation products"}
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-[#656879] sm:text-base">
                Browse protection, control, switching, solar and related electrical equipment.
              </p>
            </div>
            <p className="text-sm font-medium text-[#656879]">
              {total === 0
                ? "No matching products"
                : `${total} product${total === 1 ? "" : "s"}${filtered ? " found" : ""}`}
            </p>
          </div>
        </div>
      </section>

      <section className="ventum-shell py-8 sm:py-10">
        <div className="mb-8 border-y border-border bg-white py-5">
          <CatalogueFilters categories={categories} brands={brands} />
        </div>

        {items.length === 0 ? (
          <EmptyState
            icon={SearchX}
            title={filtered ? "Nothing found" : "No products yet"}
            description={
              filtered
                ? "Try a different search term, brand or category."
                : "Products will appear here once they are published."
            }
            action={
              filtered ? (
                <Link
                  href="/products"
                  className="text-sm font-semibold text-[#ed0101] hover:underline"
                >
                  Clear filters
                </Link>
              ) : null
            }
          />
        ) : (
          <div className="space-y-10">
            <ProductGrid products={items} priorityCount={4} />
            <CataloguePagination
              page={page}
              pageCount={pageCount}
              makeHref={(p) => buildCatalogueHref(query, { page: p })}
            />
          </div>
        )}
      </section>
    </main>
  );
}
