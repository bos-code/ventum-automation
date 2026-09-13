"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { navLinks, whatsappLink } from "@/lib/site-config";
import type { Settings } from "@/lib/types";

const ENQUIRY_MESSAGE = "Hi Ventum, I'd like to enquire about a product.";

export function SiteHeader({ settings }: { settings: Settings }) {
  const [open, setOpen] = useState(false);
  const waLink = whatsappLink(settings.whatsapp, ENQUIRY_MESSAGE);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-navy-950/95 backdrop-blur">
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
            priority
          />
          <span className="hidden font-display text-lg font-bold tracking-tight text-offwhite sm:inline">
            Ventum
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden md:flex md:items-center md:gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-sm text-sm font-medium text-steel-200 transition-colors hover:text-offwhite focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ventum-blue-500"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden h-11 items-center rounded-full bg-ventum-red-600 px-5 text-sm font-semibold text-offwhite transition-colors hover:bg-ventum-red-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ventum-blue-500 sm:inline-flex"
          >
            WhatsApp Us
          </a>

          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-md text-offwhite focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ventum-blue-500 md:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <XIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {open && (
        <nav
          id="mobile-nav"
          aria-label="Primary"
          className="border-t border-white/10 bg-navy-950 px-4 pb-6 pt-2 md:hidden"
        >
          <ul className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-md px-3 py-3 text-base font-medium text-offwhite hover:bg-white/5 focus-visible:outline-2 focus-visible:outline-ventum-blue-500"
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
            className="mt-4 flex h-12 items-center justify-center rounded-full bg-ventum-red-600 text-base font-semibold text-offwhite focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ventum-blue-500"
          >
            WhatsApp Us
          </a>
        </nav>
      )}
    </header>
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
