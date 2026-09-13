import Image from "next/image";
import Link from "next/link";
import { navLinks, siteConfig, whatsappLink } from "@/lib/site-config";
import type { Settings } from "@/lib/types";

export function SiteFooter({ settings }: { settings: Settings }) {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-navy-950 text-offwhite">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
        <div>
          <div className="flex items-center gap-2">
            <Image
              src="/brand/ventum-mark.png"
              alt={settings.businessName}
              width={36}
              height={36}
              className="h-9 w-9"
            />
            <span className="font-display text-base font-bold tracking-tight">
              {settings.businessName}
            </span>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-steel-200">
            {settings.tagline}. {siteConfig.description}
          </p>
        </div>

        <nav aria-label="Footer" className="md:justify-self-center">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-steel-200">
            Navigate
          </h2>
          <ul className="mt-4 flex flex-col gap-3">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="rounded-sm text-sm text-offwhite/90 hover:text-offwhite focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ventum-blue-500"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="md:justify-self-end">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-steel-200">
            Get in touch
          </h2>
          <ul className="mt-4 flex flex-col gap-3 text-sm text-offwhite/90">
            <li>
              <a
                href={whatsappLink(settings.whatsapp)}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-sm hover:text-offwhite focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ventum-blue-500"
              >
                WhatsApp: {settings.phone}
              </a>
            </li>
            <li>
              <a
                href={`tel:${settings.secondaryPhone}`}
                className="rounded-sm hover:text-offwhite focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ventum-blue-500"
              >
                Phone: {settings.secondaryPhone}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${settings.email}`}
                className="rounded-sm hover:text-offwhite focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ventum-blue-500"
              >
                {settings.email}
              </a>
            </li>
            <li className="text-offwhite/70">{settings.address}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-xs text-steel-200 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>
            &copy; {year} {settings.legalName}. RC: {siteConfig.rcNumber}.
          </p>
          <p>All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
