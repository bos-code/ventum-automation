import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function CataloguePagination({
  page,
  pageCount,
  makeHref,
}: {
  page: number;
  pageCount: number;
  /** Build the URL for a given page number, preserving active filters. */
  makeHref: (page: number) => string;
}) {
  if (pageCount <= 1) return null;

  return (
    <nav
      className="flex items-center justify-between gap-4 border-t border-border pt-6"
      aria-label="Catalogue pages"
    >
      {page > 1 ? (
        <Link
          href={makeHref(page - 1)}
          className={cn(buttonVariants({ variant: "secondary", size: "sm" }))}
          rel="prev"
        >
          <ChevronLeft aria-hidden="true" />
          Previous
        </Link>
      ) : (
        <span
          className={cn(
            buttonVariants({ variant: "secondary", size: "sm" }),
            "pointer-events-none opacity-50",
          )}
          aria-hidden="true"
        >
          <ChevronLeft aria-hidden="true" />
          Previous
        </span>
      )}

      <p className="text-sm text-muted-foreground" aria-live="polite">
        Page {page} of {pageCount}
      </p>

      {page < pageCount ? (
        <Link
          href={makeHref(page + 1)}
          className={cn(buttonVariants({ variant: "secondary", size: "sm" }))}
          rel="next"
        >
          Next
          <ChevronRight aria-hidden="true" />
        </Link>
      ) : (
        <span
          className={cn(
            buttonVariants({ variant: "secondary", size: "sm" }),
            "pointer-events-none opacity-50",
          )}
          aria-hidden="true"
        >
          Next
          <ChevronRight aria-hidden="true" />
        </span>
      )}
    </nav>
  );
}
