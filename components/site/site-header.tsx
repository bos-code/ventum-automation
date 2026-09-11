import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Logo } from "./logo";
import { MobileNav } from "./mobile-nav";
import { WhatsAppLink } from "./whatsapp-link";
import type { Settings } from "@/types";

const NAV_ITEMS = [
  { href: "/products", label: "Products" },
  { href: "/#categories", label: "Categories" },
  { href: "/#about", label: "About" },
  { href: "/#contact", label: "Contact" },
];

export function SiteHeader({ settings }: { settings: Settings }) {
  return (
    <header className="sticky top-0 z-40 border-b border-[#d9dbe4]/80 bg-white/96 text-[#111322] backdrop-blur-md">
      <div className="hidden border-b border-[#e9e9ed] bg-[#f7f7f5] sm:block">
        <div className="ventum-shell flex min-h-9 items-center justify-between gap-6 text-[11px] text-[#656879]">
          <p className="font-medium uppercase tracking-[0.08em]">Electrical & automation supply</p>
          <div className="flex items-center gap-6">
            <span className="hidden md:inline">Alaba International Market, Lagos</span>
            {settings.phone && (
              <a href={`tel:${settings.phone}`} className="py-2 font-medium text-[#111322] transition-colors hover:text-[#ed0101]">
                {settings.phone}
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="ventum-shell flex h-[76px] items-center justify-between gap-5 sm:h-[84px]">
        <Logo />

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary navigation">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="relative py-5 text-[13px] font-semibold text-[#2b2e3b] transition-colors after:absolute after:bottom-3 after:left-0 after:h-px after:w-0 after:bg-[#ed0101] after:transition-all hover:text-[#06065c] hover:after:w-full"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <WhatsAppLink
            number={settings.whatsapp}
            size="sm"
            className="hidden min-h-11 rounded-none bg-[#06065c] px-5 text-[13px] font-semibold text-white hover:bg-[#03033b] sm:inline-flex"
          >
            Contact sales <ArrowUpRight size={15} className="ml-1" />
          </WhatsAppLink>
          <MobileNav items={NAV_ITEMS} />
        </div>
      </div>
    </header>
  );
}
