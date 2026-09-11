import type { CatalogueQuery } from "@/types";

type RawParams = Record<string, string | string[] | undefined>;

function first(value: string | string[] | undefined): string {
  return (Array.isArray(value) ? value[0] : value) ?? "";
}

/** Parse and sanitise catalogue filters from URL search params. */
export function parseCatalogueParams(params: RawParams): CatalogueQuery {
  const pageNum = Number.parseInt(first(params.page), 10);
  return {
    category: first(params.category).trim().slice(0, 80) || undefined,
    brand: first(params.brand).trim().slice(0, 120) || undefined,
    search: first(params.search).trim().slice(0, 100) || undefined,
    page: Number.isFinite(pageNum) && pageNum > 0 ? pageNum : 1,
  };
}

/** Build a `/products` URL from a query, with optional overrides. */
export function buildCatalogueHref(
  query: CatalogueQuery,
  overrides: Partial<CatalogueQuery> = {},
): string {
  const merged = { ...query, ...overrides };
  const params = new URLSearchParams();
  if (merged.category) params.set("category", merged.category);
  if (merged.brand) params.set("brand", merged.brand);
  if (merged.search) params.set("search", merged.search);
  if (merged.page && merged.page > 1) params.set("page", String(merged.page));
  const qs = params.toString();
  return qs ? `/products?${qs}` : "/products";
}

export function hasActiveFilters(query: CatalogueQuery): boolean {
  return Boolean(query.category || query.brand || query.search);
}
