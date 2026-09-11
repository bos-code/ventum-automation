import Image from "next/image";
import { MapPin } from "lucide-react";
import type { Settings } from "@/types";

export function About({
  settings,
  image,
}: {
  settings: Settings;
  image?: string;
}) {
  return (
    <section id="about" className="bg-white py-16 sm:py-22 lg:py-26">
      <div className="ventum-shell grid gap-9 lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:gap-14">
        <div>
          <p className="ventum-kicker text-[#6a6c79]">About Ventum</p>
          <h2 className="mt-5 max-w-xl text-4xl font-semibold leading-[1.02] tracking-[-0.04em] text-[#111322] sm:text-5xl">
            Built around the right equipment.
          </h2>
          <p className="mt-5 max-w-lg text-base leading-7 text-[#656879]">
            {settings.businessName} supplies electrical protection, control and automation products for projects across Nigeria.
          </p>
          <p className="mt-7 flex max-w-lg gap-2 border-t border-[#d9dbe4] pt-5 text-sm leading-6 text-[#2b2e3b]">
            <MapPin size={16} className="mt-1 shrink-0 text-[#ed0101]" />
            {settings.address}
          </p>
        </div>

        {image ? (
          <div className="relative min-h-[360px] overflow-hidden bg-[#f6f6f3] sm:min-h-[500px]">
            <Image
              src={image}
              alt="Electrical and automation equipment supplied by Ventum"
              fill
              sizes="(max-width: 1024px) 100vw, 46vw"
              className="object-contain p-[8%]"
            />
          </div>
        ) : (
          <div className="ventum-grid min-h-[360px] bg-[#f6f6f3] sm:min-h-[500px]" />
        )}
      </div>
    </section>
  );
}
