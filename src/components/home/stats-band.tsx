"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

interface Stat {
  label: string;
  /** Final value as displayed. Rendered server-side, so it is correct without JS. */
  value: string;
  /** When set, the figure counts up from zero once the band scrolls into view. */
  count?: number;
  suffix?: string;
  detail: string;
}

const STATS: Stat[] = [
  {
    label: "Years in business",
    value: "8",
    count: 8,
    detail: "Trading out of Alaba International Market, Ojo.",
  },
  {
    label: "Satisfied customers",
    value: "2,000+",
    count: 2000,
    suffix: "+",
    detail: "Contractors, installers and trade buyers.",
  },
  {
    label: "What we specialise in",
    value: "Circuit breakers",
    detail: "MCBs, MCCBs, contactors, SPDs and changeovers.",
  },
  {
    label: "Supply capability",
    value: "Wholesale",
    detail: "Carton lots at trade pricing, dispatched daily.",
  },
];

/** Deterministic thousands separator — locale formatting would risk a hydration mismatch. */
const fmt = (n: number) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

export function StatsBand() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    // Values are already final in the DOM, so reduced motion simply leaves them.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const figures = Array.from(
      section.querySelectorAll<HTMLElement>("[data-count]")
    );
    if (figures.length === 0) return;

    for (const figure of figures) figure.textContent = "0";

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        for (const figure of figures) {
          const target = Number(figure.dataset.count);
          const counter = { value: 0 };
          gsap.to(counter, {
            value: target,
            duration: 1.6,
            ease: "power2.out",
            onUpdate: () => {
              figure.textContent = fmt(Math.round(counter.value));
            },
          });
        }
        observer.disconnect();
      },
      { threshold: 0.35 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-label="Ventum at a glance"
      className="bg-white py-12 sm:py-14"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* gap-px over a hairline ground draws the dividers between cells. */}
        <div className="grid grid-cols-2 gap-px bg-navy-950/10 lg:grid-cols-4">
          {STATS.map((stat) => (
            <div key={stat.label} className="bg-white p-4 sm:p-6">
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-ventum-red-600">
                {stat.label}
              </p>

              <p
                className={`mt-3 font-display font-extrabold tracking-tight text-navy-950 ${
                  stat.count ? "text-3xl sm:text-5xl" : "text-xl sm:text-2xl"
                }`}
              >
                {stat.count ? (
                  <>
                    {/* Hidden from assistive tech so the tally is not read mid-count. */}
                    <span aria-hidden="true">
                      <span data-count={stat.count}>{fmt(stat.count)}</span>
                      {stat.suffix}
                    </span>
                    <span className="sr-only">{stat.value}</span>
                  </>
                ) : (
                  stat.value
                )}
              </p>

              <p className="mt-2 text-sm leading-relaxed text-steel-600">
                {stat.detail}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
