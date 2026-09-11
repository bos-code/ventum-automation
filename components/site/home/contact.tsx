import { ArrowUpRight } from "lucide-react";
import { WhatsAppLink } from "@/components/site/whatsapp-link";
import type { Settings } from "@/types";

export function Contact({ settings }: { settings: Settings }) {
  return (
    <section id="contact" className="overflow-hidden bg-[#06065c] text-white">
      <div className="ventum-shell grid lg:grid-cols-[1.08fr_.92fr]">
        <div className="border-white/15 py-16 sm:py-20 lg:border-r lg:py-24 lg:pr-16">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#ed0101]">Sales desk</p>
          <h2 className="mt-5 max-w-[12ch] text-[clamp(2.5rem,5vw,5rem)] font-semibold leading-[.98] tracking-[-0.045em]">
            Need the exact part? Send the model.
          </h2>
          <p className="mt-6 max-w-lg text-sm leading-7 text-white/65 sm:text-base">
            Send a model number, product name or clear photo. We’ll confirm the closest match, current availability and pricing.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <WhatsAppLink
              number={settings.whatsapp}
              className="min-h-12 rounded-none bg-[#ed0101] px-6 text-sm font-semibold text-white hover:bg-[#c90000]"
            >
              Enquire on WhatsApp <ArrowUpRight size={18} />
            </WhatsAppLink>
            {settings.phone && (
              <a
                href={`tel:${settings.phone}`}
                className="inline-flex min-h-12 items-center border border-white/25 px-5 text-sm font-semibold transition-colors hover:bg-white hover:text-[#06065c]"
              >
                Call sales
              </a>
            )}
          </div>
        </div>

        <div className="border-t border-white/15 py-4 lg:border-t-0 lg:py-14 lg:pl-12">
          <ContactRow
            index="01"
            label="Visit"
            value={settings.address}
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(settings.address)}`}
            external
          />
          <ContactRow
            index="02"
            label="Phone"
            value={settings.phone || settings.whatsapp}
            href={`tel:${settings.phone || settings.whatsapp}`}
          />
          {settings.secondaryPhone && (
            <ContactRow
              index="03"
              label="Alternative"
              value={settings.secondaryPhone}
              href={`tel:${settings.secondaryPhone}`}
            />
          )}
          <ContactRow
            index={settings.secondaryPhone ? "04" : "03"}
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
  index,
  label,
  value,
  href,
  external = false,
}: {
  index: string;
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
      className="group grid min-h-24 grid-cols-[34px_72px_minmax(0,1fr)_24px] items-center gap-2 border-b border-white/15 py-5 sm:grid-cols-[42px_88px_minmax(0,1fr)_24px]"
    >
      <span className="font-mono text-[10px] text-white/35">{index}</span>
      <span className="text-xs uppercase tracking-[0.12em] text-white/50">{label}</span>
      <span className="break-words text-sm leading-6 text-white/85">{value}</span>
      <ArrowUpRight
        size={18}
        className="text-[#ed0101] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
      />
    </a>
  );
}
