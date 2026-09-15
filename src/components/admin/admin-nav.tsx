"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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

/** Sidebar for wide screens — the adaptive counterpart to the bottom bar. */
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
 * Bottom bar for phones. Four destinations, so it stays inside the
 * five-item limit, and each target clears 44px with icon + label.
 */
export function AdminBottomNav() {
  const isActive = useIsActive();

  return (
    <nav
      aria-label="Admin"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-navy-950/10 bg-white/95 backdrop-blur pb-[env(safe-area-inset-bottom)] lg:hidden"
    >
      <ul className="mx-auto flex max-w-lg">
        {NAV.map((item) => {
          const active = isActive(item.href);
          return (
            <li key={item.href} className="flex-1">
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`flex min-h-14 flex-col items-center justify-center gap-1 px-1 text-[11px] font-semibold transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ventum-blue-500 ${
                  active ? "text-ventum-blue-700" : "text-steel-600"
                }`}
              >
                {/* Active state is carried by weight and a bar, not colour alone. */}
                <span
                  aria-hidden="true"
                  className={`h-0.5 w-6 rounded-full transition-colors ${
                    active ? "bg-ventum-blue-600" : "bg-transparent"
                  }`}
                />
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
