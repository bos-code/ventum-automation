"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageOff } from "lucide-react";
import { cn } from "@/lib/utils";

export function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(0);

  if (images.length === 0) {
    return (
      <div className="grid aspect-[4/3] w-full place-items-center bg-[#f4f4f1] text-[#747785] sm:aspect-square">
        <div className="text-center">
          <ImageOff className="mx-auto size-9" aria-hidden="true" />
          <p className="mt-3 text-xs uppercase tracking-[0.14em]">Image unavailable</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-[72px_1fr] sm:items-start">
      {images.length > 1 && (
        <ul className="order-2 flex gap-2 overflow-x-auto pb-1 sm:order-1 sm:flex-col sm:overflow-visible">
          {images.map((src, index) => (
            <li key={`${src}-${index}`} className="shrink-0">
              <button
                type="button"
                onClick={() => setActive(index)}
                aria-label={`Show image ${index + 1}`}
                aria-current={index === active}
                className={cn(
                  "relative size-[68px] overflow-hidden border bg-white transition-all sm:size-[72px]",
                  index === active
                    ? "border-[#06065c] ring-1 ring-[#06065c]"
                    : "border-[#d9dbe4] opacity-70 hover:opacity-100",
                )}
              >
                <Image src={src} alt="" fill sizes="72px" className="object-contain p-1.5" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className={cn("order-1 relative aspect-[4/3] overflow-hidden bg-[#f4f4f1] sm:aspect-square", images.length > 1 && "sm:order-2")}> 
        <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between p-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#656879]">
          <span>Product view</span>
          <span>{active + 1} / {images.length}</span>
        </div>
        <Image
          key={images[active]}
          src={images[active]}
          alt={`${name} — image ${active + 1}`}
          fill
          preload
          sizes="(max-width: 1024px) 100vw, 620px"
          className="object-contain p-[7%] transition-opacity duration-300"
        />
      </div>
    </div>
  );
}
