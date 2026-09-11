"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface NavItem {
  href: string;
  label: string;
}

export function MobileNav({ items }: { items: NavItem[] }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const [prevPathname, setPrevPathname] = useState(pathname);

  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
    };
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex h-11 min-w-11 items-center justify-center border border-[#d9dbe4] bg-white px-3 text-[#06065c] transition-colors hover:border-[#06065c]"
        aria-label="Open navigation"
        aria-expanded={open}
      >
        <span className="flex w-5 flex-col gap-1.5" aria-hidden="true">
          <span className="h-px w-full bg-current" />
          <span className="h-px w-full bg-current" />
          <span className="h-px w-3/4 bg-current" />
        </span>
      </button>

      {open ? (
        <div className="fixed inset-0 z-50">
          <button
            type="button"
            aria-label="Close navigation"
            className="absolute inset-0 bg-[#020222]/75"
            onClick={() => setOpen(false)}
          />

          <nav className="absolute inset-y-0 right-0 flex w-[min(92vw,420px)] flex-col border-l border-white/10 bg-[#06065c] text-white shadow-2xl">
            <div className="flex h-20 items-center justify-between border-b border-white/12 px-5">
              <div>
                <p className="font-[var(--font-display)] text-lg font-bold uppercase tracking-[-0.02em]">Ventum</p>
                <p className="mt-1 font-mono text-[8px] font-bold uppercase tracking-[0.2em] text-white/45">Global Automation</p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="grid size-11 place-items-center border border-white/20 text-white"
                aria-label="Close navigation"
              >
                <span className="relative block size-4" aria-hidden="true">
                  <span className="absolute left-0 top-1/2 h-px w-full rotate-45 bg-current" />
                  <span className="absolute left-0 top-1/2 h-px w-full -rotate-45 bg-current" />
                </span>
              </button>
            </div>

            <div className="border-b border-white/12 px-5 py-4">
              <p className="font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-white/40">
                Navigation / Ventum system
              </p>
            </div>

            <div className="flex-1">
              {items.map((item, index) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group grid grid-cols-[44px_1fr_auto] items-center border-b border-white/12 px-5 py-5 text-white transition-colors hover:bg-white hover:text-[#06065c]",
                    pathname === item.href && "bg-white text-[#06065c]",
                  )}
                >
                  <span className="font-mono text-[9px] font-bold text-current/45">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="font-[var(--font-display)] text-2xl font-bold tracking-[-0.02em]">{item.label}</span>
                  <span className="text-lg text-[#ed0101]" aria-hidden="true">↗</span>
                </Link>
              ))}
            </div>

            <div className="border-t border-white/12 p-5">
              <p className="font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-white/38">Lagos · Nigeria</p>
              <p className="mt-2 max-w-[16rem] text-xs leading-5 text-white/55">Electrical protection, control and automation supply.</p>
            </div>
          </nav>
        </div>
      ) : null}
    </div>
  );
}
