import Link from "next/link";
import { Button } from "@/components/ui/button";
import { WhatsAppLink } from "@/components/site/whatsapp-link";
import type { Settings } from "@/types";
import { toWhatsAppDigits } from "@/lib/utils";

export function Contact({ settings }: { settings: Settings }) {
  const mapsQuery = encodeURIComponent(settings.address);

  return (
    <section id="contact" className="bg-[#ed0101] text-white">
      <div className="ventum-shell grid min-h-[560px] lg:grid-cols-[1.05fr_.95fr]">
        <div className="flex flex-col justify-center border-white/18 py-14 sm:py-18 lg:border-r lg:pr-12 lg:py-20">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-white/58">
            Sales desk / Direct enquiry
          </p>
          <h2 className="mt-5 max-w-3xl text-[clamp(2.7rem,7vw,5.8rem)] font-bold leading-[0.94] tracking-[-0.055em]">
            Tell us what the job needs.
          </h2>
          <p className="mt-6 max-w-xl text-sm leading-7 text-white/76 sm:text-base">
            Send the product, model or requirement. Ventum can confirm pricing,
            availability and the next practical step directly with you.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <WhatsAppLink
              number={settings.whatsapp}
              size="lg"
              variant="secondary"
              className="h-12 rounded-[1px] border-0 bg-[#06065c] px-6 text-[10px] font-extrabold uppercase tracking-[0.12em] text-white hover:bg-[#03033b]"
            >
              Start WhatsApp enquiry <span aria-hidden="true">↗</span>
            </WhatsAppLink>
            <Button
              asChild
              size="lg"
              variant="ghost"
              className="h-12 rounded-[1px] border border-white/35 bg-transparent px-6 text-[10px] font-extrabold uppercase tracking-[0.12em] text-white hover:bg-white hover:text-[#ed0101]"
            >
              <Link href="/products">Browse catalogue <span aria-hidden="true">↗</span></Link>
            </Button>
          </div>
        </div>

        <div className="border-t border-white/18 py-8 lg:border-t-0 lg:pl-10 lg:py-12">
          <div className="h-full border border-white/22">
            <ContactRow
              index="01"
              label="Visit"
              value={settings.address}
              href={`https://www.google.com/maps/search/?api=1&query=${mapsQuery}`}
              external
            />
            <ContactRow
              index="02"
              label="WhatsApp"
              value={settings.phone || settings.whatsapp}
              href={`https://wa.me/${toWhatsAppDigits(settings.whatsapp)}`}
              external
            />
            {settings.secondaryPhone ? (
              <ContactRow
                index="03"
                label="Call"
                value={settings.secondaryPhone}
                href={`tel:${settings.secondaryPhone}`}
              />
            ) : null}
            <ContactRow
              index={settings.secondaryPhone ? "04" : "03"}
              label="Email"
              value={settings.email}
              href={`mailto:${settings.email}`}
            />

            <div className="flex min-h-32 items-end justify-between gap-6 border-t border-white/22 bg-[#06065c] p-5 sm:p-6">
              <div>
                <p className="font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-white/42">Location</p>
                <p className="mt-2 text-lg font-bold">Lagos · Nigeria</p>
              </div>
              <span className="text-3xl text-[#ed0101]" aria-hidden="true">+</span>
            </div>
          </div>
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
      className="group grid min-h-24 grid-cols-[42px_90px_1fr_auto] items-center gap-3 border-b border-white/22 px-4 transition-colors hover:bg-white hover:text-[#06065c] sm:grid-cols-[52px_110px_1fr_auto] sm:px-5"
    >
      <span className="font-mono text-[9px] font-bold text-current/42">{index}</span>
      <span className="font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-current/55">{label}</span>
      <span className="min-w-0 break-words text-sm font-semibold leading-5">{value}</span>
      <span className="text-lg transition-transform group-hover:translate-x-0.5" aria-hidden="true">↗</span>
    </a>
  );
}
