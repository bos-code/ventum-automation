import Link from "next/link";
import { ArrowRight, Mail, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WhatsAppLink } from "@/components/site/whatsapp-link";
import { Section, SectionHeading } from "@/components/site/section";
import type { Settings } from "@/types";
import { toWhatsAppDigits } from "@/lib/utils";

export function Contact({ settings }: { settings: Settings }) {
  const mapsQuery = encodeURIComponent(settings.address);

  return (
    <Section id="contact" muted>
      <SectionHeading
        eyebrow="Enquiries"
        title="Contact & location"
        description="Send a product enquiry from any product page, or reach us directly."
      />

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-4">
          <ContactRow icon={MapPin} label="Address">
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${mapsQuery}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground"
            >
              {settings.address}
            </a>
          </ContactRow>
          <ContactRow icon={Phone} label="WhatsApp">
            <a
              href={`https://wa.me/${toWhatsAppDigits(settings.whatsapp)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground"
            >
              {settings.phone}
            </a>
          </ContactRow>
          <ContactRow icon={Phone} label="Phone">
            <a href={`tel:${settings.secondaryPhone}`} className="hover:text-foreground">
              {settings.secondaryPhone}
            </a>
          </ContactRow>
          <ContactRow icon={Mail} label="Email">
            <a href={`mailto:${settings.email}`} className="hover:text-foreground">
              {settings.email}
            </a>
          </ContactRow>
        </div>

        <div className="flex flex-col justify-center gap-3 rounded-lg border border-border bg-card p-6">
          <p className="font-medium">Ready to enquire about a product?</p>
          <p className="text-sm text-muted-foreground">
            Browse the catalogue, open a product and use “Request Product”, or
            start on WhatsApp now.
          </p>
          <div className="mt-2 flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/products">
                Browse products
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
            <WhatsAppLink number={settings.whatsapp} variant="secondary" />
          </div>
        </div>
      </div>
    </Section>
  );
}

function ContactRow({
  icon: Icon,
  label,
  children,
}: {
  icon: typeof MapPin;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-3">
      <Icon className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <p className="text-sm text-muted-foreground">{children}</p>
      </div>
    </div>
  );
}
