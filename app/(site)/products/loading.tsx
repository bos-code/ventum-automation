import { ProductGridSkeleton } from "@/components/catalog/product-grid-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProductsLoading() {
  return (
    <div className="bg-white">
      <section className="border-b border-[#d9dbe4] bg-[#f7f7f4]">
        <div className="ventum-shell py-12 sm:py-16 lg:py-20">
          <Skeleton className="mb-5 h-3 w-36" />
          <Skeleton className="mb-4 h-12 w-full max-w-3xl sm:h-16" />
          <Skeleton className="h-5 w-full max-w-xl" />
        </div>
      </section>

      <section className="ventum-shell py-7 sm:py-10 lg:py-12">
        <div className="mb-10 border-y border-[#d9dbe4] py-4">
          <Skeleton className="h-12 w-full" />
        </div>
        <div className="mb-8 flex justify-between border-b border-[#d9dbe4] pb-4">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-3 w-20" />
        </div>
        <ProductGridSkeleton />
      </section>
    </div>
  );
}
