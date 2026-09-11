import Link from "next/link";
import { Logo } from "./logo";
import { MobileNav } from "./mobile-nav";
import { WhatsAppLink } from "./whatsapp-link";
import type { Settings } from "@/types";

const NAV_ITEMS = [
  { href: "/products", label: "Catalogue" },
  { href: "/#categories", label: "Categories" },
  { href: "/#about", label: "Company" },
  { href: "/#contact", label: "Contact" },
];

export function SiteHeader({ settings }: { settings: Settings }) {
  return (
    <header className="sticky top-0 z-40 border-b border-[#d9dbe4] bg-white text-[#111322]">
      <div className="bg-[#06065c] text-white">
        <div className="ventum-shell flex min-h-9 items-center justify-between gap-4 py-1.5">
          <p className="font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-white/58">
            VGA_SYS / Electrical · Automation · Protection
          </p>
          <div className="hidden items-center gap-6 font-mono text-[9px] font-bold uppercase tracking-[0.12em] text-white/45 md:flex">
            <span>Alaba International Market · Lagos</span>
            {settings.phone ? (
              <a href={`tel:${settings.phone}`} className="transition-colors hover:text-white">
                Sales {settings.phone}
              </a>
            ) : null}
          </div>
        </div>
      </div>

      <div className="ventum-shell grid h-[76px] grid-cols-[1fr_auto] items-center gap-4 lg:grid-cols-[minmax(220px,.8fr)_1fr_auto]">
        <Logo className="text-[#06065c]" />

        <nav className="hidden h-full items-center justify-center lg:flex" aria-label="Primary navigation">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group relative inline-flex h-full items-center px-4 text-[10px] font-extrabold uppercase tracking-[0.13em] text-[#454858] transition-colors hover:text-[#06065c]"
            >
              {item.label}
              <span className="absolute inset-x-4 bottom-0 h-[2px] origin-left scale-x-0 bg-[#ed0101] transition-transform group-hover:scale-x-100" />
            </Link>
          ))}
        </nav>

        <div className="flex items-center justify-end gap-2">
          <WhatsAppLink
            number={settings.whatsapp}
            size="sm"
            variant="secondary"
            className="hidden h-11 rounded-[1px] border-0 bg-[#ed0101] px-5 text-[10px] font-extrabold uppercase tracking-[0.12em] text-white hover:bg-[#c90000] sm:inline-flex"
          >
            Contact sales <span aria-hidden="true">↗</span>
          </WhatsAppLink>
          <MobileNav items={NAV_ITEMS} />
        </div>
      </div>
    </header>
  );
}
