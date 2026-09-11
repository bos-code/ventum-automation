import { BadgeCheck, Clock, MessagesSquare, Store } from "lucide-react";

const REASONS = [
  { icon: BadgeCheck, title: "Genuine products", body: "Clear product information and dependable sourcing." },
  { icon: MessagesSquare, title: "Direct enquiries", body: "Request a product or continue instantly on WhatsApp." },
  { icon: Clock, title: "Fast response", body: "Quick confirmation on price and availability." },
  { icon: Store, title: "Physical presence", body: "Based in Alaba International Market, Lagos." },
];

export function WhyVentum() {
  return (
    <section className="border-y border-border bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-7 flex items-end justify-between gap-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#ed0101]">
              Why Ventum
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
              Simple reasons to buy with confidence.
            </h2>
          </div>
        </div>

        <ul className="grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {REASONS.map((reason) => (
            <li key={reason.title} className="bg-white p-5 sm:p-6">
              <div className="grid size-10 place-items-center rounded-full bg-[#06065c]/7">
                <reason.icon className="size-5 text-[#06065c]" aria-hidden="true" />
              </div>
              <p className="mt-4 font-semibold text-[#06065c]">{reason.title}</p>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">{reason.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
