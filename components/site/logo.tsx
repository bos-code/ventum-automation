import Image from "next/image";
import Link from "next/link";
import { BUSINESS } from "@/lib/constants";
import { cn } from "@/lib/utils";

/**
 * The client-supplied Ventum mark, used unmodified (only reformatted to
 * PNG — no redesign, recolour or crop into the artwork itself). It ships
 * on its own black backing, so it sits in a matching dark tile rather
 * than floating directly on the header's white background.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn("inline-flex items-center gap-3", className)}
      aria-label={`${BUSINESS.name} — home`}
    >
      <span className="relative block size-9 shrink-0 overflow-hidden rounded-sm bg-black sm:size-10">
        <Image
          src="/brand/ventum-mark.png"
          alt=""
          fill
          sizes="40px"
          className="object-contain p-0.5"
          priority
        />
      </span>
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
