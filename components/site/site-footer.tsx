import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Logo } from "./logo";
import type { Settings } from "@/types";
import { BUSINESS } from "@/lib/constants";
import { toWhatsAppDigits } from "@/lib/utils";

export function SiteFooter({ settings }: { settings: Settings }) {
  const year = new Date().getFullYear();
  const whatsapp = `https://wa.me/${toWhatsAppDigits(settings.whatsapp)}`;

  return (
    <footer className="mt-auto bg-white text-[#111322]">
      <div className="ventum-shell py-10 sm:py-14 lg:py-16">
        <div className="grid gap-10 border-b border-[#d9dbe4] pb-10 lg:grid-cols-[1.15fr_.85fr] lg:items-end lg:pb-14">
          <div>
            <Logo />
            <h2 className="mt-8 max-w-[12ch] text-3xl font-semibold leading-[1.02] tracking-[-0.035em] sm:text-5xl">
              Source the right component. Speak directly with the sales desk.
            </h2>
          </div>
          <div className="lg:justify-self-end">
            <p className="max-w-md text-sm leading-7 text-[#656879]">
              {settings.tagline}
            </p>
            <a
              href={whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex min-h-12 items-center gap-3 bg-[#06065c] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#03033b]"
            >
              Start an enquiry <ArrowUpRight size={17} />
            </a>
          </div>
        </div>

        <div className="grid gap-x-8 gap-y-10 py-10 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1.25fr] lg:py-12">
          <FooterGroup title="Catalogue">
            <FooterLink href="/products">All products</FooterLink>
            <FooterLink href="/#categories">Categories</FooterLink>
            <FooterLink href="/#brands">Brands</FooterLink>
          </FooterGroup>

          <FooterGroup title="Company">
            <FooterLink href="/#about">About Ventum</FooterLink>
            <FooterLink href="/#contact">Contact</FooterLink>
            <FooterLink href="/products">Product catalogue</FooterLink>
          </FooterGroup>

          <div>
            <p className="text-sm font-semibold text-[#06065c]">Sales desk</p>
            <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
              <FooterContact label="Visit" value={settings.address} />
              <FooterContact
                label="WhatsApp"
                value={settings.phone || settings.whatsapp}
                href={whatsapp}
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

        <div className="grid gap-3 border-t border-[#d9dbe4] pt-6 text-xs text-[#656879] sm:grid-cols-[1fr_auto] sm:items-center">
          <p>
            &copy; {year} {settings.legalName}. RC {BUSINESS.rc}. Trading as {settings.businessName}.
          </p>
          <p>Lagos, Nigeria</p>
        </div>
      </div>
    </footer>
  );
}

function FooterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-sm font-semibold text-[#06065c]">{title}</p>
      <div className="mt-4 flex flex-col">{children}</div>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="group flex min-h-11 items-center justify-between border-b border-[#e1e2e7] text-sm font-medium text-[#555967] transition-colors hover:text-[#06065c]"
    >
      {children}
      <ArrowUpRight
        size={15}
        className="text-[#ed0101] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
      />
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
      <span className="block text-xs font-medium text-[#777a88]">{label}</span>
      <span className="mt-1.5 block break-words text-sm leading-6 text-[#555967]">
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
      className="block transition-colors hover:[&_span:last-child]:text-[#06065c]"
    >
      {content}
    </a>
  );
}
