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
    <section id="about" className="bg-white py-18 sm:py-24 lg:py-30">
      <div className="ventum-shell grid gap-10 lg:grid-cols-[1.08fr_.92fr] lg:items-stretch lg:gap-14">
        <div className="order-2 flex flex-col justify-between lg:order-1 lg:py-4">
          <div>
            <p className="ventum-kicker text-[#6a6c79]">About Ventum</p>
            <h2 className="mt-6 max-w-2xl text-4xl font-semibold leading-[1.02] tracking-[-0.04em] text-[#111322] sm:text-6xl">
              Industrial supply should feel precise, not complicated.
            </h2>
            <p className="mt-7 max-w-xl text-base leading-8 text-[#656879] sm:text-lg">
              {settings.businessName} supplies electrical protection, control
              and automation equipment for installers, contractors and
              businesses that need the right component without unnecessary
              friction.
            </p>
          </div>

          <div className="mt-12 grid gap-6 border-t border-[#d9dbe4] pt-7 sm:grid-cols-2">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#777a88]">What we focus on</p>
              <p className="mt-3 text-sm leading-6 text-[#2b2e3b]">Protection, switching, control and automation equipment from established manufacturers.</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#777a88]">Visit us</p>
              <p className="mt-3 flex gap-2 text-sm leading-6 text-[#2b2e3b]">
                <MapPin size={16} className="mt-1 shrink-0 text-[#ed0101]" />
                {settings.address}
              </p>
            </div>
          </div>
        </div>

        <div className="order-1 lg:order-2">
          {image ? (
            <div className="relative min-h-[420px] overflow-hidden bg-[#f6f6f3] sm:min-h-[560px] lg:h-full lg:min-h-[640px]">
              <Image
                src={image}
                alt="Electrical and automation equipment supplied by Ventum"
                fill
                sizes="(max-width: 1024px) 100vw, 46vw"
                className="object-contain p-[8%] transition-transform duration-700 hover:scale-[1.025]"
              />
              <div className="absolute bottom-0 left-0 bg-[#06065c] px-5 py-4 text-white sm:px-6">
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/55">Based in Lagos</p>
                <p className="mt-1 text-sm font-medium">Supplying projects across Nigeria</p>
              </div>
            </div>
          ) : (
            <div className="ventum-grid min-h-[420px] bg-[#f6f6f3] sm:min-h-[560px] lg:min-h-[640px]" />
          )}
        </div>
      </div>
    </section>
  );
}
