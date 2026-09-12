import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Search } from "lucide-react";
import { WhatsAppLink } from "@/components/site/whatsapp-link";
import type { ProductView, Settings } from "@/types";

export function Hero({
  settings,
  products,
}: {
  settings: Settings;
  products: ProductView[];
}) {
  const visualProducts = products.filter((product) => product.imageUrls.length > 0);
  const lead = visualProducts[0];
  const secondary = visualProducts[1];

  return (
    <section className="overflow-hidden border-b border-[#d9dbe4] bg-[#f8f8f5] text-[#111322]">
      <div className="ventum-shell grid min-h-[650px] lg:grid-cols-[0.88fr_1.12fr] lg:items-stretch">
        <div className="relative z-10 flex flex-col justify-center py-12 sm:py-16 lg:py-20 lg:pr-14">
          <p className="mb-5 text-sm font-semibold text-[#ed0101] ventum-reveal">
            Industrial electrical & automation supply
          </p>

          <h1 className="max-w-[10ch] text-[clamp(3rem,6.3vw,6.4rem)] font-semibold leading-[0.92] tracking-[-0.055em] text-[#06065c] ventum-reveal ventum-delay-1">
            The parts that keep work moving.
          </h1>

          <p className="mt-6 max-w-lg text-base leading-7 text-[#555967] sm:text-lg ventum-reveal ventum-delay-2">
            Contactors, breakers, timers and solar protection equipment from established industrial brands.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3 ventum-reveal ventum-delay-3">
            <Link
              href="/products"
              className="inline-flex min-h-12 items-center gap-3 bg-[#06065c] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#03033b]"
            >
              Browse catalogue <ArrowUpRight size={17} />
            </Link>
            <WhatsAppLink
              number={settings.whatsapp}
              variant="ghost"
              className="min-h-12 rounded-none border border-[#c7c9d3] bg-white px-5 text-sm font-semibold text-[#06065c] hover:border-[#06065c] hover:bg-white"
            >
              WhatsApp sales
            </WhatsAppLink>
          </div>

          <form
            action="/products"
            className="mt-10 flex max-w-lg items-center border-b border-[#aeb0bb] focus-within:border-[#06065c] ventum-reveal ventum-delay-4"
          >
            <Search size={17} className="shrink-0 text-[#656879]" aria-hidden="true" />
            <label htmlFor="home-search" className="sr-only">
              Search products by name, brand or model
            </label>
            <input
              id="home-search"
              name="search"
              type="search"
              maxLength={100}
              placeholder="Search brand, model or product"
              className="min-w-0 flex-1 bg-transparent px-3 py-4 text-sm text-[#111322] outline-none placeholder:text-[#777a88]"
            />
            <button
              type="submit"
              className="min-h-11 px-2 text-sm font-semibold text-[#06065c] hover:text-[#ed0101]"
            >
              Search
            </button>
          </form>
        </div>

        <div className="relative min-h-[440px] border-t border-[#d9dbe4] lg:min-h-[650px] lg:border-l lg:border-t-0">
          {lead ? (
            <>
              <Link
                href={`/products/${lead.slug}`}
                className="group absolute inset-0 overflow-hidden bg-[#efefe9]"
                aria-label={`View ${lead.name}`}
              >
                <Image
                  src={lead.imageUrls[0]}
                  alt={lead.name}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 56vw"
                  className="object-contain p-[8%] transition-transform duration-700 ease-out group-hover:scale-[1.025]"
                />
                <div className="absolute inset-x-0 bottom-0 bg-white/94 p-5 backdrop-blur sm:p-6">
                  <p className="text-sm font-semibold text-[#06065c]">{lead.brand}</p>
                  <div className="mt-1 flex items-end justify-between gap-5">
                    <div className="min-w-0">
                      <p className="text-xl font-semibold tracking-[-0.02em] text-[#111322] sm:text-2xl">{lead.name}</p>
                      {lead.model && <p className="mt-1 font-mono text-xs font-medium text-[#656879]">{lead.model}</p>}
                    </div>
                    <span className="shrink-0 text-sm font-semibold text-[#06065c]">View product</span>
                  </div>
                </div>
              </Link>

              {secondary && (
                <Link
                  href={`/products/${secondary.slug}`}
                  className="absolute right-4 top-4 z-10 hidden w-[34%] min-w-[180px] border border-white/70 bg-white shadow-[0_18px_45px_rgba(17,19,34,.14)] lg:block"
                  aria-label={`View ${secondary.name}`}
                >
                  <div className="relative aspect-square bg-[#f7f7f4]">
                    <Image
                      src={secondary.imageUrls[0]}
                      alt={secondary.name}
                      fill
                      sizes="240px"
                      className="object-contain p-[11%]"
                    />
                  </div>
                  <div className="border-t border-[#e2e3e8] p-3">
                    <p className="truncate text-xs font-semibold text-[#06065c]">{secondary.brand}</p>
                    <p className="mt-1 line-clamp-2 text-sm font-semibold leading-5 text-[#111322]">{secondary.name}</p>
                  </div>
                </Link>
              )}
            </>
          ) : (
            <div className="absolute inset-0 grid place-items-center bg-[#efefe9] p-8 text-center text-sm text-[#656879]">
              Product photography will appear here as soon as catalogue images are published.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
