import Image from "next/image";
import { ImageOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductImageProps {
  src?: string;
  alt: string;
  /** Render priority for above-the-fold images. */
  priority?: boolean;
  className?: string;
  sizes?: string;
}

/**
 * Square product image with a neutral placeholder when no image exists.
 * Wrap in a element that establishes the box; the image fills it.
 */
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
        "relative aspect-square overflow-hidden bg-muted",
        className,
      )}
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-contain"
        />
      ) : (
        <div className="grid h-full w-full place-items-center text-muted-foreground">
          <ImageOff className="size-8" aria-hidden="true" />
          <span className="sr-only">No image available</span>
        </div>
      )}
    </div>
  );
}
