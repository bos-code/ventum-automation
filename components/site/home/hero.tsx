import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";
import { WhatsAppLink } from "@/components/site/whatsapp-link";
import type { ProductView, Settings } from "@/types";

export function Hero({
  settings,
  products,
}: {
  settings: Settings;
  products: ProductView[];
}) {
  const lead = products.find((product) => product.imageUrls.length > 0);

  return (
    <section className="relative isolate overflow-hidden bg-[#06065c] text-white">
      <div className="ventum-shell relative grid min-h-[620px] gap-10 py-12 sm:py-16 lg:min-h-[720px] lg:grid-cols-[0.84fr_1.16fr] lg:items-center lg:gap-10 lg:py-18">
        <div className="relative z-10 max-w-xl ventum-reveal">
          <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.15em] text-white/58">
            Electrical · Control · Automation
          </p>

          <h1 className="max-w-[9.5ch] text-[clamp(3.15rem,6.5vw,6.8rem)] font-semibold leading-[0.94] tracking-[-0.045em]">
            Industrial parts. Ready to work.
          </h1>

          <p className="mt-6 max-w-lg text-base leading-7 text-white/68 sm:text-lg">
            Protection, control and automation equipment from trusted brands.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/products"
              className="inline-flex min-h-12 items-center gap-7 bg-[#ed0101] px-6 text-sm font-semibold transition-colors hover:bg-[#c90000]"
            >
              Browse products <ArrowRight size={18} />
            </Link>
            <WhatsAppLink
              number={settings.whatsapp}
              variant="ghost"
              className="min-h-12 rounded-none border border-white/24 px-5 text-sm text-white hover:bg-white hover:text-[#06065c]"
            >
              Request a quote
            </WhatsAppLink>
          </div>

          <form
            action="/products"
            className="mt-9 flex max-w-lg items-center border-b border-white/28 focus-within:border-white"
          >
            <Search size={17} className="shrink-0 text-white/46" aria-hidden="true" />
            <label htmlFor="home-search" className="sr-only">
              Search products by name, brand or model
            </label>
            <input
              id="home-search"
              name="search"
              type="search"
              maxLength={100}
              placeholder="Search brand, model or product"
              className="min-w-0 flex-1 bg-transparent px-3 py-4 text-sm text-white outline-none placeholder:text-white/42"
            />
            <button
              type="submit"
              aria-label="Search catalogue"
              className="flex size-11 shrink-0 items-center justify-center hover:bg-white/10"
            >
              <ArrowRight size={18} />
            </button>
          </form>
        </div>

        <div className="relative min-h-[390px] sm:min-h-[500px] lg:min-h-[610px] ventum-reveal ventum-delay-2">
          {lead ? (
            <>
              <div className="absolute inset-[5%_0_10%] bg-[radial-gradient(circle_at_52%_44%,rgba(255,255,255,.15),rgba(255,255,255,.03)_40%,transparent_68%)]" />
              <Link
                href={`/products/${lead.slug}`}
                className="group absolute inset-[2%_0_14%_0] flex items-center justify-center"
                aria-label={`View ${lead.name}`}
              >
                <div className="relative h-full w-full transition-transform duration-700 ease-out group-hover:scale-[1.02]">
                  <Image
                    src={lead.imageUrls[0]}
                    alt={lead.name}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 56vw"
                    className="object-contain drop-shadow-[0_36px_48px_rgba(0,0,0,.26)]"
                  />
                </div>
              </Link>

              <div className="absolute bottom-0 left-0 right-0 border-t border-white/14 pt-4 sm:left-[8%]">
                <Link
                  href={`/products/${lead.slug}`}
                  className="group flex items-end justify-between gap-5"
                >
                  <div className="min-w-0">
                    <p className="line-clamp-1 text-base font-semibold sm:text-lg">
                      {lead.name}
                    </p>
                    <p className="mt-1 text-xs text-white/48">
                      {lead.brand}{lead.model ? ` · ${lead.model}` : ""}
                    </p>
                  </div>
                  <span className="flex size-11 shrink-0 items-center justify-center border border-white/24 transition-colors group-hover:bg-white group-hover:text-[#06065c]">
                    <ArrowRight size={17} />
                  </span>
                </Link>
              </div>
            </>
          ) : (
            <div className="absolute inset-0 bg-white/[0.035]" />
          )}
        </div>
      </div>
    </section>
  );
}
