import type { Metadata } from "next";
import Link from "next/link";
import { getSettings } from "@/lib/data/settings";
import { whatsappLink } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "About",
  description: "Ventum Global Services Ltd — Alaba International Market, Ojo, Lagos.",
};

export default async function AboutPage() {
  const settings = await getSettings();

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <p className="text-sm font-semibold uppercase tracking-widest text-ventum-blue-600">
          About
        </p>
        <h1 className="mt-2 font-display text-display font-extrabold tracking-tight text-navy-950">
          {settings.businessName}
        </h1>
        <p className="mt-2 text-lg font-semibold text-ventum-red-600">
          {settings.tagline}
        </p>

        <p className="mt-8 text-base leading-relaxed text-steel-600">
          {settings.legalName} sells, installs and supports electrical
          switches, lighting, solar energy equipment, industrial parts and
          hand tools out of {settings.address}. Every product in our
          catalogue is a real unit we stock, photographed as-is, with
          ratings exactly as printed on the nameplate — not a manufacturer
          render or a stock photo.
        </p>

        <p className="mt-6 text-base leading-relaxed text-steel-600">
          Alaba International Market is one of the largest electronics and
          electrical markets in West Africa. We deal directly with
          manufacturers and trusted distributors for brands including
          Schneider Electric, JOYELEC, Posmith, CHINT, Siemens, ABB and
          Legrand.
        </p>

        <div className="mt-10 flex flex-wrap gap-4">
          <a
            href={whatsappLink(
              settings.whatsapp,
              "Hi Ventum, I'd like to know more about your products."
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 items-center rounded-full bg-ventum-red-600 px-6 text-sm font-semibold text-offwhite transition-colors hover:bg-ventum-red-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ventum-blue-500"
          >
            WhatsApp Us
          </a>
          <Link
            href="/products"
            className="inline-flex h-12 items-center rounded-full border border-navy-950/15 px-6 text-sm font-semibold text-navy-950 transition-colors hover:bg-navy-950 hover:text-offwhite focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ventum-blue-500"
          >
            Browse Products
          </Link>
        </div>
      </div>
    </div>
  );
}
