import Link from "next/link";
import { getPublishedProducts } from "@/lib/data/products";
import { ProductCard } from "@/components/product-card";
import { getSettings } from "@/lib/data/settings";
import { whatsappLink } from "@/lib/site-config";
import { Reveal } from "@/components/reveal";

export async function CatalogueTeaser() {
  const products = await getPublishedProducts();
  if (products.length === 0) {
    const settings = await getSettings();
    return (
      <section id="catalogue" aria-labelledby="catalogue-title" className="scroll-mt-20 bg-white px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 id="catalogue-title" className="text-display font-bold">Find your next part.</h2>
          <p className="mt-4 text-steel-600">The online catalogue is currently unavailable. Send us a part number or photo to check availability.</p>
          <a href={whatsappLink(settings.whatsapp, "Hi Ventum, I'd like to check availability for a part.")}
            target="_blank" rel="noopener noreferrer"
            className="mt-6 inline-flex min-h-12 items-center rounded bg-ventum-red-600 px-6 font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-navy-950">
            Check stock on WhatsApp
          </a>
        </div>
      </section>
    );
  }

  return (
    <section
      id="catalogue"
      aria-labelledby="catalogue-title"
      className="scroll-mt-20 bg-navy-950 bg-[radial-gradient(ellipse_60%_50%_at_15%_0%,rgb(55_42_220/0.18)_0%,transparent_70%)] py-16 sm:py-20"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <p className="font-mono text-xs font-semibold uppercase tracking-widest text-ventum-red-400">
          Catalogue
        </p>
        <h2
          id="catalogue-title"
          className="mt-2 max-w-xl font-display text-display font-extrabold tracking-tight text-offwhite"
        >
          Industrial &amp; electrical products.
        </h2>

        {/* Thin technical rule ties the header to the grid below it. */}
        <div className="mt-8 border-t border-white/10" />

        <Reveal>
          {/* gap-px over a hairline ground: cards share dividers instead of
              each being its own floating grey box. */}
          <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {products.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </Reveal>

        <div className="mt-6 flex justify-end">
          <Link
            href="/products"
            className="group inline-flex min-h-11 items-center gap-2 border-b border-white/25 text-sm font-semibold text-offwhite transition-colors hover:border-ventum-red-400 hover:text-ventum-red-400 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ventum-blue-400"
          >
            View all {products.length} products
            <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">
              &rarr;
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
