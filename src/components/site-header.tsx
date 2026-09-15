"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { navLinks, whatsappLink } from "@/lib/site-config";
import { useEnquiry } from "@/components/enquiry/enquiry-context";
import type { Settings } from "@/lib/types";

const ENQUIRY_MESSAGE = "Hi Ventum, I'd like to enquire about a product.";

export function SiteHeader({ settings }: { settings: Settings }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isActive = (href: string) => href === "/" ? pathname === href : pathname.startsWith(href);
  const waLink = whatsappLink(settings.whatsapp, ENQUIRY_MESSAGE);
  const { totalItems, setDrawerOpen } = useEnquiry();

  // Close on Escape and hold the page still while the drawer is over it.
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-white/10 bg-navy-950/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="flex shrink-0 items-center gap-2 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ventum-blue-500"
            onClick={() => setOpen(false)}
          >
            <Image
              src="/brand/ventum-mark.png"
              alt={settings.businessName}
              width={40}
              height={40}
              className="h-10 w-10"
              preload={true}
            />
            <span className="font-display text-lg font-bold tracking-tight text-offwhite hidden sm:block">
            Ventum Global Automation LTD
            </span>
          </Link>

          <nav aria-label="Primary" className="hidden md:flex md:items-center md:gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive(link.href) ? "page" : undefined}
                className="rounded-sm text-sm font-medium text-steel-200 transition-colors hover:text-offwhite aria-[current=page]:text-white aria-[current=page]:underline aria-[current=page]:decoration-ventum-red-500 aria-[current=page]:underline-offset-8 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ventum-blue-500"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setDrawerOpen(true)}
              className="relative inline-flex h-11 items-center justify-center rounded-full bg-white/5 px-4 text-sm font-semibold text-offwhite transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ventum-blue-500"
            >
              Enquiry List
              {totalItems > 0 && (
                <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-ventum-red-600 text-[10px] font-bold text-white">
                  {totalItems}
                </span>
              )}
            </button>

            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden h-11 items-center rounded-full bg-ventum-red-600 px-5 text-sm font-semibold text-offwhite transition-colors hover:bg-ventum-red-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ventum-blue-500 lg:inline-flex"
            >
              WhatsApp Us
            </a>

            <button
              type="button"
              className="inline-flex h-11 w-11 items-center justify-center rounded-md text-offwhite focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ventum-blue-500 md:hidden"
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label="Open menu"
              onClick={() => setOpen(true)}
            >
              <MenuIcon />
            </button>
          </div>
        </div>
      </header>

      {/* Scrim and drawer sit OUTSIDE <header>: its backdrop-blur creates a
          containing block for fixed descendants, which trapped the drawer in
          the header box and let the page scroll sideways into it. */}
      <div
        aria-hidden="true"
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-40 bg-navy-950/60 backdrop-blur-sm transition-opacity duration-300 motion-reduce:transition-none md:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Translucent side drawer. inert keeps its links out of the tab order
          while closed, so it can stay mounted and animate both ways. */}
      <nav
        id="mobile-nav"
        aria-label="Primary"
        inert={!open}
        className={`fixed right-0 top-0 z-50 flex h-dvh w-[min(82vw,320px)] flex-col border-l border-white/12 bg-navy-950/80 px-4 pb-6 pt-4 backdrop-blur-xl transition-transform duration-300 ease-out motion-reduce:transition-none md:hidden ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-steel-400">
            Menu
          </span>
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-md text-offwhite focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ventum-blue-500"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          >
            <XIcon />
          </button>
        </div>

        <ul className="mt-4 flex flex-col gap-1 border-t border-white/10 pt-4">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-current={isActive(link.href) ? "page" : undefined}
                onClick={() => setOpen(false)}
                className="block rounded-md px-3 py-3 text-base font-medium text-offwhite transition-colors hover:bg-white/5 aria-[current=page]:text-white aria-[current=page]:underline aria-[current=page]:decoration-ventum-red-500 aria-[current=page]:underline-offset-8 focus-visible:outline-2 focus-visible:outline-ventum-blue-500"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto flex h-12 items-center justify-center rounded-full bg-ventum-red-600 text-base font-semibold text-offwhite transition-colors hover:bg-ventum-red-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ventum-blue-500"
        >
          WhatsApp Us
        </a>
      </nav>
    </>
  );
}

function MenuIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      className="h-6 w-6"
      aria-hidden="true"
    >
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      className="h-6 w-6"
      aria-hidden="true"
    >
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}
