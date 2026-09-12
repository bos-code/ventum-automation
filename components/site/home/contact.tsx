import { ArrowUpRight } from "lucide-react";
import { WhatsAppLink } from "@/components/site/whatsapp-link";
import type { Settings } from "@/types";

export function Contact({ settings }: { settings: Settings }) {
  return (
    <section id="contact" className="border-y border-[#d9dbe4] bg-[#f8f8f5]">
      <div className="ventum-shell grid lg:grid-cols-[1.08fr_.92fr]">
        <div className="py-14 sm:py-18 lg:border-r lg:border-[#d9dbe4] lg:py-20 lg:pr-14">
          <p className="text-sm font-semibold text-[#ed0101]">Sales enquiries</p>
          <h2 className="mt-3 max-w-[12ch] text-[clamp(2.4rem,4.5vw,4.6rem)] font-semibold leading-[.98] tracking-[-0.045em] text-[#111322]">
            Send the model. We’ll take it from there.
          </h2>
          <p className="mt-5 max-w-lg text-base leading-7 text-[#656879]">
            For one product or a complete list, send the exact models you need and continue the discussion directly with Ventum.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <WhatsAppLink
              number={settings.whatsapp}
              className="min-h-12 rounded-none bg-[#ed0101] px-6 text-sm font-semibold text-white hover:bg-[#c90000]"
            >
              WhatsApp sales <ArrowUpRight size={18} />
            </WhatsAppLink>
            {settings.phone && (
              <a
                href={`tel:${settings.phone}`}
                className="inline-flex min-h-12 items-center border border-[#c7c9d3] bg-white px-5 text-sm font-semibold text-[#06065c] transition-colors hover:border-[#06065c]"
              >
                Call Ventum
              </a>
            )}
          </div>
        </div>

        <div className="border-t border-[#d9dbe4] py-3 lg:border-t-0 lg:py-10 lg:pl-12">
          <ContactRow
            label="Visit"
            value={settings.address}
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(settings.address)}`}
            external
          />
          <ContactRow
            label="Phone"
            value={settings.phone || settings.whatsapp}
            href={`tel:${settings.phone || settings.whatsapp}`}
          />
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
      className="group grid min-h-20 grid-cols-[72px_minmax(0,1fr)_22px] items-center gap-3 border-b border-[#d9dbe4] py-4"
    >
      <span className="text-xs font-medium text-[#656879]">{label}</span>
      <span className="break-words text-sm leading-6 text-[#111322]">{value}</span>
      <ArrowUpRight
        size={17}
        className="text-[#ed0101] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
      />
    </a>
  );
}
