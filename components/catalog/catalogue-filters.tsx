"use client";

import { useEffect, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import type { Category } from "@/types";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";

interface CatalogueFiltersProps {
  categories: Category[];
  brands: string[];
}

export function CatalogueFilters({
  categories,
  brands,
}: CatalogueFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentSearch = searchParams.get("search") ?? "";
  const currentCategory = searchParams.get("category") ?? "";
  const currentBrand = searchParams.get("brand") ?? "";

  const [search, setSearch] = useState(currentSearch);

  // Keep the input in sync when the URL changes from outside this input
  // (Clear button, browser back/forward). Comparing against the previous
  // URL value during render — rather than in an effect — avoids
  // clobbering what the user is currently typing before the debounce
  // below has committed it to the URL.
  const [prevSearchParam, setPrevSearchParam] = useState(currentSearch);
  if (currentSearch !== prevSearchParam) {
    setPrevSearchParam(currentSearch);
    setSearch(currentSearch);
  }

  function apply(next: Record<string, string>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(next)) {
      if (value) params.set(key, value);
      else params.delete(key);
    }
    params.delete("page");
    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    });
  }

  // Debounce the free-text search.
  useEffect(() => {
    if (search === currentSearch) return;
    const timer = setTimeout(() => apply({ search }), 350);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const hasFilters = Boolean(currentSearch || currentCategory || currentBrand);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <Input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products, brands, models…"
          className="pl-9"
          aria-label="Search products"
        />
        {isPending && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2">
            <Spinner />
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 sm:flex sm:w-auto">
        <Select
          value={currentCategory}
          onChange={(e) => apply({ category: e.target.value })}
          aria-label="Filter by category"
          className="sm:w-44"
        >
          <option value="">All categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.slug}>
              {category.name}
            </option>
          ))}
        </Select>

        <Select
          value={currentBrand}
          onChange={(e) => apply({ brand: e.target.value })}
          aria-label="Filter by brand"
          className="sm:w-40"
        >
          <option value="">All brands</option>
          {brands.map((brand) => (
            <option key={brand} value={brand}>
              {brand}
            </option>
          ))}
        </Select>
      </div>

      {hasFilters && (
        <button
          type="button"
          onClick={() => apply({ search: "", category: "", brand: "" })}
          className="inline-flex items-center gap-1 self-start rounded-md px-2 py-1 text-sm text-muted-foreground hover:text-foreground sm:self-auto"
        >
          <X className="size-4" aria-hidden="true" />
          Clear
        </button>
      )}
    </div>
  );
}
