import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";
import { WhatsAppLink } from "@/components/site/whatsapp-link";
import type { ProductView, Settings } from "@/types";

export function Hero({
  settings,
  products,
  productCount,
  brandCount,
}: {
  settings: Settings;
  productCount: number;
  brandCount: number;
  products: ProductView[];
}) {
  const lead = products.find((product) => product.imageUrls.length > 0);
  const supporting = products
    .filter((product) => product.id !== lead?.id && product.imageUrls.length > 0)
    .slice(0, 2);

  return (
    <section className="relative isolate overflow-hidden bg-[#06065c] text-white">
      <div className="pointer-events-none absolute inset-0 opacity-70" aria-hidden="true">
        <div className="absolute -right-24 top-[-18rem] h-[44rem] w-[44rem] rounded-full border border-white/10" />
        <div className="absolute -right-4 top-[-10rem] h-[31rem] w-[31rem] rounded-full border border-white/8" />
        <div className="absolute bottom-0 left-[48%] h-px w-[42%] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </div>

      <div className="ventum-shell relative grid min-h-[680px] gap-12 py-14 sm:py-18 lg:min-h-[760px] lg:grid-cols-[0.88fr_1.12fr] lg:items-center lg:gap-8 lg:py-20">
        <div className="relative z-10 max-w-2xl ventum-reveal">
          <p className="mb-7 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/62">
            <span className="h-2 w-2 bg-[#ed0101]" />
            Electrical • Control • Automation
          </p>

          <h1 className="max-w-[10.5ch] text-[clamp(3.3rem,7vw,7.4rem)] font-semibold leading-[0.94] tracking-[-0.045em]">
            Equipment for work that cannot stop.
          </h1>

          <p className="mt-7 max-w-xl text-base leading-7 text-white/72 sm:text-lg sm:leading-8">
            Source protection, control and automation components from trusted
            industrial brands, with direct sales support from Lagos.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link
              href="/products"
              className="inline-flex min-h-13 items-center gap-8 bg-[#ed0101] px-6 text-sm font-semibold transition-[background-color,transform] hover:-translate-y-0.5 hover:bg-[#c90000]"
            >
              Browse catalogue <ArrowRight size={18} />
            </Link>
            <WhatsAppLink
              number={settings.whatsapp}
              variant="ghost"
              className="min-h-13 rounded-none border border-white/25 px-6 text-sm text-white hover:bg-white hover:text-[#06065c]"
            >
              Request a quote
            </WhatsAppLink>
          </div>

          <form
            action="/products"
            className="mt-11 flex max-w-xl items-center border-b border-white/30 transition-colors focus-within:border-white"
          >
            <Search size={18} className="shrink-0 text-white/50" aria-hidden="true" />
            <label htmlFor="home-search" className="sr-only">
              Search products by name, brand or model
            </label>
            <input
              id="home-search"
              name="search"
              type="search"
              maxLength={100}
              placeholder="Search brand, model or product"
              className="min-w-0 flex-1 bg-transparent px-3 py-4 text-sm text-white outline-none placeholder:text-white/45"
            />
            <button
              type="submit"
              aria-label="Search catalogue"
              className="flex size-12 shrink-0 items-center justify-center transition-colors hover:bg-white/10"
            >
              <ArrowRight size={19} />
            </button>
          </form>

          <div className="mt-9 flex flex-wrap gap-x-10 gap-y-4 text-xs text-white/50">
            <span><strong className="mr-2 text-sm font-semibold text-white">{productCount || "—"}</strong> products</span>
            <span><strong className="mr-2 text-sm font-semibold text-white">{brandCount || "—"}</strong> brands</span>
            <span>Lagos, Nigeria</span>
          </div>
        </div>

        <div className="relative min-h-[420px] sm:min-h-[520px] lg:min-h-[640px] ventum-reveal ventum-delay-2">
          {lead ? (
            <>
              <div className="absolute inset-x-[4%] bottom-[5%] top-[4%] bg-[radial-gradient(circle_at_52%_42%,rgba(255,255,255,.16),rgba(255,255,255,.03)_38%,transparent_68%)]" />
              <Link
                href={`/products/${lead.slug}`}
                className="group absolute inset-[3%_0_14%_0] flex items-center justify-center"
                aria-label={`View ${lead.name}`}
              >
                <div className="relative h-full w-full transition-transform duration-700 ease-out group-hover:scale-[1.025]">
                  <Image
                    src={lead.imageUrls[0]}
                    alt={lead.name}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 54vw"
                    className="object-contain drop-shadow-[0_36px_48px_rgba(0,0,0,.28)]"
                  />
                </div>
              </Link>

              <div className="absolute bottom-0 left-0 right-0 border-t border-white/16 pt-5 sm:left-[8%]">
                <Link href={`/products/${lead.slug}`} className="group flex items-end justify-between gap-6">
                  <div className="min-w-0">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#ed0101]">Featured equipment</p>
                    <p className="mt-2 line-clamp-1 text-base font-semibold sm:text-lg">{lead.name}</p>
                    <p className="mt-1 text-xs text-white/50">{lead.brand}{lead.model ? ` • ${lead.model}` : ""}</p>
                  </div>
                  <span className="flex size-12 shrink-0 items-center justify-center border border-white/25 transition-colors group-hover:bg-white group-hover:text-[#06065c]">
                    <ArrowRight size={18} />
                  </span>
                </Link>
              </div>

              {supporting.length > 0 && (
                <div className="absolute right-0 top-[8%] hidden w-44 border-l border-white/18 pl-4 xl:block">
                  <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.15em] text-white/42">Also in stock</p>
                  <div className="space-y-5">
                    {supporting.map((product) => (
                      <Link key={product.id} href={`/products/${product.slug}`} className="group block">
                        <p className="text-[10px] text-white/45">{product.brand}</p>
                        <p className="mt-1 line-clamp-2 text-xs font-medium leading-5 text-white/80 group-hover:text-white">{product.name}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center border border-white/12 bg-white/[0.035] p-10 text-center">
              <div className="max-w-sm">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#ed0101]">Catalogue ready</p>
                <p className="mt-4 text-2xl font-semibold leading-tight">Add product photography to turn this stage into the visual centrepiece.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-white/12 bg-black/10">
        <div className="ventum-shell flex gap-7 overflow-x-auto py-4 text-[11px] font-medium uppercase tracking-[0.1em] text-white/54 sm:justify-between">
          <span className="shrink-0">Circuit protection</span>
          <span className="shrink-0">Contactors & relays</span>
          <span className="shrink-0">Solar protection</span>
          <span className="shrink-0">Timers & controllers</span>
        </div>
      </div>
    </section>
  );
}
