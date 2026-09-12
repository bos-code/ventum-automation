import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export function StockGallery({ images }: { images: string[] }) {
  if (images.length < 3) return null;

  const visible = images.slice(0, 6);

  return (
    <section className="overflow-hidden bg-white py-16 sm:py-22 lg:py-26">
      <div className="ventum-shell">
        <div className="grid gap-7 border-b border-[#d9dbe4] pb-7 lg:grid-cols-[.9fr_1.1fr] lg:items-end">
          <div>
            <p className="text-sm font-semibold text-[#ed0101]">Available equipment</p>
            <h2 className="mt-3 max-w-2xl text-4xl font-semibold leading-[1.02] tracking-[-0.04em] text-[#111322] sm:text-5xl">
              See the equipment, not a wall of decoration.
            </h2>
          </div>
          <div className="lg:justify-self-end lg:text-right">
            <p className="max-w-lg text-sm leading-7 text-[#656879] lg:ml-auto">
              Protection, switching, control and automation components available through Ventum Global Automation.
            </p>
            <Link
              href="/products"
              className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#06065c] hover:text-[#ed0101]"
            >
              Explore the catalogue <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>

        <div className="mt-8 grid auto-rows-[180px] grid-cols-2 gap-2 sm:auto-rows-[230px] md:grid-cols-4 lg:auto-rows-[250px]">
          {visible.map((src, index) => {
            const large = index === 0 || index === 4;
            const tall = index === 2;

            return (
              <div
                key={`${src}-${index}`}
                className={[
                  "group relative overflow-hidden bg-[#f3f3ef]",
                  large ? "col-span-2 row-span-2" : "",
                  tall ? "row-span-2" : "",
                ].join(" ")}
              >
                <Image
                  src={src}
                  alt="Electrical and automation equipment in the Ventum catalogue"
                  fill
                  sizes={large ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 50vw, 25vw"}
                  className="object-contain p-[8%] transition-transform duration-500 ease-out group-hover:scale-[1.025]"
                  loading={index < 3 ? "eager" : "lazy"}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
