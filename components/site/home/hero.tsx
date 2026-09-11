import Link from "next/link";
import { ArrowRight, Zap } from "lucide-react";
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
  const [lead, second, third] = products;

  return (
    <section className="relative overflow-hidden bg-[#06065c] text-white">
      <div className="pointer-events-none absolute inset-0 opacity-20 ventum-grid" />
      <div className="pointer-events-none absolute -right-20 top-10 h-72 w-72 rounded-full bg-[#ed0101]/20 blur-3xl sm:h-96 sm:w-96" />

      <div className="ventum-shell relative grid min-h-[690px] items-center gap-10 py-12 sm:py-16 lg:grid-cols-[0.92fr_1.08fr] lg:gap-14 lg:py-20">
        <div className="relative z-10 max-w-2xl">
          <p className="ventum-kicker text-white/70">{settings.businessName}</p>

          <h1 className="mt-6 text-[clamp(2.7rem,8vw,5.9rem)] font-black leading-[0.92] tracking-[-0.055em]">
            Power.
            <span className="block text-[#ed0101]">Protection.</span>
            Automation.
          </h1>

          <p className="mt-6 max-w-xl text-sm leading-7 text-white/72 sm:text-base sm:leading-8">
            Electrical protection, control and automation equipment for homes,
            businesses and industrial applications.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button
              asChild
              size="lg"
              className="h-12 rounded-sm bg-[#ed0101] px-6 font-bold text-white hover:bg-[#cc0000]"
            >
              <Link href="/products">
                Browse catalogue
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
            <WhatsAppLink
              number={settings.whatsapp}
              variant="secondary"
              size="lg"
              className="h-12 rounded-sm border border-white/25 bg-white/5 px-6 text-white hover:bg-white hover:text-[#06065c]"
            >
              Talk to sales
            </WhatsAppLink>
          </div>

          <dl className="mt-10 grid max-w-xl grid-cols-3 border-y border-white/15 py-5">
            <div className="border-r border-white/15 pr-3">
              <dt className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/50">Products</dt>
              <dd className="mt-1 text-xl font-black sm:text-2xl">{productCount || "—"}</dd>
            </div>
            <div className="border-r border-white/15 px-3 sm:px-5">
              <dt className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/50">Brands</dt>
              <dd className="mt-1 text-xl font-black sm:text-2xl">{brandCount || "—"}</dd>
            </div>
            <div className="pl-3 sm:pl-5">
              <dt className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/50">Supply</dt>
              <dd className="mt-1 text-sm font-black uppercase leading-6 sm:text-base">Nigeria</dd>
            </div>
          </dl>
        </div>

        <div className="relative min-h-[390px] sm:min-h-[500px] lg:min-h-[560px]">
          <div className="absolute left-0 top-4 w-[76%] border border-white/15 bg-white p-3 shadow-2xl shadow-black/30 sm:w-[72%] sm:p-4 lg:left-6">
            <ProductImage
              src={lead?.imageUrls[0]}
              alt={lead?.name ?? "Ventum electrical product"}
              priority
              className="aspect-[4/5] bg-[#f4f4f5]"
              sizes="(max-width: 1024px) 70vw, 430px"
            />
            <div className="flex items-center justify-between gap-3 bg-white px-1 pb-1 pt-3 text-[#111322]">
              <div className="min-w-0">
                <p className="truncate text-xs font-black uppercase tracking-[0.12em] text-[#06065c]">
                  {lead?.brand ?? "Ventum catalogue"}
                </p>
                <p className="mt-1 line-clamp-1 text-sm font-semibold">
                  {lead?.name ?? "Electrical & automation equipment"}
                </p>
              </div>
              <span className="grid size-9 shrink-0 place-items-center bg-[#ed0101] text-white">
                <Zap className="size-4" aria-hidden="true" />
              </span>
            </div>
          </div>

          <div className="absolute bottom-2 right-0 w-[48%] border border-white/20 bg-[#f2f2f2] p-2 shadow-2xl shadow-black/30 sm:w-[46%] sm:p-3">
            <ProductImage
              src={second?.imageUrls[0]}
              alt={second?.name ?? "Industrial electrical equipment"}
              className="aspect-square bg-white"
              sizes="(max-width: 1024px) 42vw, 260px"
            />
            <p className="mt-2 line-clamp-1 text-[11px] font-bold uppercase tracking-[0.1em] text-[#06065c]">
              {second?.name ?? "Control equipment"}
            </p>
          </div>

          <div className="absolute right-4 top-0 hidden w-[31%] border border-white/20 bg-[#ed0101] p-2 text-white sm:block lg:right-0">
            <ProductImage
              src={third?.imageUrls[0]}
              alt={third?.name ?? "Electrical protection product"}
              className="aspect-square bg-white"
              sizes="180px"
            />
            <p className="mt-2 line-clamp-2 text-[10px] font-black uppercase leading-4 tracking-[0.1em]">
              {third?.name ?? "Protection & control"}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
