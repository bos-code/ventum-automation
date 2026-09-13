import Link from "next/link";
import { getSettings } from "@/lib/data/settings";
import { Reveal } from "@/components/reveal";

export async function AboutTeaser() {
  const settings = await getSettings();

  return (
    <section className="relative overflow-hidden bg-navy-950 py-20 text-offwhite sm:py-28">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_60%_at_50%_120%,var(--color-ventum-blue-800)_0%,transparent_60%)] opacity-30"
      />
      <Reveal className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <p className="text-sm font-semibold uppercase tracking-widest text-ventum-red-400">
          About {settings.businessName}
        </p>
        <p className="mt-6 font-display text-display font-extrabold leading-tight tracking-tight">
          A real electrical supplier at Alaba International Market — not a
          drop-shipper, not a reseller of stock photos.
        </p>
        <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-steel-200">
          {settings.legalName} sells, installs and supports electrical
          switches, lighting, solar energy equipment, industrial parts and
          hand tools out of {settings.address}.
        </p>
        <Link
          href="/about"
          className="mt-8 inline-flex h-12 items-center rounded-full border border-white/20 px-6 text-sm font-semibold text-offwhite transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ventum-blue-500"
        >
          More about us
        </Link>
      </Reveal>
    </section>
  );
}
