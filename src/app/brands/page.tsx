import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Brands",
  description:
    "Manufacturers we sell: Posmith, CHINT, Siemens, JOYELEC, ABB, Legrand and Schneider Electric.",
};

const BRANDS = [
  { name: "Posmith", file: "posmith-black.png", width: 140 },
  { name: "CHINT", file: "chint-black.png", width: 130 },
  { name: "Siemens", file: "siemens-black.png", width: 150 },
  { name: "JOYELEC", file: "joyelec-black.png", width: 140 },
  { name: "ABB", file: "abb-black.png", width: 90 },
  { name: "Legrand", file: "legrand-black.png", width: 140 },
  { name: "Schneider Electric", file: "schneider-electric-black.png", width: 180 },
];

export default function BrandsPage() {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <p className="text-sm font-semibold uppercase tracking-widest text-ventum-blue-600">
          Brands
        </p>
        <h1 className="mt-2 font-display text-display font-extrabold tracking-tight text-navy-950">
          Manufacturers we sell.
        </h1>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-steel-600">
          Every listing in our catalogue names its actual manufacturer and
          model — no unbranded substitutes, no relabelled parts.
        </p>

        <div className="mt-16 grid grid-cols-2 gap-x-8 gap-y-12 sm:grid-cols-3 md:grid-cols-4">
          {BRANDS.map((brand) => (
            <div
              key={brand.file}
              className="flex flex-col items-center justify-center gap-4"
            >
              <div className="flex h-16 w-full items-center justify-center">
                <Image
                  src={`/brand/manufacturers-black/${brand.file}`}
                  alt={brand.name}
                  width={brand.width}
                  height={56}
                  className="h-10 w-auto sm:h-12"
                  style={{ width: "auto" }}
                />
              </div>
              <span className="text-sm font-semibold text-steel-600">
                {brand.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
