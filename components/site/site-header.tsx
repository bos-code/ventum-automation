import Link from "next/link";
import { Logo } from "./logo";
import { MobileNav } from "./mobile-nav";
import { WhatsAppLink } from "./whatsapp-link";
import type { Settings } from "@/types";

const NAV_ITEMS = [
  { href: "/products", label: "Products" },
  { href: "/#categories", label: "Categories" },
  { href: "/#about", label: "About us" },
  { href: "/#contact", label: "Contact" },
];

export function SiteHeader({ settings }: { settings: Settings }) {
  return (
    <header className="sticky top-0 z-40 border-b border-[#d9dbe4] bg-white text-[#111322]">
      <div className="hidden bg-[#f2f2f2] sm:block">
        <div className="ventum-shell flex min-h-9 items-center justify-between gap-4 text-xs text-[#656879]">
          <p>Electrical & automation supply</p>
          <div className="flex items-center gap-6">
            <span className="hidden md:inline">
              Alaba International Market, Lagos
            </span>
            {settings.phone && (
              <a
                href={`tel:${settings.phone}`}
                className="py-2 hover:text-[#06065c]"
              >
                {settings.phone}
              </a>
            )}
          </div>
        </div>
      </div>
      <div className="ventum-shell flex h-20 items-center justify-between gap-4">
        <Logo className="text-[#06065c]" />
        <nav
          className="hidden items-center gap-8 lg:flex"
          aria-label="Primary navigation"
        >
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="py-4 text-sm font-medium transition-colors hover:text-[#ed0101]"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <WhatsAppLink
            number={settings.whatsapp}
            size="sm"
            className="hidden min-h-11 rounded-none bg-[#06065c] px-5 text-sm text-white hover:bg-[#03033b] sm:inline-flex"
          >
            Contact sales
          </WhatsAppLink>
          <MobileNav items={NAV_ITEMS} />
        </div>
      </div>
    </header>
  );
}
