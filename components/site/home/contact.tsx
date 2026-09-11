import { ArrowUpRight } from "lucide-react";
import { WhatsAppLink } from "@/components/site/whatsapp-link";
import type { Settings } from "@/types";

export function Contact({ settings }: { settings: Settings }) {
  return (
    <section id="contact" className="bg-[#06065c] text-white">
      <div className="ventum-shell grid lg:grid-cols-[1fr_1fr]">
        <div className="py-14 sm:py-18 lg:border-r lg:border-white/15 lg:py-20 lg:pr-14">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#ed0101]">Sales</p>
          <h2 className="mt-4 max-w-[11ch] text-[clamp(2.4rem,4.5vw,4.6rem)] font-semibold leading-[.98] tracking-[-0.045em]">
            Send the model. We’ll take it from there.
          </h2>
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
                className="inline-flex min-h-12 items-center border border-white/25 px-5 text-sm font-semibold transition-colors hover:bg-white hover:text-[#06065c]"
              >
                Call
              </a>
            )}
          </div>
        </div>

        <div className="border-t border-white/15 py-3 lg:border-t-0 lg:py-10 lg:pl-12">
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
      className="group grid min-h-20 grid-cols-[72px_minmax(0,1fr)_22px] items-center gap-3 border-b border-white/15 py-4"
    >
      <span className="text-xs uppercase tracking-[0.1em] text-white/45">{label}</span>
      <span className="break-words text-sm leading-6 text-white/85">{value}</span>
      <ArrowUpRight
        size={17}
        className="text-[#ed0101] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
      />
    </a>
  );
}
