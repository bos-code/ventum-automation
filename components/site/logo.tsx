import Image from "next/image";
import Link from "next/link";
import { BUSINESS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn(
        "relative block h-10 w-[168px] shrink-0 sm:h-11 sm:w-[188px]",
        className,
      )}
      aria-label={`${BUSINESS.name} — home`}
    >
      <Image
        src="/brand/ventum-horizontal.png"
        alt={BUSINESS.name}
        fill
        priority
        sizes="188px"
        className="object-contain object-left"
      />
    </Link>
  );
}
