import Image from "next/image";
import type { Settings } from "@/types";

const POINTS = [
  ["01", "Electrical protection"],
  ["02", "Control & switching"],
  ["03", "Automation supply"],
] as const;

export function About({
  settings,
  image,
}: {
  settings: Settings;
  image?: string;
}) {
  return (
    <section id="about" className="border-b border-white/12 bg-[#06065c] text-white">
      <div className="ventum-shell grid lg:grid-cols-[.92fr_1.08fr]">
        <div className="flex flex-col justify-center border-white/12 py-14 sm:py-20 lg:border-r lg:pr-12 lg:py-24">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.15em] text-[#ed0101]">
            Company / 06
          </p>
          <h2 className="mt-5 max-w-2xl text-4xl font-bold leading-[0.98] tracking-[-0.045em] sm:text-5xl lg:text-6xl">
            Electrical supply with a practical technical focus.
          </h2>
          <p className="mt-6 max-w-xl text-sm leading-7 text-white/64 sm:text-base">
            {settings.businessName} supplies electrical protection, industrial
            control and automation products for installers, contractors,
            businesses and projects.
          </p>

          <div className="mt-10 border-t border-white/15">
            {POINTS.map(([code, label]) => (
              <div
                key={code}
                className="grid min-h-16 grid-cols-[48px_1fr_auto] items-center border-b border-white/15"
              >
                <span className="font-mono text-[9px] font-bold text-white/32">{code}</span>
                <span className="text-sm font-semibold text-white/78">{label}</span>
                <span className="h-2 w-2 bg-[#ed0101]" aria-hidden="true" />
              </div>
            ))}
          </div>
        </div>

        <div className="relative min-h-[430px] border-t border-white/12 bg-[#03033b] lg:min-h-[650px] lg:border-t-0 lg:pl-10">
          <div className="relative h-full min-h-[430px] overflow-hidden border-x border-white/12 lg:min-h-[650px]">
            {image ? (
              <Image
                src={image}
                alt="Electrical and automation stock supplied by Ventum"
                fill
                sizes="(max-width: 1024px) 100vw, 56vw"
                className="object-contain bg-[#f4f4f2] p-6 sm:p-10"
              />
            ) : (
              <div className="absolute inset-0 ventum-grid-dark opacity-50" />
            )}

            <div className="absolute inset-x-0 bottom-0 border-t border-white/15 bg-[#03033b]/96 p-5 sm:p-6">
              <p className="font-mono text-[9px] font-bold uppercase tracking-[0.13em] text-white/38">
                Physical presence / Lagos
              </p>
              <p className="mt-3 max-w-lg text-sm leading-6 text-white/68">
                Based in Alaba International Market, Lagos, with a catalogue spanning protection, control, switching, solar and related equipment.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
