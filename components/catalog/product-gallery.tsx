"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageOff } from "lucide-react";
import { cn } from "@/lib/utils";

export function ProductGallery({
  images,
  name,
}: {
  images: string[];
  name: string;
}) {
  const [active, setActive] = useState(0);

  if (images.length === 0) {
    return (
      <div className="grid aspect-square w-full place-items-center bg-muted text-muted-foreground">
        <ImageOff className="size-10" aria-hidden="true" />
        <span className="sr-only">No image available</span>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="relative aspect-square overflow-hidden bg-muted">
        <Image
          key={images[active]}
          src={images[active]}
          alt={`${name} — image ${active + 1}`}
          fill
          preload
          sizes="(max-width: 1024px) 100vw, 560px"
          className="object-contain"
        />
      </div>

      {images.length > 1 && (
        <ul className="flex flex-wrap gap-2">
          {images.map((src, index) => (
            <li key={src}>
              <button
                type="button"
                onClick={() => setActive(index)}
                aria-label={`Show image ${index + 1}`}
                aria-current={index === active}
                className={cn(
                  "relative size-16 overflow-hidden border bg-muted transition-colors",
                  index === active
                    ? "border-primary ring-1 ring-primary"
                    : "border-border hover:border-foreground/30",
                )}
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  sizes="64px"
                  className="object-contain"
                />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
