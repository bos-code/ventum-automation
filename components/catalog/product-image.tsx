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
          <Image
            src={src}
            alt={alt}
            fill
            sizes={sizes}
            preload={priority}
            className="object-contain p-[3%]"
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
