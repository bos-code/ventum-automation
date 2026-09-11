import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { Logo } from "./logo";
import type { Settings } from "@/types";
import { BUSINESS } from "@/lib/constants";
import { toWhatsAppDigits } from "@/lib/utils";

export function SiteFooter({ settings }: { settings: Settings }) {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-border bg-muted/30">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-3">
          <Logo />
          <p className="text-sm text-muted-foreground">{settings.tagline}</p>
        </div>

        <div className="space-y-2 text-sm">
          <h2 className="font-semibold text-foreground">Catalogue</h2>
          <ul className="space-y-1.5 text-muted-foreground">
            <li>
              <Link href="/products" className="hover:text-foreground">
                All products
              </Link>
            </li>
            <li>
              <Link href="/#categories" className="hover:text-foreground">
                Categories
              </Link>
            </li>
            <li>
              <Link href="/#brands" className="hover:text-foreground">
                Brands we sell
              </Link>
            </li>
          </ul>
        </div>

        <div className="space-y-2 text-sm">
          <h2 className="font-semibold text-foreground">Company</h2>
          <ul className="space-y-1.5 text-muted-foreground">
            <li>
              <Link href="/#about" className="hover:text-foreground">
                About Ventum
              </Link>
            </li>
            <li>
              <Link href="/#contact" className="hover:text-foreground">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        <div className="space-y-2 text-sm">
          <h2 className="font-semibold text-foreground">Get in touch</h2>
          <ul className="space-y-2 text-muted-foreground">
            <li className="flex gap-2">
              <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              <span>{settings.address}</span>
            </li>
            <li className="flex gap-2">
              <Phone className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              <a
                href={`https://wa.me/${toWhatsAppDigits(settings.whatsapp)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground"
              >
                {settings.phone} (WhatsApp)
              </a>
            </li>
            <li className="flex gap-2">
              <Phone className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              <a href={`tel:${settings.secondaryPhone}`} className="hover:text-foreground">
                {settings.secondaryPhone}
              </a>
            </li>
            <li className="flex gap-2">
              <Mail className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              <a href={`mailto:${settings.email}`} className="hover:text-foreground">
                {settings.email}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto max-w-6xl px-4 py-5 text-xs text-muted-foreground">
          <p>
            &copy; {year} {settings.legalName}. RC {BUSINESS.rc}. Trading as{" "}
            {settings.businessName}.
          </p>
        </div>
      </div>
    </footer>
  );
}
