import { Skeleton } from "@/components/ui/skeleton";

export default function ProductDetailLoading() {
  return (
    <div className="bg-white">
      <div className="ventum-shell py-5 sm:py-8 lg:py-10">
        <Skeleton className="mb-7 h-4 w-64 max-w-full" />
        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1.08fr)_minmax(360px,.72fr)] lg:gap-16 xl:gap-20">
          <div className="grid gap-3 sm:grid-cols-[72px_1fr]">
            <div className="hidden space-y-2 sm:block">
              <Skeleton className="size-[72px]" />
              <Skeleton className="size-[72px]" />
              <Skeleton className="size-[72px]" />
            </div>
            <Skeleton className="aspect-[4/3] w-full sm:aspect-square" />
          </div>
          <div className="space-y-5 lg:pt-3">
            <Skeleton className="h-4 w-52" />
            <Skeleton className="h-14 w-full max-w-md sm:h-20" />
            <Skeleton className="h-5 w-48" />
            <div className="border-y border-[#d9dbe4] py-5">
              <Skeleton className="mb-2 h-3 w-12" />
              <Skeleton className="h-9 w-40" />
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <div className="grid gap-3 pt-2 sm:grid-cols-2">
              <Skeleton className="h-12" />
              <Skeleton className="h-12" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
