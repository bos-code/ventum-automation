import Link from "next/link";
import { ArrowRight, Mail, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WhatsAppLink } from "@/components/site/whatsapp-link";
import type { Settings } from "@/types";
import { toWhatsAppDigits } from "@/lib/utils";

export function Contact({ settings }: { settings: Settings }) {
  const mapsQuery = encodeURIComponent(settings.address);

  return (
    <section id="contact" className="bg-[#ed0101] text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[1.1fr_.9fr] lg:px-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/65">
            Need a product?
          </p>
          <h2 className="mt-3 max-w-2xl text-3xl font-semibold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
            Tell us what you need. We’ll help you find the right equipment.
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-7 text-white/80 sm:text-base">
            Browse the catalogue, request a specific product, or speak directly
            with Ventum on WhatsApp.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Button asChild size="lg" className="bg-[#06065c] text-white hover:bg-[#06065c]/90">
              <Link href="/products">
                Browse products <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
            <WhatsAppLink
              number={settings.whatsapp}
              size="lg"
              variant="secondary"
              className="border-white/30 bg-white text-[#06065c] hover:bg-white/90"
            />
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
          <ContactCard icon={MapPin} label="Visit us">
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${mapsQuery}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {settings.address}
            </a>
          </ContactCard>
          <ContactCard icon={Phone} label="Call / WhatsApp">
            <div className="space-y-1">
              <a
                className="block"
                href={`https://wa.me/${toWhatsAppDigits(settings.whatsapp)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {settings.phone}
              </a>
              {settings.secondaryPhone && (
                <a className="block" href={`tel:${settings.secondaryPhone}`}>
                  {settings.secondaryPhone}
                </a>
              )}
            </div>
          </ContactCard>
          <ContactCard icon={Mail} label="Email">
            <a href={`mailto:${settings.email}`}>{settings.email}</a>
          </ContactCard>
        </div>
      </div>
    </section>
  );
}

function ContactCard({
  icon: Icon,
  label,
  children,
}: {
  icon: typeof MapPin;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/20 bg-white/[0.08] p-5 backdrop-blur-sm">
      <div className="flex gap-4">
        <div className="grid size-10 shrink-0 place-items-center rounded-full bg-white text-[#ed0101]">
          <Icon className="size-5" aria-hidden="true" />
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/55">
            {label}
          </p>
          <div className="mt-1 text-sm leading-6 text-white/90 [&_a:hover]:text-white">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
