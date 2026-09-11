import Link from "next/link";
import { ArrowUpRight, MapPin, Phone } from "lucide-react";
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
    <header className="sticky top-0 z-40 border-b border-[#d9dbe4] bg-white/96 text-[#111322] backdrop-blur-md">
      <div className="bg-[#06065c] text-white">
        <div className="ventum-shell flex min-h-9 items-center justify-between gap-4 py-1.5">
          <p className="ventum-technical-label text-white/72">
            Electrical · Automation · Protection
          </p>
          <div className="hidden items-center gap-5 text-[10px] font-bold uppercase tracking-[0.12em] text-white/62 md:flex">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="size-3" aria-hidden="true" />
              Alaba International Market, Lagos
            </span>
            {settings.phone ? (
              <a href={`tel:${settings.phone}`} className="inline-flex items-center gap-1.5 transition-colors hover:text-white">
                <Phone className="size-3" aria-hidden="true" />
                {settings.phone}
              </a>
            ) : null}
          </div>
        </div>
      </div>

      <div className="ventum-shell flex h-[76px] items-center justify-between gap-5">
        <Logo className="text-[#06065c]" />

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary navigation">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group relative px-4 py-3 text-[11px] font-extrabold uppercase tracking-[0.13em] text-[#36394a] transition-colors hover:text-[#06065c]"
            >
              {item.label}
              <span className="absolute inset-x-4 bottom-1 h-0.5 origin-left scale-x-0 bg-[#ed0101] transition-transform group-hover:scale-x-100" />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <WhatsAppLink
            number={settings.whatsapp}
            size="sm"
            variant="secondary"
            className="hidden h-11 rounded-[2px] border-0 bg-[#ed0101] px-5 text-[11px] font-extrabold uppercase tracking-[0.11em] text-white hover:bg-[#c90000] sm:inline-flex"
          >
            Talk to sales
            <ArrowUpRight className="size-3.5" aria-hidden="true" />
          </WhatsAppLink>
          <div className="lg:hidden">
            <MobileNav items={NAV_ITEMS} />
          </div>
        </div>
      </div>
    </header>
  );
}
