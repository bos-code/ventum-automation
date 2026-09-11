"use client";

import { useEffect, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, X } from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import type { Category } from "@/types";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";

interface CatalogueFiltersProps {
  categories: Category[];
  brands: string[];
}

export function CatalogueFilters({ categories, brands }: CatalogueFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentSearch = searchParams.get("search") ?? "";
  const currentCategory = searchParams.get("category") ?? "";
  const currentBrand = searchParams.get("brand") ?? "";
  const [search, setSearch] = useState(currentSearch);
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

  useEffect(() => {
    if (search === currentSearch) return;
    const timer = setTimeout(() => apply({ search }), 350);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const hasFilters = Boolean(currentSearch || currentCategory || currentBrand);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:border-y sm:border-[#d9dbe4] sm:py-4">
      <div className="relative flex-1">
        <Search
          className="pointer-events-none absolute left-0 top-1/2 size-4 -translate-y-1/2 text-[#656879] sm:left-3"
          aria-hidden="true"
        />
        <Input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search product, brand or model"
          className="h-12 rounded-none border-0 border-b border-[#aeb0bb] bg-transparent pl-7 pr-10 shadow-none focus-visible:ring-0 sm:border sm:border-[#d9dbe4] sm:bg-[#f8f8f5] sm:pl-10"
          aria-label="Search products"
        />
        {isPending && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2">
            <Spinner />
          </span>
        )}
      </div>

      <div className="hidden gap-2 sm:flex sm:w-auto">
        <Select
          value={currentCategory}
          onChange={(e) => apply({ category: e.target.value })}
          aria-label="Filter by category"
          className="h-12 rounded-none border-[#d9dbe4] bg-white sm:w-48"
        >
          <option value="">All categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.slug}>{category.name}</option>
          ))}
        </Select>
        <Select
          value={currentBrand}
          onChange={(e) => apply({ brand: e.target.value })}
          aria-label="Filter by brand"
          className="h-12 rounded-none border-[#d9dbe4] bg-white sm:w-44"
        >
          <option value="">All brands</option>
          {brands.map((brand) => (
            <option key={brand} value={brand}>{brand}</option>
          ))}
        </Select>
      </div>

      <Dialog>
        <DialogTrigger asChild>
          <button
            type="button"
            className="inline-flex min-h-12 items-center justify-between border border-[#d9dbe4] bg-white px-4 text-sm font-medium sm:hidden"
          >
            <span className="inline-flex items-center gap-2">
              <SlidersHorizontal size={17} /> Filters
            </span>
            {(currentCategory || currentBrand) && (
              <span className="rounded-full bg-[#ed0101] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">Active</span>
            )}
          </button>
        </DialogTrigger>
        <DialogContent className="rounded-none">
          <DialogTitle>Filter catalogue</DialogTitle>
          <DialogDescription>Choose a category or manufacturer to narrow the range.</DialogDescription>
          <label className="grid gap-2 text-sm font-medium">
            Category
            <Select value={currentCategory} onChange={(e) => apply({ category: e.target.value })} className="h-12 rounded-none">
              <option value="">All categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.slug}>{category.name}</option>
              ))}
            </Select>
          </label>
          <label className="grid gap-2 text-sm font-medium">
            Brand
            <Select value={currentBrand} onChange={(e) => apply({ brand: e.target.value })} className="h-12 rounded-none">
              <option value="">All brands</option>
              {brands.map((brand) => (
                <option key={brand} value={brand}>{brand}</option>
              ))}
            </Select>
          </label>
          <DialogClose asChild>
            <button type="button" className="mt-3 min-h-12 bg-[#06065c] px-5 text-sm font-semibold text-white">
              View products
            </button>
          </DialogClose>
        </DialogContent>
      </Dialog>

      {hasFilters && (
        <button
          type="button"
          onClick={() => apply({ search: "", category: "", brand: "" })}
          className="inline-flex min-h-11 items-center gap-1 self-start px-1 text-sm font-medium text-[#656879] hover:text-[#ed0101] sm:self-auto sm:px-3"
        >
          <X className="size-4" aria-hidden="true" /> Clear
        </button>
      )}
    </div>
  );
}
