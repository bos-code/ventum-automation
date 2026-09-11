import { ShieldCheck, Truck, Wrench } from "lucide-react";
import { Section, SectionHeading } from "@/components/site/section";
import type { Settings } from "@/types";

const POINTS = [
  {
    icon: ShieldCheck,
    title: "Genuine products",
    body: "Circuit breakers, contactors, relays and surge protection from recognised manufacturers — specified as supplied by the manufacturer or client.",
  },
  {
    icon: Wrench,
    title: "Technical focus",
    body: "Equipment for residential, commercial and industrial installations, including solar protection and voltage-protection devices.",
  },
  {
    icon: Truck,
    title: "Trade-ready supply",
    body: "Based in Alaba International Market, Lagos — quick to quote, quick to respond to enquiries.",
  },
];

export function About({ settings }: { settings: Settings }) {
  return (
    <Section id="about">
      <SectionHeading eyebrow="Who we are" title={`About ${settings.businessName}`} />
      <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
        <div className="space-y-4 text-muted-foreground">
          <p>
            {settings.businessName} (legally {settings.legalName}, RC 3777637)
            supplies electrical products and automation equipment to installers,
            contractors and businesses across Nigeria.
          </p>
          <p>
            Our range covers circuit breakers, contactors and relays, surge
            protection devices, voltage protection, timers and controllers, solar
            protection products, switches, lighting, hand tools and related
            electrical equipment.
          </p>
          <p>{settings.tagline}.</p>
        </div>
        <ul className="space-y-4">
          {POINTS.map((point) => (
            <li key={point.title} className="flex gap-3">
              <point.icon
                className="mt-0.5 size-5 shrink-0 text-primary"
                aria-hidden="true"
              />
              <div>
                <p className="font-medium">{point.title}</p>
                <p className="text-sm text-muted-foreground">{point.body}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
