"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import Link from "next/link";
import gsap from "gsap";
import { siteConfig, whatsappLink } from "@/lib/site-config";
import styles from "./who-we-serve.module.css";

interface AudienceItem {
  id: string;
  number: string;
  title: string;
  summary: string;
  query: string;
}

const AUDIENCES: AudienceItem[] = [
  { id: "electrical-contractors", number: "01", title: "Electrical Contractors", summary: "Boards, MCBs, MCCBs and isolators.", query: "breaker" },
  { id: "solar-installers", number: "02", title: "Solar Installers", summary: "DC breakers, SPDs and changeovers.", query: "solar" },
  { id: "engineers", number: "03", title: "Engineers", summary: "Contactors, overloads, DIN-rail gear.", query: "contactor" },
  { id: "industrial-technicians", number: "04", title: "Industrial Technicians", summary: "Motor starters and phase relays.", query: "contactor" },
  { id: "businesses", number: "05", title: "Businesses", summary: "Transfer switches and surge protection.", query: "changeover" },
  { id: "retailers", number: "06", title: "Retailers", summary: "Carton lots at trade pricing.", query: "protection" },
  { id: "homeowners", number: "07", title: "Homeowners", summary: "Voltage protectors and domestic MCBs.", query: "protector" },
];

export function WhoWeServe() {
  const sectionRef = useRef<HTMLElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const leftCol = leftColRef.current;
    const stage = stageRef.current;
    if (!section || !leftCol || !stage) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const leftChildren = leftCol.querySelectorAll("[data-reveal]");
    gsap.set(leftChildren, { opacity: 0, y: 20 });
    // Only opacity on the stage — a transform here would flatten the ring's 3D context.
    gsap.set(stage, { opacity: 0 });

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        gsap
          .timeline({ defaults: { ease: "power2.out" } })
          .to(leftChildren, { opacity: 1, y: 0, duration: 0.65, stagger: 0.1 })
          .to(stage, { opacity: 1, duration: 0.7 }, "-=0.35");
        observer.disconnect();
      },
      { threshold: 0.12 }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="who-we-serve"
      aria-labelledby="who-we-serve-title"
      className="border-t border-white/10 bg-navy-900 py-16 text-offwhite sm:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
          <div ref={leftColRef} className="lg:col-span-5">
            <p data-reveal className="text-sm font-semibold uppercase tracking-widest text-ventum-blue-400">
              Who we serve
            </p>
            <h2
              id="who-we-serve-title"
              data-reveal
              className="mt-2 font-display text-display font-extrabold tracking-tight"
            >
              Built for the people who keep things running.
            </h2>
            <p data-reveal className="mt-5 max-w-md text-base leading-relaxed text-steel-200">
              Whatever you install, maintain or resell, we stock the protection
              and control gear it runs on.
            </p>

            <div data-reveal className="mt-8  flex flex-wrap items-center gap-3">
              <a
                href={whatsappLink(
                  siteConfig.whatsappNumber,
                  "Hi Ventum, I am looking for components for an upcoming project. Can we discuss specifications and availability?"
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex min-h-12 items-center gap-2 rounded-full border border-white/20 px-6 text-sm font-semibold text-offwhite transition-colors hover:border-ventum-blue-400/30 hover:bg-ventum-blue-600/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ventum-blue-400"
              >
                Talk through your specs
                <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
                  &rarr;
                </span>
              </a>

             
            </div>
          </div>

          <div ref={stageRef} className="lg:col-span-7">
            <div className={styles.stage}>
              <ul
                className={styles.ring}
                style={{ "--count": AUDIENCES.length } as CSSProperties}
              >
                {AUDIENCES.map((item, index) => (
                  <li key={item.id} className={styles.slot} style={{ "--i": index } as CSSProperties}>
                    <Link href={`/products?q=${encodeURIComponent(item.query)}`} className={styles.card}>
                      <span className={styles.number}>
                        {item.number}
                      </span>
                      <span className={styles.cardTitle}>
                        {item.title}
                      </span>
                      <span className={styles.cardSummary}>
                        {item.summary}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
