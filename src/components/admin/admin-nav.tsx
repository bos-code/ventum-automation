"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";

interface NavItem {
  href: string;
  label: string;
  icon: ReactNode;
}

const ICON = {
  strokeWidth: 1.6,
  fill: "none",
  stroke: "currentColor",
  viewBox: "0 0 24 24",
  "aria-hidden": true as const,
  className: "h-5 w-5 shrink-0",
};

const NAV: NavItem[] = [
  {
    href: "/admin",
    label: "Dashboard",
    icon: (
      <svg {...ICON}>
        <path d="M4 13h6V4H4zM14 20h6v-9h-6zM4 20h6v-3H4zM14 7h6V4h-6z" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    href: "/admin/products",
    label: "Products",
    icon: (
      <svg {...ICON}>
        <path d="M20 7 12 3 4 7m16 0-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    href: "/admin/enquiries",
    label: "Enquiries",
    icon: (
      <svg {...ICON}>
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    href: "/admin/settings",
    label: "Settings",
    icon: (
      <svg {...ICON}>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1" strokeLinejoin="round" />
      </svg>
    ),
  },
];

function useIsActive() {
  const pathname = usePathname();
  return (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
}

/** Sidebar for wide screens — the adaptive counterpart to the drawer. */
export function AdminSidebarNav() {
  const isActive = useIsActive();

  return (
    <nav aria-label="Admin" className="hidden lg:block">
      <ul className="space-y-1">
        {NAV.map((item) => {
          const active = isActive(item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ventum-blue-500 ${
                  active
                    ? "bg-navy-950 text-white"
                    : "text-steel-700 hover:bg-mist-100 hover:text-navy-950"
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/**
 * Phone navigation: a menu button in the admin header that opens a slide-in
 * drawer. The drawer is the only nav surface below `lg`, so it also carries
 * sign out, which the header hides at that width to keep the bar uncluttered.
 *
 * Button, scrim and drawer ship as one fragment so the open state stays local.
 * The admin header sets no backdrop-filter or transform, so the fixed children
 * still resolve against the viewport rather than the header box.
 */
export function AdminMobileNav({ signOut }: { signOut: () => Promise<void> }) {
  const [open, setOpen] = useState(false);
  const isActive = useIsActive();

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
      <button
        type="button"
        aria-expanded={open}
        aria-controls="admin-mobile-nav"
        aria-label="Open menu"
        onClick={() => setOpen(true)}
        className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-navy-950/15 text-navy-950 transition-colors hover:bg-mist-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ventum-blue-500 lg:hidden"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          aria-hidden="true"
          className="h-6 w-6"
        >
          <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
      </button>

      <div
        aria-hidden="true"
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-40 bg-navy-950/50 transition-opacity duration-300 motion-reduce:transition-none lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* inert keeps the links out of the tab order while closed, so the
          drawer can stay mounted and animate in both directions. */}
      <nav
        id="admin-mobile-nav"
        aria-label="Admin"
        inert={!open}
        className={`fixed right-0 top-0 z-50 flex h-dvh w-[min(82vw,320px)] flex-col border-l border-navy-950/10 bg-white px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-4 shadow-xl transition-transform duration-300 ease-out motion-reduce:transition-none lg:hidden ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-steel-500">
            Menu
          </span>
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl text-steel-700 transition-colors hover:bg-mist-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ventum-blue-500"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              aria-hidden="true"
              className="h-6 w-6"
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <ul className="mt-4 flex flex-col gap-1 border-t border-navy-950/10 pt-4">
          {NAV.map((item) => {
            const active = isActive(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  onClick={() => setOpen(false)}
                  className={`flex min-h-12 items-center gap-3 rounded-xl px-3 text-base font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ventum-blue-500 ${
                    active
                      ? "bg-navy-950 text-white"
                      : "text-steel-700 hover:bg-mist-100 hover:text-navy-950"
                  }`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <form action={signOut} className="mt-auto border-t border-navy-950/10 pt-4">
          <button
            type="submit"
            className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-navy-950/15 text-sm font-semibold text-steel-700 transition-colors hover:border-ventum-red-600 hover:text-ventum-red-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ventum-blue-500"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.6}
              aria-hidden="true"
              className="h-4 w-4"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" strokeLinejoin="round" />
            </svg>
            Sign out
          </button>
        </form>
      </nav>
    </>
  );
}
