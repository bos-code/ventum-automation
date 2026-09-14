import Image from "next/image";
import Link from "next/link";
import { getSettings } from "@/lib/data/settings";
import { Reveal } from "@/components/reveal";

const BRANDS = [
  { name: "Posmith", file: "posmith-white.png", width: 140 },
  { name: "CHINT", file: "chint-white.png", width: 130 },
  { name: "Siemens", file: "siemens-white.png", width: 150 },
  { name: "JOYELEC", file: "joyelec-white.png", width: 140 },
  { name: "ABB", file: "abb-white.png", width: 90 },
  { name: "Legrand", file: "legrand-white.png", width: 140 },
  { name: "Schneider Electric", file: "schneider-electric-white.png", width: 180 },
];

// Vertical drop of the diagonal seam at the left edge, in px.
const SLASH = 64;

export async function AboutBrands() {
  const settings = await getSettings();

  return (
    <section className="relative overflow-hidden bg-navy-950 text-offwhite">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_60%_at_50%_0%,var(--color-ventum-blue-800)_0%,transparent_60%)] opacity-30"
      />

      <Reveal className="relative z-10 mx-auto max-w-3xl px-4 pb-28 pt-20 text-center sm:px-6 sm:pb-32 sm:pt-28 lg:px-8">
        <p className="text-sm font-semibold uppercase tracking-widest text-ventum-red-400">
          About {settings.businessName}
        </p>
        <h2 className="mt-6 font-display text-display font-extrabold leading-tight tracking-tight">
          Local knowledge. Practical support.
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-steel-200">
          {settings.legalName} sells, installs and supports electrical switches,
          lighting, solar energy equipment, industrial parts and hand tools out
          of {settings.address}.
        </p>
        <Link
          href="/about"
          className="mt-8 inline-flex h-12 items-center rounded-full border border-white/20 px-6 text-sm font-semibold text-offwhite transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ventum-blue-500"
        >
          More about us
        </Link>
      </Reveal>

      {/* Brands sit below a diagonal seam: an accent layer, then the panel
          clipped 2px lower so only a hairline of red follows the slash. */}
      <div className="relative">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-ventum-red-600"
          style={{ clipPath: `polygon(0 ${SLASH}px, 100% 0, 100% 100%, 0 100%)` }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-graphite-900"
          style={{ clipPath: `polygon(0 ${SLASH + 2}px, 100% 2px, 100% 100%, 0 100%)` }}
        />

        <div className="relative z-10 mx-auto max-w-6xl px-4 pb-16 pt-28 sm:px-6 sm:pb-20 sm:pt-32 lg:px-8">
          <p className="text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-steel-400">
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
                className="h-8 w-auto opacity-60 grayscale transition-opacity hover:opacity-100 sm:h-10"
                style={{ width: "auto" }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
