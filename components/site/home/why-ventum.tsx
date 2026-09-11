import { BadgeCheck, Clock, MessagesSquare, Store } from "lucide-react";
import { Section, SectionHeading } from "@/components/site/section";

const REASONS = [
  {
    icon: BadgeCheck,
    title: "Accurate listings",
    body: "Specifications are preserved as supplied by the client or manufacturer — we flag differences rather than silently changing them.",
  },
  {
    icon: MessagesSquare,
    title: "Direct enquiries",
    body: "Send a product enquiry and it reaches us instantly. Prefer to talk? Continue the same conversation on WhatsApp.",
  },
  {
    icon: Clock,
    title: "Fast response",
    body: "Enquiries are answered the same working day with price and availability confirmation.",
  },
  {
    icon: Store,
    title: "Established supplier",
    body: "A physical presence in Alaba International Market with a registered company behind every order.",
  },
];

export function WhyVentum() {
  return (
    <Section muted>
      <SectionHeading eyebrow="Why Ventum" title="Why buy from Ventum" />
      <ul className="grid gap-4 sm:grid-cols-2">
        {REASONS.map((reason) => (
          <li
            key={reason.title}
            className="rounded-lg border border-border bg-card p-5"
          >
            <reason.icon className="size-5 text-primary" aria-hidden="true" />
            <p className="mt-3 font-medium">{reason.title}</p>
            <p className="mt-1 text-sm text-muted-foreground">{reason.body}</p>
          </li>
        ))}
      </ul>
    </Section>
  );
}
