"use client";

import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";

/**
 * Restrained scroll-reveal: a single fade + slight rise, once, per §11
 * ("controlled GSAP-style reveals", not bouncing/springs/looping).
 * Skipped entirely under prefers-reduced-motion — content just renders
 * at full opacity with no animation, per the global reduced-motion rule.
 */
export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    gsap.set(el, { opacity: 0, y: 24 });

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        gsap.to(el, {
          opacity: 1,
          y: 0,
          duration: 0.7,
          delay,
          ease: "power2.out",
        });
        observer.disconnect();
      },
      { threshold: 0.15 }
    );
    observer.observe(el);

    return () => observer.disconnect();
  }, [delay]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
