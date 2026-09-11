"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ProductImage } from "@/components/catalog/product-image";
import { WhatsAppLink } from "@/components/site/whatsapp-link";
import type { ProductView, Settings } from "@/types";

export function Hero({ settings, productCount, brandCount, products }: { settings: Settings; productCount: number; brandCount: number; products: ProductView[] }) {
  const [lead, second, third] = products;
  const reduceMotion = useReducedMotion();
  const reveal = { hidden: { opacity: 0, y: 26 }, show: { opacity: 1, y: 0 } };

  return (
    <section className="relative isolate min-h-[760px] overflow-hidden bg-[#03031f] text-white lg:min-h-[820px]">
      <div className="pointer-events-none absolute inset-0 ventum-grid-dark opacity-[0.14]" />
      <motion.div aria-hidden="true" className="pointer-events-none absolute -right-[18vw] top-[-22vw] size-[70vw] rounded-full border border-white/[0.07]" animate={reduceMotion ? undefined : { rotate: 360 }} transition={{ duration: 70, repeat: Infinity, ease: "linear" }} />
      <motion.div aria-hidden="true" className="pointer-events-none absolute right-[7vw] top-[12%] size-[42vw] rounded-full border border-[#ed0101]/10" animate={reduceMotion ? undefined : { rotate: -360 }} transition={{ duration: 55, repeat: Infinity, ease: "linear" }} />
      <div className="absolute inset-x-0 top-0 h-[3px] bg-[#ed0101]" />

      <div className="ventum-shell relative grid min-h-[760px] items-center gap-10 py-14 lg:min-h-[820px] lg:grid-cols-[.92fr_1.08fr] lg:gap-4 lg:py-16">
        <motion.div initial="hidden" animate="show" transition={{ staggerChildren: .09, delayChildren: .08 }} className="relative z-20 max-w-3xl lg:pr-4">
          <motion.div variants={reveal} transition={{ duration: .6 }} className="flex items-center gap-3 font-mono text-[9px] font-bold uppercase tracking-[.2em] text-white/48 sm:text-[10px]">
            <motion.span initial={{ width: 0 }} animate={{ width: 42 }} transition={{ duration: .8, delay: .15 }} className="h-px bg-[#ed0101]" />
            Ventum Global Automation · Lagos
          </motion.div>

          <motion.h1 variants={reveal} transition={{ duration: .75, ease: [0.22,1,0.36,1] }} className="ventum-display mt-7 text-[clamp(3.8rem,9vw,8.2rem)] leading-[.83] tracking-[-.075em] text-white">
            Control
            <span className="block text-white/28">the power.</span>
            <span className="block text-[#ed0101]">Protect the work.</span>
          </motion.h1>

          <motion.p variants={reveal} transition={{ duration: .65 }} className="mt-8 max-w-lg text-sm leading-7 text-white/62 sm:text-base sm:leading-8">
            Electrical protection, switching and automation equipment for installers, projects and businesses that need dependable supply.
          </motion.p>

          <motion.div variants={reveal} className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="h-12 rounded-none bg-[#ed0101] px-6 text-[10px] font-extrabold uppercase tracking-[.14em] text-white hover:bg-[#c90000]">
              <Link href="/products">Explore catalogue <span className="ml-2">↗</span></Link>
            </Button>
            <WhatsAppLink number={settings.whatsapp} variant="ghost" size="lg" className="h-12 rounded-none border border-white/20 bg-white/[.03] px-6 text-[10px] font-extrabold uppercase tracking-[.14em] text-white hover:bg-white hover:text-[#06065c]">Talk to sales <span className="ml-2">↗</span></WhatsAppLink>
          </motion.div>

          <motion.div variants={reveal} className="mt-12 flex max-w-lg border-y border-white/12">
            <Stat label="Catalogue" value={productCount ? `${productCount}+` : "Live"} />
            <Stat label="Brands" value={brandCount ? `${brandCount}+` : "Global"} />
            <Stat label="Supply" value="Nigeria" small />
          </motion.div>
        </motion.div>

        <div className="relative z-10 min-h-[430px] sm:min-h-[540px] lg:min-h-[680px]">
          <motion.div initial={{ opacity: 0, scale: .94, x: 35 }} animate={{ opacity: 1, scale: 1, x: 0 }} transition={{ duration: 1, delay: .15, ease: [0.22,1,0.36,1] }} className="absolute inset-[2%_0_8%_4%] sm:inset-[0_0_4%_5%] lg:inset-[2%_-8%_2%_2%]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_52%_45%,rgba(255,255,255,.12),transparent_34%),radial-gradient(circle_at_60%_55%,rgba(237,1,1,.12),transparent_48%)]" />
            <motion.div animate={reduceMotion ? undefined : { y: [0,-12,0] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }} className="relative h-full">
              <ProductImage src={lead?.imageUrls[0]} alt={lead?.name ?? "Ventum electrical equipment"} priority className="h-full w-full bg-transparent [&_img]:object-contain [&_img]:drop-shadow-[0_35px_45px_rgba(0,0,0,.45)]" sizes="(max-width: 1024px) 96vw, 58vw" />
            </motion.div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: .75, duration: .65 }} className="absolute right-0 top-4 z-20 border-l-2 border-[#ed0101] bg-[#03031f]/82 px-4 py-3 backdrop-blur-md sm:right-4 sm:top-10">
            <p className="font-mono text-[8px] font-bold uppercase tracking-[.18em] text-white/42">Featured equipment</p>
            <p className="mt-1 max-w-[220px] text-xs font-bold text-white sm:text-sm">{lead?.name ?? "Protection · Switching · Automation"}</p>
            {lead?.model ? <p className="mt-1 font-mono text-[9px] text-[#ed0101]">{lead.model}</p> : null}
          </motion.div>

          <div className="absolute bottom-0 left-0 right-0 z-20 grid grid-cols-2 border-y border-white/12 bg-[#03031f]/84 backdrop-blur-lg sm:left-auto sm:w-[82%] sm:grid-cols-3">
            {[second, third].map((product, index) => product ? (
              <motion.div key={product.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .9 + index * .1 }}>
                <Link href={`/products/${product.slug}`} className="group flex min-h-20 items-center gap-3 border-r border-white/12 p-3">
                  <ProductImage src={product.imageUrls[0]} alt={product.name} className="size-12 shrink-0 bg-white/95 sm:size-14" sizes="56px" />
                  <div className="min-w-0"><p className="font-mono text-[8px] uppercase tracking-[.13em] text-white/38">{product.brand}</p><p className="mt-1 line-clamp-2 text-[11px] font-semibold leading-4 group-hover:text-[#ed0101]">{product.name}</p></div>
                </Link>
              </motion.div>
            ) : null)}
            <Link href="/products" className="hidden items-center justify-center text-[9px] font-extrabold uppercase tracking-[.15em] text-white transition-colors hover:bg-[#ed0101] sm:flex">View all ↗</Link>
          </div>
        </div>
      </div>

      <motion.div aria-hidden="true" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1.2, delay: .4 }} className="absolute bottom-0 left-0 h-px w-full origin-left bg-gradient-to-r from-[#ed0101] via-white/25 to-transparent" />
    </section>
  );
}

function Stat({ label, value, small = false }: { label: string; value: string; small?: boolean }) {
  return <div className="flex-1 border-r border-white/12 px-4 py-4 first:pl-0 last:border-r-0"><p className="font-mono text-[8px] font-bold uppercase tracking-[.16em] text-white/35">{label}</p><p className={small ? "mt-1 text-xs font-bold uppercase" : "mt-1 text-xl font-bold"}>{value}</p></div>;
}
