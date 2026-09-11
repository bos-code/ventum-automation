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
    <div className="mx-auto max-w-6xl px-4 py-10">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          {activeCategory ? activeCategory.name : "All products"}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {total === 0
            ? "No products match your filters"
            : `${total} product${total === 1 ? "" : "s"}${
                filtered ? " match your filters" : ""
              }`}
        </p>
      </header>

      <div className="mb-8">
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
                className="text-sm font-medium text-primary hover:underline"
              >
                Clear filters
              </Link>
            ) : null
          }
        />
      ) : (
        <div className="space-y-8">
          <ProductGrid products={items} priorityCount={4} />
          <CataloguePagination
            page={page}
            pageCount={pageCount}
            makeHref={(p) => buildCatalogueHref(query, { page: p })}
          />
        </div>
      )}
    </div>
  );
}
