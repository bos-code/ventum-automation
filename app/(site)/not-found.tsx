import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default function SiteNotFound() {
  return (
    <section className="bg-white">
      <div className="ventum-shell grid min-h-[68vh] items-center gap-10 py-16 lg:grid-cols-[.8fr_1.2fr] lg:py-24">
        <div>
          <p className="ventum-kicker text-[#656879]">Error 404</p>
          <h1 className="mt-5 max-w-[9ch] text-[clamp(3rem,7vw,6.75rem)] font-semibold leading-[.94] tracking-[-0.045em] text-[#06065c]">
            This page isn&apos;t in the catalogue.
          </h1>
          <p className="mt-6 max-w-lg text-base leading-7 text-[#656879]">
            The page may have moved, the product may no longer be published, or the address may be incorrect.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/products"
              className="inline-flex min-h-12 items-center gap-4 bg-[#ed0101] px-5 text-sm font-semibold text-white hover:bg-[#c90000]"
            >
              Browse catalogue <ArrowUpRight size={17} />
            </Link>
            <Link
              href="/"
              className="inline-flex min-h-12 items-center border border-[#d9dbe4] px-5 text-sm font-semibold text-[#111322] hover:border-[#06065c]"
            >
              Return home
            </Link>
          </div>
        </div>
        <div className="relative min-h-[300px] overflow-hidden bg-[#f4f4f2] sm:min-h-[420px]">
          <div className="absolute inset-0 ventum-grid opacity-80" />
          <div className="absolute left-[10%] top-[18%] h-px w-[80%] bg-[#06065c]/15" />
          <div className="absolute left-[18%] top-[10%] h-[80%] w-px bg-[#06065c]/15" />
          <div className="absolute bottom-[14%] right-[8%] text-[clamp(7rem,22vw,17rem)] font-semibold leading-none tracking-[-0.08em] text-[#06065c]/[.06]">
            404
          </div>
          <div className="absolute left-[18%] top-[32%] h-3 w-3 bg-[#ed0101]" />
          <p className="absolute bottom-8 left-8 max-w-xs font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[#656879] sm:bottom-10 sm:left-10">
            Ventum Global Automation · Lagos
          </p>
        </div>
      </div>
    </section>
  );
}
