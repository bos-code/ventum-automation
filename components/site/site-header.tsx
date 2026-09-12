import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Logo } from "./logo";
import { MobileNav } from "./mobile-nav";
import { WhatsAppLink } from "./whatsapp-link";
import type { Settings } from "@/types";

const NAV_ITEMS = [
  { href: "/products", label: "Products" },
  { href: "/#categories", label: "Categories" },
  { href: "/#brands", label: "Brands" },
  { href: "/#about", label: "About" },
];

export function SiteHeader({ settings }: { settings: Settings }) {
  return (
    <header className="sticky top-0 z-40 border-b border-[#d9dbe4]/85 bg-white/96 text-[#111322] backdrop-blur-md">
      <div className="ventum-shell flex h-[72px] items-center justify-between gap-5 sm:h-[78px]">
        <Logo />

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary navigation">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="relative py-5 text-[14px] font-semibold text-[#2b2e3b] transition-colors after:absolute after:bottom-3 after:left-0 after:h-px after:w-0 after:bg-[#ed0101] after:transition-all hover:text-[#06065c] hover:after:w-full"
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
            WhatsApp sales <ArrowUpRight size={15} className="ml-1" />
          </WhatsAppLink>
          <MobileNav items={NAV_ITEMS} />
        </div>
      </div>
    </header>
  );
}
