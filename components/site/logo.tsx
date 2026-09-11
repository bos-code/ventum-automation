import Link from "next/link";
import { BUSINESS } from "@/lib/constants";
import { cn } from "@/lib/utils";

/**
 * Text-only fallback until the client-supplied Ventum artwork is physically
 * present in the repository. Do not recreate or approximate the actual mark.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn("inline-flex items-center gap-3", className)}
      aria-label={`${BUSINESS.name} — home`}
    >
      <span aria-hidden="true" className="h-9 w-[3px] bg-[#ed0101]" />
      <span className="flex flex-col leading-none">
        <span className="font-[var(--font-display)] text-[1.05rem] font-bold uppercase tracking-[-0.035em] text-current sm:text-[1.15rem]">
          Ventum
        </span>
        <span className="mt-1 text-[8px] font-bold uppercase tracking-[0.22em] opacity-55 sm:text-[9px]">
          Global Automation
        </span>
      </span>
    </Link>
  );
}
