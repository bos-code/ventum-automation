import Link from "next/link";
import { Logo } from "./logo";
import { MobileNav } from "./mobile-nav";
import { WhatsAppLink } from "./whatsapp-link";
import type { Settings } from "@/types";

const NAV_ITEMS = [
  { href: "/products", label: "Products" },
  { href: "/#categories", label: "Categories" },
  { href: "/#about", label: "Company" },
  { href: "/#contact", label: "Contact" },
];

export function SiteHeader({ settings }: { settings: Settings }) {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#06065c] text-white shadow-[0_1px_0_rgba(255,255,255,0.05)]">
      <div className="border-b border-white/10 bg-[#05054f]">
        <div className="ventum-shell flex min-h-8 items-center justify-between gap-4 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white/60">
          <span>Electrical • Automation • Protection</span>
          <span className="hidden sm:inline">Alaba International Market, Lagos</span>
        </div>
      </div>

      <div className="ventum-shell flex h-[72px] items-center justify-between gap-4">
        <Logo className="text-white" />

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="px-3 py-2 text-xs font-bold uppercase tracking-[0.1em] text-white/72 transition-colors hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <WhatsAppLink
            number={settings.whatsapp}
            size="sm"
            variant="secondary"
            className="hidden rounded-sm border border-white/15 bg-[#ed0101] font-bold text-white hover:bg-[#ca0000] sm:inline-flex"
          >
            Contact sales
          </WhatsAppLink>
          <div className="lg:hidden">
            <MobileNav items={NAV_ITEMS} />
          </div>
        </div>
      </div>
    </header>
  );
}
