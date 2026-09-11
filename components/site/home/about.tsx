import Image from "next/image";
import type { Settings } from "@/types";

export function About({
  settings,
  image,
}: {
  settings: Settings;
  image?: string;
}) {
  return (
    <section id="about" className="bg-[#f2f2f2] py-14 sm:py-20">
      <div
        className={`ventum-shell grid items-center gap-10 lg:gap-20 ${image ? "lg:grid-cols-2" : "max-w-3xl"}`}
      >
        {image && (
          <div className="relative aspect-[4/3] bg-white">
            <Image
              src={image}
              alt="Electrical equipment in the Ventum catalogue"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-contain p-8"
            />
          </div>
        )}
        <div>
          <p className="ventum-kicker text-[#656879]">About Ventum</p>
          <h2 className="mt-5 max-w-lg text-3xl font-semibold leading-tight tracking-tight sm:text-5xl">
            Your next project starts with the right equipment.
          </h2>
          <p className="mt-6 max-w-lg text-base leading-7 text-[#656879]">
            {settings.businessName} supplies electrical protection, control and
            automation products for installers, contractors and businesses.
          </p>
          <div className="mt-8 border-t border-[#d9dbe4] pt-6">
            <p className="text-sm font-medium">Visit us in Lagos</p>
            <p className="mt-2 text-sm leading-6 text-[#656879]">
              {settings.address}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
