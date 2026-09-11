import { ArrowUpRight } from "lucide-react";
import { WhatsAppLink } from "@/components/site/whatsapp-link";
import type { Settings } from "@/types";

export function Contact({ settings }: { settings: Settings }) {
  return (
    <section id="contact" className="bg-[#08082f] py-14 text-white sm:py-20">
      <div className="ventum-shell grid gap-12 lg:grid-cols-[1.2fr_.8fr] lg:gap-20">
        <div>
          <p className="text-sm text-white/65">Let’s find your equipment</p>
          <h2 className="mt-4 max-w-xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
            Have a model in mind?
          </h2>
          <p className="mt-5 max-w-md text-base leading-7 text-white/65">
            Send us a product name, model number or a photo. Our team can
            confirm pricing and availability.
          </p>
          <WhatsAppLink
            number={settings.whatsapp}
            className="mt-7 min-h-12 rounded-none bg-[#ed0101] px-6 text-sm text-white hover:bg-[#c90000]"
          >
            Enquire on WhatsApp <ArrowUpRight size={18} />
          </WhatsAppLink>
        </div>
        <div className="divide-y divide-white/20 border-y border-white/20">
          <ContactRow
            label="Visit"
            value={settings.address}
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(settings.address)}`}
            external
          />
          <ContactRow
            label="Call"
            value={settings.phone || settings.whatsapp}
            href={`tel:${settings.phone || settings.whatsapp}`}
          />
          {settings.secondaryPhone && (
            <ContactRow
              label="Also on"
              value={settings.secondaryPhone}
              href={`tel:${settings.secondaryPhone}`}
            />
          )}
          <ContactRow
            label="Email"
            value={settings.email}
            href={`mailto:${settings.email}`}
          />
        </div>
      </div>
    </section>
  );
}

function ContactRow({
  label,
  value,
  href,
  external = false,
}: {
  label: string;
  value: string;
  href: string;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="group grid min-h-20 grid-cols-[55px_minmax(0,1fr)_20px] items-center gap-4 py-5 sm:grid-cols-[65px_minmax(0,1fr)_20px]"
    >
      <span className="text-xs text-white/60">{label}</span>
      <span className="break-words text-sm leading-6">{value}</span>
      <ArrowUpRight
        size={18}
        className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
      />
    </a>
  );
}
