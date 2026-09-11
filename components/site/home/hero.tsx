import Link from "next/link";
import { ArrowRight, CheckCircle2, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WhatsAppLink } from "@/components/site/whatsapp-link";
import { ProductImage } from "@/components/catalog/product-image";
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
  const [lead, second] = products;

  return (
    <section className="relative overflow-hidden border-b border-[#d9dbe4] bg-[#f8f8f5]">
      <div className="pointer-events-none absolute inset-0 ventum-grid opacity-45" />

      <div className="ventum-shell relative grid min-h-[700px] items-stretch lg:grid-cols-[0.94fr_1.06fr]">
        <div className="flex flex-col justify-center py-14 sm:py-18 lg:py-24 lg:pr-14">
          <p className="ventum-kicker text-[#06065c]">{settings.businessName}</p>

          <h1 className="ventum-display mt-7 max-w-[780px] text-[clamp(3.25rem,9vw,6.8rem)] text-[#06065c]">
            Control the
            <span className="block text-[#ed0101]">power.</span>
            Protect the work.
          </h1>

          <p className="mt-7 max-w-xl text-[15px] leading-7 text-[#5d6070] sm:text-base sm:leading-8">
            Electrical protection, switching and automation equipment for homes,
            workshops, commercial sites and industrial applications.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button
              asChild
              size="lg"
              className="h-12 rounded-[2px] bg-[#06065c] px-6 text-[11px] font-extrabold uppercase tracking-[0.12em] text-white hover:bg-[#03033b]"
            >
              <Link href="/products">
                Browse catalogue
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </Button>
            <WhatsAppLink
              number={settings.whatsapp}
              variant="ghost"
              size="lg"
              className="h-12 rounded-[2px] border border-[#cfd1dc] bg-white px-6 text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#06065c] hover:border-[#06065c] hover:bg-white"
            >
              <MessageCircle className="size-4" aria-hidden="true" />
              Talk to sales
            </WhatsAppLink>
          </div>

          <div className="mt-10 grid max-w-2xl gap-px overflow-hidden border border-[#d9dbe4] bg-[#d9dbe4] sm:grid-cols-3">
            <div className="bg-white px-5 py-5">
              <p className="ventum-technical-label text-[#7a7d8b]">Catalogue</p>
              <p className="mt-2 font-[var(--font-display)] text-2xl font-bold text-[#111322]">
                {productCount || "—"}
              </p>
              <p className="mt-1 text-xs text-[#777a88]">available products</p>
            </div>
            <div className="bg-white px-5 py-5">
              <p className="ventum-technical-label text-[#7a7d8b]">Brands</p>
              <p className="mt-2 font-[var(--font-display)] text-2xl font-bold text-[#111322]">
                {brandCount || "—"}
              </p>
              <p className="mt-1 text-xs text-[#777a88]">supported ranges</p>
            </div>
            <div className="bg-white px-5 py-5">
              <p className="ventum-technical-label text-[#7a7d8b]">Sales support</p>
              <div className="mt-2 flex items-center gap-2 text-sm font-bold text-[#111322]">
                <CheckCircle2 className="size-4 text-[#ed0101]" aria-hidden="true" />
                WhatsApp ready
              </div>
              <p className="mt-1 text-xs text-[#777a88]">product-specific enquiries</p>
            </div>
          </div>
        </div>

        <div className="relative min-h-[500px] border-t border-[#d9dbe4] bg-[#06065c] lg:min-h-full lg:border-l lg:border-t-0">
          <div className="pointer-events-none absolute inset-0 ventum-grid-dark opacity-35" />
          <div className="absolute inset-x-0 top-0 h-1 bg-[#ed0101]" />

          <div className="relative flex h-full min-h-[500px] flex-col p-5 sm:p-8 lg:p-10">
            <div className="flex items-center justify-between gap-4 border-b border-white/15 pb-4 text-white">
              <p className="ventum-technical-label text-white/60">Featured equipment</p>
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/45">
                Protection · Control · Automation
              </p>
            </div>

            <div className="relative flex flex-1 items-center justify-center py-7 sm:py-10">
              <div className="relative w-full max-w-[560px]">
                <div className="border border-white/15 bg-white p-4 shadow-[0_32px_80px_rgba(0,0,0,0.26)] sm:p-6">
                  <ProductImage
                    src={lead?.imageUrls[0]}
                    alt={lead?.name ?? "Ventum electrical equipment"}
                    priority
                    className="aspect-[4/3] bg-[#f5f5f3]"
                    sizes="(max-width: 1024px) 92vw, 520px"
                  />
                  <div className="grid gap-4 border-t border-[#e3e4ea] pt-4 sm:grid-cols-[1fr_auto] sm:items-end">
                    <div className="min-w-0">
                      <p className="ventum-technical-label text-[#ed0101]">
                        {lead?.brand ?? "Ventum catalogue"}
                      </p>
                      <p className="mt-2 line-clamp-2 font-[var(--font-display)] text-xl font-bold leading-tight text-[#111322] sm:text-2xl">
                        {lead?.name ?? "Electrical & automation equipment"}
                      </p>
                      {lead?.model ? (
                        <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.08em] text-[#777a88]">
                          Model {lead.model}
                        </p>
                      ) : null}
                    </div>
                    {lead ? (
                      <Link
                        href={`/products/${lead.slug}`}
                        className="inline-flex h-10 items-center justify-center gap-2 bg-[#ed0101] px-4 text-[10px] font-extrabold uppercase tracking-[0.12em] text-white transition-colors hover:bg-[#c90000]"
                      >
                        View product
                        <ArrowRight className="size-3.5" aria-hidden="true" />
                      </Link>
                    ) : null}
                  </div>
                </div>

                {second ? (
                  <div className="absolute -bottom-5 -right-2 hidden w-[180px] border border-white/15 bg-[#f2f2f2] p-3 shadow-xl sm:block lg:-right-8">
                    <ProductImage
                      src={second.imageUrls[0]}
                      alt={second.name}
                      className="aspect-square bg-white"
                      sizes="180px"
                    />
                    <p className="mt-2 line-clamp-2 text-[10px] font-extrabold uppercase leading-4 tracking-[0.08em] text-[#06065c]">
                      {second.name}
                    </p>
                  </div>
                ) : null}
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 border-t border-white/15 pt-4 text-[10px] font-bold uppercase tracking-[0.12em] text-white/45">
              <span>Selected from current catalogue</span>
              <span>Lagos · Nigeria</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
