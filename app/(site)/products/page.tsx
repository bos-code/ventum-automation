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
    <div className="bg-white text-[#111322]">
      <section className="border-b border-[#d9dbe4] bg-[#f7f7f4]">
        <div className="ventum-shell grid gap-8 py-12 sm:py-16 lg:grid-cols-[1fr_auto] lg:items-end lg:py-20">
          <div>
            <p className="ventum-kicker text-[#656879]">Product catalogue</p>
            <h1 className="mt-5 max-w-4xl text-[clamp(2.35rem,5vw,4.8rem)] font-semibold leading-[.98] tracking-[-0.045em] text-[#06065c]">
              {activeCategory ? activeCategory.name : "Electrical control, protection and automation."}
            </h1>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-[#656879] sm:text-base">
              Search by product, manufacturer or model. For exact availability or a hard-to-find part, send the model directly to our sales team.
            </p>
          </div>
          <div className="border-l-2 border-[#ed0101] pl-4 lg:min-w-44">
            <p className="text-2xl font-semibold tracking-tight text-[#06065c]">{total}</p>
            <p className="mt-1 text-xs uppercase tracking-[0.14em] text-[#656879]">
              {total === 1 ? "product" : filtered ? "matching products" : "published products"}
            </p>
          </div>
        </div>
      </section>

      <section className="ventum-shell py-7 sm:py-10 lg:py-12">
        <div className="sticky top-[72px] z-20 -mx-4 mb-10 border-y border-[#d9dbe4] bg-white/95 px-4 py-4 backdrop-blur sm:static sm:mx-0 sm:px-0 sm:py-0 sm:backdrop-blur-none">
          <CatalogueFilters categories={categories} brands={brands} />
        </div>

        {items.length === 0 ? (
          <div className="border-t border-[#d9dbe4] py-16 sm:py-24">
            <EmptyState
              icon={SearchX}
              title={filtered ? "Nothing matches those filters" : "No products yet"}
              description={
                filtered
                  ? "Try a broader product name, remove a brand filter, or browse the full catalogue."
                  : "Products will appear here once they are published."
              }
              action={
                filtered ? (
                  <Link href="/products" className="text-sm font-semibold text-[#ed0101] hover:underline">
                    Clear all filters
                  </Link>
                ) : null
              }
            />
          </div>
        ) : (
          <div className="space-y-12">
            <div className="flex items-center justify-between border-b border-[#d9dbe4] pb-4 text-xs uppercase tracking-[0.12em] text-[#656879]">
              <span>{activeCategory?.name ?? "All equipment"}</span>
              <span>Page {page} of {pageCount}</span>
            </div>
            <ProductGrid products={items} priorityCount={4} />
            <CataloguePagination
              page={page}
              pageCount={pageCount}
              makeHref={(p) => buildCatalogueHref(query, { page: p })}
            />
          </div>
        )}
      </section>
    </div>
  );
}
