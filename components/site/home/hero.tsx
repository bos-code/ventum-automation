import Link from "next/link";
import { ProductImage } from "@/components/catalog/product-image";
import { WhatsAppLink } from "@/components/site/whatsapp-link";
import type { ProductView, Settings } from "@/types";

export function Hero({ settings, products }: { settings: Settings; productCount: number; brandCount: number; products: ProductView[] }) {
  const [lead, second, third] = products;

  return (
    <section className="relative isolate overflow-hidden bg-[#02021a] text-white">
      <div className="absolute inset-0 ventum-grid-dark opacity-[0.1]" />
      <div className="absolute inset-x-0 top-0 z-30 h-[3px] bg-[#ed0101]" />

      <div className="ventum-shell relative min-h-[760px] sm:min-h-[820px] lg:min-h-[840px]">
        <div className="grid min-h-[760px] sm:min-h-[820px] lg:min-h-[840px] lg:grid-cols-[0.7fr_1.3fr]">
          <div className="relative z-20 flex items-start justify-center pb-8 pt-10 sm:pt-14 lg:justify-center lg:pb-16 lg:pt-20">
            <div className="w-full max-w-[620px] lg:pr-8">
              <div className="ventum-reveal ventum-delay-1 flex items-center gap-3 font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-white/45">
                <span className="ventum-rule h-px bg-[#ed0101]" />
                Electrical · Protection · Automation
              </div>

              <h1 className="ventum-reveal ventum-delay-2 ventum-display mt-5 max-w-[10ch] text-[clamp(3.7rem,11vw,8.8rem)] leading-[0.82] tracking-[-0.075em] text-white">
                Built for
                <span className="block text-[#ed0101]">the work.</span>
              </h1>

              <p className="ventum-reveal ventum-delay-3 mt-6 max-w-md text-[13px] leading-6 text-white/56 sm:text-[15px] sm:leading-7">
                Genuine electrical, solar-protection and automation equipment for installers, projects and businesses.
              </p>

              <div className="ventum-reveal ventum-delay-4 mt-7 flex flex-wrap gap-3">
                <Link
                  href="/products"
                  className="inline-flex h-12 items-center justify-center bg-[#ed0101] px-5 text-[10px] font-extrabold uppercase tracking-[0.13em] text-white transition-colors hover:bg-[#c90000]"
                >
                  Shop catalogue <span className="ml-2" aria-hidden="true">↗</span>
                </Link>
                <WhatsAppLink
                  number={settings.whatsapp}
                  variant="ghost"
                  size="lg"
                  className="h-12 rounded-none border border-white/20 bg-white/[0.03] px-5 text-[10px] font-extrabold uppercase tracking-[0.13em] text-white hover:bg-white hover:text-[#06065c]"
                >
                  WhatsApp sales <span className="ml-2" aria-hidden="true">↗</span>
                </WhatsAppLink>
              </div>
            </div>
          </div>

          <div className="relative z-10 min-h-[430px] sm:min-h-[520px] lg:min-h-0">
            <div className="absolute inset-0 lg:-right-[8vw]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_58%_48%,rgba(255,255,255,.13),transparent_27%),radial-gradient(circle_at_60%_52%,rgba(237,1,1,.1),transparent_43%)]" />
              <div className="ventum-stage-in absolute inset-[3%_-2%_12%_-3%] sm:inset-[1%_-1%_8%_3%] lg:inset-[4%_0_7%_-5%]">
                <div className="ventum-product-float h-full">
                  <ProductImage
                    src={lead?.imageUrls[0]}
                    alt={lead?.name ?? "Ventum electrical equipment"}
                    priority
                    className="h-full w-full bg-transparent [&_img]:object-contain [&_img]:drop-shadow-[0_42px_54px_rgba(0,0,0,.5)]"
                    sizes="(max-width: 1024px) 100vw, 66vw"
                  />
                </div>
              </div>
            </div>

            <div className="ventum-side-in absolute right-0 top-2 z-20 max-w-[220px] border-l-2 border-[#ed0101] bg-[#02021a]/78 px-4 py-3 backdrop-blur-md sm:right-4 sm:top-8 lg:right-0 lg:top-12">
              <p className="font-mono text-[8px] font-bold uppercase tracking-[0.16em] text-white/38">Featured now</p>
              <p className="mt-1 line-clamp-2 text-xs font-bold leading-4 text-white sm:text-sm sm:leading-5">
                {lead?.name ?? "Current catalogue selection"}
              </p>
              {lead?.model ? <p className="mt-1 font-mono text-[9px] text-[#ed0101]">{lead.model}</p> : null}
            </div>

            <div className="absolute bottom-3 left-0 right-0 z-20 grid grid-cols-2 gap-2 sm:left-auto sm:right-3 sm:w-[76%] sm:max-w-[540px]">
              {[second, third].map((product, index) =>
                product ? (
                  <Link
                    key={product.id}
                    href={`/products/${product.slug}`}
                    className={`group ventum-tile-in ${index === 0 ? "ventum-delay-5" : "ventum-delay-6"} grid min-h-[92px] grid-cols-[72px_1fr] items-center gap-3 border border-white/12 bg-[#02021a]/88 p-2.5 backdrop-blur-xl transition-colors hover:border-[#ed0101]/60 sm:grid-cols-[88px_1fr]`}
                  >
                    <ProductImage
                      src={product.imageUrls[0]}
                      alt={product.name}
                      className="h-[72px] w-[72px] bg-white sm:h-[82px] sm:w-[88px]"
                      sizes="88px"
                    />
                    <div className="min-w-0 pr-1">
                      <p className="font-mono text-[8px] uppercase tracking-[0.13em] text-white/35">{product.brand}</p>
                      <p className="mt-1 line-clamp-2 text-[11px] font-semibold leading-4 text-white group-hover:text-[#ed0101] sm:text-xs">
                        {product.name}
                      </p>
                    </div>
                  </Link>
                ) : null,
              )}
            </div>
          </div>
        </div>
      </div>

      <div aria-hidden="true" className="ventum-bottom-line absolute bottom-0 left-0 h-px w-full origin-left bg-gradient-to-r from-[#ed0101] via-white/20 to-transparent" />
    </section>
  );
}
