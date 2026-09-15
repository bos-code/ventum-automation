import type { Metadata } from "next";
import { getSettings } from "@/lib/data/settings";
import { getPublishedProducts } from "@/lib/data/products";
import { whatsappLink } from "@/lib/site-config";
import { EnquiryForm } from "./enquiry-form";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Reach Ventum Automation by WhatsApp, phone, or the enquiry form — Alaba International Market, Ojo, Lagos.",
};

export default async function ContactPage() {
  const [settings, products] = await Promise.all([
    getSettings(),
    getPublishedProducts(),
  ]);

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <p className="text-sm font-semibold uppercase tracking-widest text-ventum-blue-600">
          Contact
        </p>
        <h1 className="mt-2 font-display text-display font-extrabold tracking-tight text-navy-950">
          Talk to us.
        </h1>

        <div className="mt-12 grid gap-12 md:grid-cols-2 md:gap-16">
          <div>
            <h2 className="font-display text-xl font-bold text-navy-950">
              WhatsApp is fastest
            </h2>
            <a
              href={whatsappLink(
                settings.whatsapp,
                "Hi Ventum, I'd like to enquire about a product."
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex h-12 items-center rounded-full bg-ventum-red-600 px-6 text-sm font-semibold text-offwhite transition-colors hover:bg-ventum-red-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ventum-blue-500"
            >
              WhatsApp: {settings.phone}
            </a>

            <dl className="mt-10 flex flex-col gap-6 border-t border-navy-950/10 pt-8">
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-steel-600">
                  Phone
                </dt>
                <dd className="mt-1">
                  <a
                    href={`tel:${settings.secondaryPhone}`}
                    className="text-base font-semibold text-navy-950 hover:text-ventum-blue-600"
                  >
                    {settings.secondaryPhone}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-steel-600">
                  Email
                </dt>
                <dd className="mt-1">
                  <a
                    href={`mailto:${settings.email}`}
                    className="text-base font-semibold text-navy-950 hover:text-ventum-blue-600"
                  >
                    {settings.email}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-steel-600">
                  Visit us
                </dt>
                <dd className="mt-1 text-base font-semibold text-navy-950">
                  {settings.address}
                </dd>
              </div>
            </dl>
          </div>

          <div className="rounded-2xl border border-navy-950/10 bg-offwhite p-6 sm:p-8">
            <h2 className="font-display text-xl font-bold text-navy-950">
              Or send an enquiry
            </h2>
            <p className="mt-2 text-sm text-steel-600">
              We&apos;ll follow up on WhatsApp or phone, usually within the
              hour during business hours.
            </p>
            <div className="mt-6">
              <EnquiryForm products={products} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
