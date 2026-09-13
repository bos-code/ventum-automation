import Image from "next/image";

const BRANDS = [
  { name: "Posmith", file: "posmith-white.png", width: 140 },
  { name: "CHINT", file: "chint-white.png", width: 130 },
  { name: "Siemens", file: "siemens-white.png", width: 150 },
  { name: "JOYELEC", file: "joyelec-white.png", width: 140 },
  { name: "ABB", file: "abb-white.png", width: 90 },
  { name: "Legrand", file: "legrand-white.png", width: 140 },
  { name: "Schneider Electric", file: "schneider-electric-white.png", width: 180 },
];

export function BrandsStrip() {
  return (
    <section className="bg-graphite-900 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm font-semibold uppercase tracking-widest text-steel-400">
          Brands we sell
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-12 gap-y-8">
          {BRANDS.map((brand) => (
            <Image
              key={brand.file}
              src={`/brand/manufacturers/${brand.file}`}
              alt={brand.name}
              width={brand.width}
              height={48}
              className="h-8 w-auto opacity-70 grayscale transition-opacity hover:opacity-100 sm:h-10"
              style={{ width: "auto" }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
