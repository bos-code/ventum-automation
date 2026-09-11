import { Skeleton } from "@/components/ui/skeleton";

export default function ProductDetailLoading() {
  return (
    <div className="bg-white">
      <div className="ventum-shell py-6 sm:py-8">
        <Skeleton className="mb-5 h-4 w-64" />
        <div className="grid items-start gap-8 lg:grid-cols-[1.2fr_.8fr] lg:gap-14">
          <div className="overflow-hidden bg-[#f2f2f2] p-3 sm:p-5">
            <Skeleton className="aspect-square w-full" />
          </div>
          <div className="space-y-4 py-3 sm:py-5">
            <div className="flex gap-2">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-6 w-20" />
            </div>
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-9 w-36" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <div className="flex gap-3 pt-4">
              <Skeleton className="h-11 flex-1" />
              <Skeleton className="h-11 flex-1" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
