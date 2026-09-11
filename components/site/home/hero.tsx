import Link from "next/link";
import { ArrowUpRight, Search } from "lucide-react";
import { PriceTag } from "@/components/catalog/price-tag";
import { ProductImage } from "@/components/catalog/product-image";
import { WhatsAppLink } from "@/components/site/whatsapp-link";
import type { ProductView, Settings } from "@/types";

export function Hero({
  settings,
  products,
}: {
  settings: Settings;
  productCount: number;
  brandCount: number;
  products: ProductView[];
}) {
  const lead = products.find((product) => product.imageUrls.length > 0);
  const supporting = products
    .filter(
      (product) => product.id !== lead?.id && product.imageUrls.length > 0,
    )
    .slice(0, 2);
  return (
    <section className="bg-[#08082f] text-white">
      <div className="ventum-shell grid gap-10 py-10 sm:py-14 lg:grid-cols-[.8fr_1.2fr] lg:items-center lg:gap-14 lg:py-16">
        <div className="ventum-reveal">
          <p className="mb-6 flex items-center gap-3 text-xs font-medium tracking-wide text-white/70">
            <span className="h-2 w-2 bg-[#ed0101]" />
            Electrical supply. Lagos, Nigeria.
          </p>
          <h1 className="max-w-[12ch] text-[clamp(2.75rem,5.5vw,5.5rem)] font-semibold leading-[1.02] tracking-[-0.055em]">
            The right parts.
            <br />
            <span className="text-white/55">For the work ahead.</span>
          </h1>
          <p className="mt-6 max-w-sm text-base leading-7 text-white/70">
            Protection, control and automation equipment. Find your model and
            talk directly with our sales team.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/products"
              className="inline-flex min-h-12 items-center gap-6 bg-[#ed0101] px-5 text-sm font-semibold transition-colors hover:bg-[#c90000]"
            >
              Browse catalogue <ArrowUpRight size={18} />
            </Link>
            <WhatsAppLink
              number={settings.whatsapp}
              variant="ghost"
              className="min-h-12 rounded-none px-2 text-sm text-white hover:bg-white/10 hover:text-white"
            >
              Talk to sales
            </WhatsAppLink>
          </div>
          <form
            action="/products"
            className="mt-10 flex max-w-md items-center border-b border-white/35 pb-2"
          >
            <Search
              size={18}
              className="shrink-0 text-white/60"
              aria-hidden="true"
            />
            <label htmlFor="home-search" className="sr-only">
              Search products by name, brand or model
            </label>
            <input
              id="home-search"
              name="search"
              type="search"
              maxLength={100}
              placeholder="Search a product, brand or model"
              className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm text-white placeholder:text-white/55"
            />
            <button
              type="submit"
              aria-label="Search catalogue"
              className="flex size-11 shrink-0 items-center justify-center hover:bg-white/10"
            >
              <ArrowUpRight size={20} />
            </button>
          </form>
        </div>
        {lead ? (
          <div className="ventum-reveal ventum-delay-2 min-w-0">
            <Link
              href={`/products/${lead.slug}`}
              className="group block bg-[#f2f2f2] text-[#111322]"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 px-5 pt-5 text-xs sm:px-7">
                <span>{lead.brand}</span>
                <span className="text-[#656879]">From our catalogue</span>
              </div>
              <ProductImage
                src={lead.imageUrls[0]}
                alt={lead.name}
                priority
                sizes="(max-width: 1024px) 100vw, 55vw"
                className="aspect-[4/3] max-h-[390px] bg-[#f2f2f2] [&_img]:p-6 [&_img]:transition-transform [&_img]:duration-500 group-hover:[&_img]:scale-[1.025]"
              />
              <div className="flex items-center justify-between gap-4 border-t border-black/10 p-5 sm:px-7">
                <div className="min-w-0">
                  <p className="text-lg font-semibold tracking-tight">
                    {lead.name}
                  </p>
                  {lead.model && (
                    <p className="mt-1 break-words font-mono text-xs text-[#656879]">
                      {lead.model}
                    </p>
                  )}
                </div>
                <ArrowUpRight className="shrink-0" size={24} />
              </div>
            </Link>
            {supporting.length > 0 && (
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {supporting.map((product) => (
                  <Link
                    key={product.id}
                    href={`/products/${product.slug}`}
                    className="group flex min-w-0 items-center gap-4 border border-white/20 p-3 transition-colors hover:bg-white/5"
                  >
                    <ProductImage
                      src={product.imageUrls[0]}
                      alt={product.name}
                      sizes="72px"
                      className="size-[72px] shrink-0 bg-white"
                    />
                    <div className="min-w-0">
                      <p className="text-xs text-white/60">{product.brand}</p>
                      <p className="mt-1 line-clamp-2 text-sm font-medium">
                        {product.name}
                      </p>
                    </div>
                    <ArrowUpRight
                      size={16}
                      className="ml-auto shrink-0 text-white/60"
                    />
                  </Link>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="border-t border-white/20">
            <p className="py-5 text-sm text-white/60">From the catalogue</p>
            {products.length > 0 ? (
              products.map((product) => (
                <Link
                  href={`/products/${product.slug}`}
                  key={product.id}
                  className="group flex items-center justify-between gap-5 border-b border-white/20 py-6"
                >
                  <div className="min-w-0">
                    <p className="text-xs text-white/60">{product.brand}</p>
                    <h2 className="mt-2 text-xl font-medium">{product.name}</h2>
                    {product.model && (
                      <p className="mt-2 break-words font-mono text-xs text-white/60">
                        {product.model}
                      </p>
                    )}
                    <PriceTag
                      price={product.price}
                      currency={product.currency}
                      className="mt-3 block text-sm text-white"
                    />
                  </div>
                  <ArrowUpRight
                    size={22}
                    className="shrink-0 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1"
                  />
                </Link>
              ))
            ) : (
              <p className="py-6 text-lg leading-7">
                Send us a brand and model for pricing and current availability.
              </p>
            )}
          </div>
        )}
      </div>
      <div className="border-t border-white/15">
        <div className="ventum-shell flex flex-wrap justify-between gap-x-8 gap-y-3 py-5 text-xs text-white/65">
          <span>Circuit protection</span>
          <span>Contactors & relays</span>
          <span>Solar protection</span>
          <span>Timers & controllers</span>
        </div>
      </div>
    </section>
  );
}
