import { getSettings } from "@/lib/data/settings";
import { whatsappLink } from "@/lib/site-config";
import { Reveal } from "@/components/reveal";

export async function ContactCta() {
  const settings = await getSettings();

  return (
    <section className="relative overflow-hidden border-t border-white/10 bg-navy-950 py-14 text-offwhite sm:py-16">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_80%_0%,var(--color-ventum-red-800)_0%,transparent_55%)] opacity-40"
      />
      <Reveal className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="font-display text-display font-extrabold tracking-tight">
          Need a part today?
        </h2>
        <p className="mx-auto mt-4 max-w-md text-subhead text-steel-200">
          Send a model number or a photo of the part you need.
          We’ll help you check specifications, pricing and availability.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <a
            href={whatsappLink(
              settings.whatsapp,
              "Hi Ventum, I'd like to enquire about a product."
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 items-center rounded-full bg-ventum-red-600 px-6 text-sm font-semibold text-offwhite transition-colors hover:bg-ventum-red-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ventum-blue-500"
          >
            WhatsApp: {settings.phone}
          </a>
          <a
            href={`tel:${settings.secondaryPhone}`}
            className="inline-flex h-12 items-center rounded-full border border-white/20 px-6 text-sm font-semibold text-offwhite transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ventum-blue-500"
          >
            Call: {settings.secondaryPhone}
          </a>
        </div>
        <p className="mt-8 text-sm text-steel-200">{settings.address}</p>
      </Reveal>
    </section>
  );
}
