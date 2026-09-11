import Image from "next/image";
import { ShieldCheck, Truck, Wrench } from "lucide-react";
import type { Settings } from "@/types";

const POINTS = [
  { icon: ShieldCheck, title: "Genuine stock" },
  { icon: Wrench, title: "Technical product range" },
  { icon: Truck, title: "Fast trade response" },
];

export function About({
  settings,
  image,
}: {
  settings: Settings;
  image?: string;
}) {
  return (
    <section id="about" className="bg-[#06065c] text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[1.05fr_.95fr] lg:items-stretch lg:px-8">
        <div className="flex flex-col justify-center">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-white/55">
            About Ventum
          </p>
          <h2 className="mt-4 max-w-xl text-3xl font-semibold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
            Built around dependable electrical and automation supply.
          </h2>
          <p className="mt-5 max-w-xl text-sm leading-7 text-white/70 sm:text-base">
            {settings.businessName} supplies electrical protection, industrial
            control and automation products to installers, contractors and
            businesses across Nigeria.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {POINTS.map((point) => (
              <div
                key={point.title}
                className="rounded-2xl border border-white/10 bg-white/[0.06] p-4"
              >
                <point.icon className="size-5 text-[#ed0101]" aria-hidden="true" />
                <p className="mt-3 text-sm font-semibold leading-snug">
                  {point.title}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative min-h-[320px] overflow-hidden rounded-[28px] bg-white/5 sm:min-h-[420px]">
          {image ? (
            <Image
              src={image}
              alt="Electrical and automation stock supplied by Ventum"
              fill
              sizes="(max-width: 1024px) 100vw, 48vw"
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(237,1,1,.22),transparent_35%),linear-gradient(135deg,rgba(255,255,255,.08),transparent)]" />
          )}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#06065c] via-[#06065c]/70 to-transparent p-6 pt-20">
            <p className="max-w-md text-sm leading-6 text-white/75">
              Based in Alaba International Market, Lagos, with a catalogue that
              spans protection, control, switching, solar and related equipment.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
