import { ProductGridSkeleton } from "@/components/catalog/product-grid-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProductsLoading() {
  return (
    <div>
      <section className="border-b border-[#d9dbe4] bg-[#f2f2f2]">
        <div className="ventum-shell py-10 sm:py-14">
          <Skeleton className="mb-3 h-4 w-32" />
          <Skeleton className="mb-3 h-10 w-72 sm:w-96" />
          <Skeleton className="h-5 w-64 max-w-full" />
        </div>
      </section>

      <section className="ventum-shell py-8 sm:py-10">
        <div className="mb-8 border-y border-border bg-white py-5">
          <Skeleton className="h-10 w-full max-w-md" />
        </div>
        <ProductGridSkeleton />
      </section>
    </div>
  );
}
