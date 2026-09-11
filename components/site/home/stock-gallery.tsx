import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function StockGallery({ images }: { images: string[] }) {
  if (images.length < 3) return null;

  const visible = images.slice(0, 6);

  return (
    <section className="overflow-hidden bg-[#06065c] text-white">
      <div className="ventum-shell py-18 sm:py-24 lg:py-30">
        <div className="grid gap-8 lg:grid-cols-[.9fr_1.1fr] lg:items-end">
          <div>
            <p className="ventum-kicker text-white/55">From the catalogue</p>
            <h2 className="mt-6 max-w-2xl text-4xl font-semibold leading-[1.02] tracking-[-0.04em] sm:text-6xl">
              Built around the equipment, not decoration.
            </h2>
          </div>
          <div className="lg:justify-self-end lg:text-right">
            <p className="max-w-lg text-sm leading-7 text-white/62 lg:ml-auto">
              Browse protection, switching, control and automation components
              available through Ventum Global Automation.
            </p>
            <Link
              href="/products"
              className="group mt-5 inline-flex min-h-12 items-center gap-5 text-sm font-semibold"
            >
              Explore all products
              <span className="flex size-10 items-center justify-center border border-white/22 transition-colors group-hover:bg-white group-hover:text-[#06065c]">
                <ArrowRight size={17} />
              </span>
            </Link>
          </div>
        </div>

        <div className="mt-12 grid auto-rows-[180px] grid-cols-2 gap-2 sm:auto-rows-[230px] md:grid-cols-4 lg:auto-rows-[250px]">
          {visible.map((src, index) => {
            const large = index === 0 || index === 4;
            const tall = index === 2;

            return (
              <div
                key={`${src}-${index}`}
                className={[
                  "group relative overflow-hidden bg-[#f5f5f1]",
                  large ? "col-span-2 row-span-2" : "",
                  tall ? "row-span-2" : "",
                ].join(" ")}
              >
                <Image
                  src={src}
                  alt="Electrical and automation equipment in the Ventum catalogue"
                  fill
                  sizes={large ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 50vw, 25vw"}
                  className="object-contain p-[8%] transition-transform duration-700 ease-out group-hover:scale-[1.035]"
                  loading={index < 3 ? "eager" : "lazy"}
                />
                <span className="absolute bottom-3 left-3 text-[9px] font-semibold uppercase tracking-[0.14em] text-[#777a88]">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
