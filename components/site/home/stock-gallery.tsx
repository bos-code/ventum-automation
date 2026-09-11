import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export function StockGallery({ images }: { images: string[] }) {
  if (images.length < 3) return null;

  const visible = images.slice(0, 7);

  return (
    <section className="bg-[#f6f6f8]">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#ed0101]">
              In stock
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-[#06065c] sm:text-4xl">
              Products you can actually see.
            </h2>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#06065c] hover:text-[#ed0101]"
          >
            Explore catalogue <ArrowUpRight className="size-4" aria-hidden="true" />
          </Link>
        </div>

        <ul className="grid auto-rows-[150px] grid-cols-2 gap-3 sm:auto-rows-[190px] md:grid-cols-4 lg:auto-rows-[220px]">
          {visible.map((src, index) => {
            const featured = index === 0 || index === 3;
            return (
              <li
                key={`${src}-${index}`}
                className={
                  featured
                    ? "relative col-span-2 row-span-2 overflow-hidden rounded-[24px] bg-white"
                    : "relative overflow-hidden rounded-[20px] bg-white"
                }
              >
                <Image
                  src={src}
                  alt="Electrical and automation product stock"
                  fill
                  sizes={featured ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 50vw, 25vw"}
                  className="object-contain p-4 transition-transform duration-500 hover:scale-[1.035]"
                  loading={index < 4 ? "eager" : "lazy"}
                />
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
