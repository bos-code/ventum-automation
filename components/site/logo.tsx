import Link from "next/link";
import { BUSINESS } from "@/lib/constants";
import { cn } from "@/lib/utils";

/**
 * Wordmark placeholder for the Ventum logo.
 *
 * The client-supplied logo artwork is the source of truth and must not be
 * redesigned. Once `public/brand/ventum-horizontal.(svg|png)` is added,
 * swap the span below for:
 *   <Image src="/brand/ventum-horizontal.svg" alt={BUSINESS.name} width={150} height={32} priority />
 */
export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn(
        "inline-flex items-center gap-2 font-semibold tracking-tight",
        className,
      )}
      aria-label={`${BUSINESS.name} — home`}
    >
      <span
        aria-hidden="true"
        className="grid size-8 place-items-center rounded-md bg-primary text-sm font-bold text-primary-foreground"
      >
        VG
      </span>
      <span className="text-base leading-tight">
        Ventum
        <span className="text-muted-foreground"> Global Automation</span>
      </span>
    </Link>
  );
}
