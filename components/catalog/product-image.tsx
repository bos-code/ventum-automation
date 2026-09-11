import Image from "next/image";
import { cn } from "@/lib/utils";

interface ProductImageProps {
  src?: string;
  alt: string;
  priority?: boolean;
  className?: string;
  sizes?: string;
}

export function ProductImage({
  src,
  alt,
  priority,
  className,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 320px",
}: ProductImageProps) {
  return (
    <div
      className={cn(
        "relative aspect-square overflow-hidden bg-[#f4f4f2]",
        className,
      )}
    >
      {src ? (
        <>
          <div className="pointer-events-none absolute inset-0 z-[1] bg-[linear-gradient(to_right,rgba(6,6,92,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(6,6,92,0.035)_1px,transparent_1px)] bg-[size:32px_32px]" />
          <Image
            src={src}
            alt={alt}
            fill
            sizes={sizes}
            priority={priority}
            className="object-contain p-[3%] drop-shadow-[0_12px_18px_rgba(17,19,34,0.08)]"
          />
        </>
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center border border-[#06065c]/10 bg-[#f4f4f2] px-6 text-center">
          <div className="relative size-14" aria-hidden="true">
            <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-[#06065c]/20" />
            <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-[#06065c]/20" />
            <span className="absolute inset-2 border border-[#06065c]/20" />
          </div>
          <p className="mt-4 font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-[#777a88]">
            Product image pending
          </p>
          <span className="sr-only">No image available</span>
        </div>
      )}
    </div>
  );
}
