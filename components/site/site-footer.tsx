import Link from "next/link";
import { Logo } from "./logo";
import type { Settings } from "@/types";
import { BUSINESS } from "@/lib/constants";
import { toWhatsAppDigits } from "@/lib/utils";

export function SiteFooter({ settings }: { settings: Settings }) {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-white/12 bg-[#03033b] text-white">
      <div className="ventum-shell">
        <div className="grid grid-cols-2 border-x border-white/12 lg:grid-cols-[1.15fr_.85fr_.85fr_1.15fr]">
          <div className="col-span-2 border-b border-white/12 p-6 sm:p-8 lg:col-span-1 lg:border-b-0 lg:border-r">
            <Logo className="text-white" />
            <p className="mt-6 max-w-sm text-sm leading-7 text-white/55">
              {settings.tagline}
            </p>
            <p className="mt-8 font-mono text-xs font-bold uppercase tracking-[0.14em] text-white/60">
              Electrical · Automation · Protection
            </p>
          </div>

          <FooterGroup title="Catalogue">
            <FooterLink href="/products">All products</FooterLink>
            <FooterLink href="/#categories">Categories</FooterLink>
            <FooterLink href="/#brands">Brands</FooterLink>
          </FooterGroup>

          <FooterGroup title="Company">
            <FooterLink href="/#about">About Ventum</FooterLink>
            <FooterLink href="/#contact">Contact</FooterLink>
            <FooterLink href="/products">Request a product</FooterLink>
          </FooterGroup>

          <div className="col-span-2 border-b border-white/12 p-6 sm:p-8 lg:col-span-1 lg:border-b-0 lg:border-l">
            <p className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-white/60">
              Sales desk
            </p>
            <div className="mt-5 space-y-5">
              <FooterContact label="Address" value={settings.address} />
              <FooterContact
                label="WhatsApp"
                value={settings.phone || settings.whatsapp}
                href={`https://wa.me/${toWhatsAppDigits(settings.whatsapp)}`}
                external
              />
              {settings.secondaryPhone ? (
                <FooterContact
                  label="Phone"
                  value={settings.secondaryPhone}
                  href={`tel:${settings.secondaryPhone}`}
                />
              ) : null}
              <FooterContact
                label="Email"
                value={settings.email}
                href={`mailto:${settings.email}`}
              />
            </div>
          </div>
        </div>

        <div className="grid gap-4 border-x border-t border-white/12 px-6 py-5 font-mono text-xs font-bold uppercase tracking-[0.12em] text-white/60 sm:px-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <p>
            &copy; {year} {settings.legalName}. RC {BUSINESS.rc}. Trading as{" "}
            {settings.businessName}.
          </p>
          <p>Lagos, Nigeria</p>
        </div>
      </div>
    </footer>
  );
}

function FooterGroup({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-white/12 p-6 sm:p-8 lg:border-b-0 lg:border-r">
      <p className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-white/60">
        {title}
      </p>
      <div className="mt-5 flex flex-col">{children}</div>
    </div>
  );
}

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="group flex min-h-11 items-center justify-between border-b border-white/10 text-sm font-semibold text-white/68 transition-colors hover:text-white"
    >
      {children}
      <span
        className="text-[#ed0101] transition-transform group-hover:translate-x-0.5"
        aria-hidden="true"
      >
        ↗
      </span>
    </Link>
  );
}

function FooterContact({
  label,
  value,
  href,
  external = false,
}: {
  label: string;
  value: string;
  href?: string;
  external?: boolean;
}) {
  const content = (
    <>
      <span className="block font-mono text-xs font-bold uppercase tracking-[0.12em] text-white/60">
        {label}
      </span>
      <span className="mt-1 block text-sm leading-6 text-white/68">
        {value}
      </span>
    </>
  );

  if (!href) return <div>{content}</div>;

  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="block transition-colors hover:[&_span:last-child]:text-white"
    >
      {content}
    </a>
  );
}
