"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RefreshCcw } from "lucide-react";

export default function SiteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[site]", error);
  }, [error]);

  return (
    <section className="bg-white">
      <div className="ventum-shell grid min-h-[62vh] items-center gap-10 py-16 lg:grid-cols-[.9fr_1.1fr] lg:py-24">
        <div>
          <p className="ventum-kicker text-[#656879]">System notice</p>
          <h1 className="mt-5 max-w-[10ch] text-[clamp(2.75rem,6vw,5.75rem)] font-semibold leading-[.96] tracking-[-0.04em] text-[#06065c]">
            We couldn&apos;t load this page.
          </h1>
          <p className="mt-6 max-w-lg text-base leading-7 text-[#656879]">
            Try the request again. If the issue continues, return to the catalogue and contact the sales team from there.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={reset}
              className="inline-flex min-h-12 items-center gap-3 bg-[#ed0101] px-5 text-sm font-semibold text-white hover:bg-[#c90000]"
            >
              <RefreshCcw size={16} /> Try again
            </button>
            <Link
              href="/products"
              className="inline-flex min-h-12 items-center border border-[#d9dbe4] px-5 text-sm font-semibold text-[#111322] hover:border-[#06065c]"
            >
              Browse catalogue
            </Link>
          </div>
        </div>
        <div className="relative min-h-[280px] overflow-hidden bg-[#06065c] text-white sm:min-h-[390px]">
          <div className="absolute inset-0 ventum-grid-dark opacity-60" />
          <div className="absolute left-8 top-8 h-2.5 w-2.5 bg-[#ed0101] sm:left-10 sm:top-10" />
          <p className="absolute left-8 top-16 max-w-xs text-sm leading-6 text-white/65 sm:left-10 sm:top-20">
            Temporary interruption. Your catalogue data and enquiry workflow remain unchanged.
          </p>
          <div className="absolute bottom-8 left-8 right-8 border-t border-white/20 pt-5 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-white/50 sm:bottom-10 sm:left-10 sm:right-10">
            Ventum Global Automation
          </div>
        </div>
      </div>
    </section>
  );
}
