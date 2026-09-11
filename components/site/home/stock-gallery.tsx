import Image from "next/image";
import { Section, SectionHeading } from "@/components/site/section";

/**
 * Real stock imagery. Currently sourced from product photos; when the
 * client's shop/stock photographs are added they can be passed in here
 * instead (see docs/ASSET_GUIDE.md).
 */
export function StockGallery({ images }: { images: string[] }) {
  if (images.length < 3) return null;

  return (
    <Section>
      <SectionHeading
        eyebrow="From the shop"
        title="Real stock"
        description="A sample of equipment currently held and supplied."
      />
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {images.slice(0, 8).map((src, index) => (
          <li
            key={src}
            className="relative aspect-square overflow-hidden rounded-lg border border-border bg-muted"
          >
            <Image
              src={src}
              alt=""
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 260px"
              className="object-cover"
              loading={index < 4 ? "eager" : "lazy"}
            />
          </li>
        ))}
      </ul>
    </Section>
  );
}
