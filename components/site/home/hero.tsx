import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProductImage } from "@/components/catalog/product-image";
import { WhatsAppLink } from "@/components/site/whatsapp-link";
import type { ProductView, Settings } from "@/types";

export function Hero({
  settings,
  productCount,
  brandCount,
  products,
}: {
  settings: Settings;
  productCount: number;
  brandCount: number;
  products: ProductView[];
}) {
  const [lead, second, third] = products;

  return (
    <section className="relative overflow-hidden border-b border-[#d9dbe4] bg-[#06065c] text-white">
      <div className="pointer-events-none absolute inset-0 ventum-grid-dark opacity-20" />
      <div className="absolute inset-x-0 top-0 h-[3px] bg-[#ed0101]" />

      <div className="ventum-shell relative grid min-h-[720px] lg:grid-cols-[0.82fr_1.18fr]">
        <div className="flex flex-col justify-center py-14 sm:py-20 lg:border-r lg:border-white/12 lg:pr-12 lg:py-24">
          <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.18em] text-white/55">
            <span className="h-px w-8 bg-[#ed0101]" />
            Electrical · Protection · Automation
          </div>

          <h1 className="ventum-display mt-7 max-w-[720px] text-[clamp(3.3rem,8.5vw,7rem)] text-white">
            Power systems
            <span className="block text-[#ed0101]">built to work.</span>
          </h1>

          <p className="mt-7 max-w-xl text-[15px] leading-7 text-white/68 sm:text-base sm:leading-8">
            Protection, switching and automation equipment for residential,
            commercial and industrial applications.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button
              asChild
              size="lg"
              className="h-12 rounded-[1px] bg-[#ed0101] px-6 text-[11px] font-extrabold uppercase tracking-[0.12em] text-white hover:bg-[#c90000]"
            >
              <Link href="/products">
                Browse catalogue <span aria-hidden="true">↗</span>
              </Link>
            </Button>
            <WhatsAppLink
              number={settings.whatsapp}
              variant="ghost"
              size="lg"
              className="h-12 rounded-[1px] border border-white/25 bg-transparent px-6 text-[11px] font-extrabold uppercase tracking-[0.12em] text-white hover:bg-white hover:text-[#06065c]"
            >
              Talk to sales <span aria-hidden="true">↗</span>
            </WhatsAppLink>
          </div>

          <div className="mt-12 grid max-w-xl grid-cols-3 border-y border-white/15">
            <HeroStat label="Products" value={productCount ? String(productCount) : "—"} />
            <HeroStat label="Brands" value={brandCount ? String(brandCount) : "—"} />
            <HeroStat label="Supply" value="Nigeria" compact />
          </div>
        </div>

        <div className="relative min-h-[540px] py-8 sm:py-10 lg:pl-10 lg:py-12">
          <div className="flex h-full flex-col border-x border-white/12">
            <div className="flex items-center justify-between border-y border-white/12 px-4 py-3 sm:px-5">
              <p className="ventum-technical-label text-white/55">Featured equipment</p>
              <p className="hidden text-[9px] font-bold uppercase tracking-[0.16em] text-white/35 sm:block">
                Current catalogue selection
              </p>
            </div>

            <div className="relative flex-1 bg-[#f4f4f2] p-4 sm:p-6 lg:p-8">
              <div className="absolute left-4 top-4 z-10 bg-[#06065c] px-3 py-2 text-[9px] font-bold uppercase tracking-[0.14em] text-white sm:left-6 sm:top-6">
                {lead?.brand ?? "Ventum catalogue"}
              </div>

              <ProductImage
                src={lead?.imageUrls[0]}
                alt={lead?.name ?? "Ventum electrical equipment"}
                priority
                className="h-full min-h-[360px] aspect-auto bg-[#f4f4f2] sm:min-h-[430px]"
                sizes="(max-width: 1024px) 100vw, 720px"
              />

              <div className="absolute inset-x-4 bottom-4 border border-[#d9dbe4] bg-white/96 p-4 text-[#111322] backdrop-blur-sm sm:inset-x-6 sm:bottom-6 sm:p-5">
                <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
                  <div className="min-w-0">
                    <p className="font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-[#ed0101]">
                      {lead?.model ? `Model ${lead.model}` : "Product selection"}
                    </p>
                    <h2 className="mt-2 line-clamp-2 text-xl font-bold leading-tight text-[#06065c] sm:text-2xl lg:text-3xl">
                      {lead?.name ?? "Electrical & automation equipment"}
                    </h2>
                  </div>
                  {lead ? (
                    <Link
                      href={`/products/${lead.slug}`}
                      className="inline-flex h-11 items-center justify-center border border-[#06065c] px-4 text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#06065c] transition-colors hover:bg-[#06065c] hover:text-white"
                    >
                      View product <span className="ml-2" aria-hidden="true">↗</span>
                    </Link>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 border-b border-white/12 bg-[#040447] sm:grid-cols-3">
              {[second, third].filter(Boolean).map((product) => (
                <Link
                  key={product!.id}
                  href={`/products/${product!.slug}`}
                  className="group flex min-h-24 items-center gap-3 border-r border-white/12 px-4 py-3 last:border-r-0"
                >
                  <ProductImage
                    src={product!.imageUrls[0]}
                    alt={product!.name}
                    className="size-16 shrink-0 border border-white/10 bg-white"
                    sizes="64px"
                  />
                  <div className="min-w-0">
                    <p className="line-clamp-1 text-[9px] font-bold uppercase tracking-[0.12em] text-white/45">
                      {product!.brand}
                    </p>
                    <p className="mt-1 line-clamp-2 text-xs font-semibold leading-4 text-white group-hover:text-white/80">
                      {product!.name}
                    </p>
                  </div>
                </Link>
              ))}
              <Link
                href="/products"
                className="hidden min-h-24 items-center justify-between px-4 py-3 text-[10px] font-extrabold uppercase tracking-[0.12em] text-white sm:flex"
              >
                View all
                <span aria-hidden="true">↗</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroStat({
  label,
  value,
  compact = false,
}: {
  label: string;
  value: string;
  compact?: boolean;
}) {
  return (
    <div className="border-r border-white/15 px-3 py-5 first:pl-0 last:border-r-0 sm:px-5">
      <p className="font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-white/40">{label}</p>
      <p className={compact ? "mt-2 text-sm font-bold uppercase" : "mt-1 text-2xl font-bold"}>{value}</p>
    </div>
  );
}
