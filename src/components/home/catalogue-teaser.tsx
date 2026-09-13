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
    <section id="catalogue" aria-labelledby="catalogue-title" className="scroll-mt-20 bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-ventum-blue-600">
              Catalogue
            </p>
            <h2 id="catalogue-title" className="mt-2 font-display text-display font-extrabold tracking-tight text-navy-950">
              The full lineup.
            </h2>
          </div>
          <Link
            href="/products"
            className="rounded-full border border-navy-950/15 px-5 py-2.5 text-sm font-semibold text-navy-950 transition-colors hover:bg-navy-950 hover:text-offwhite focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ventum-blue-500"
          >
            View all products
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product, index) => (
            <Reveal key={product.id} delay={Math.min(index, 3) * 0.08}>
              <ProductCard product={product} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
