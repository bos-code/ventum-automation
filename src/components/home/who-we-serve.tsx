"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { siteConfig, whatsappLink } from "@/lib/site-config";
import styles from "./who-we-serve.module.css";

interface AudienceItem {
  id: string;
  title: string;
  query: string;
  /** Optional backdrop photo. Cards without one keep the plain frosted panel. */
  image?: string;
}

const AUDIENCES: AudienceItem[] = [
  { id: "electrical-contractors", title: "Electrical Contractors", query: "breaker" },
  { id: "solar-installers", title: "Solar Installers", query: "solar", image: "/audiences/solar-installers.jpeg" },
  { id: "engineers", title: "Engineers", query: "contactor", image: "/audiences/engineers.jpeg" },
  { id: "industrial-technicians", title: "Industrial Technicians", query: "contactor", image: "/audiences/industrial-technicians.jpeg" },
  { id: "businesses", title: "Businesses", query: "changeover", image: "/audiences/businesses.jpeg" },
  { id: "retailers", title: "Retailers", query: "protection", image: "/audiences/retailers.jpeg" },
  { id: "homeowners", title: "Homeowners", query: "protector" },
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
                      <span className={styles.cardTitle}>{item.title}</span>
                      <span className={styles.cardMedia}>
                        {item.image && (
                          /* Decorative: the title above already names the audience. */
                          <Image
                            src={item.image}
                            alt=""
                            fill
                            sizes="(min-width: 1024px) 240px, (min-width: 640px) 214px, 172px"
                            className={styles.cardImage}
                          />
                        )}
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
