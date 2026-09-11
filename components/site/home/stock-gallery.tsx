import Image from "next/image";
import Link from "next/link";

export function StockGallery({ images }: { images: string[] }) {
  if (images.length < 3) return null;

  const visible = images.slice(0, 7);

  return (
    <section className="border-b border-[#d9dbe4] bg-[#06065c] text-white">
      <div className="ventum-shell py-16 sm:py-20 lg:py-24">
        <div className="grid gap-6 border-b border-white/15 pb-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.15em] text-[#ed0101]">Product view / 04</p>
            <h2 className="mt-4 max-w-3xl text-4xl font-bold leading-[0.98] tracking-[-0.045em] sm:text-5xl lg:text-6xl">
              See the equipment, not decorative filler.
            </h2>
          </div>
          <Link
            href="/products"
            className="inline-flex h-11 items-center border border-white/25 px-4 text-[10px] font-extrabold uppercase tracking-[0.12em] text-white transition-colors hover:bg-white hover:text-[#06065c]"
          >
            Explore catalogue <span className="ml-2 text-[#ed0101]" aria-hidden="true">↗</span>
          </Link>
        </div>

        <ul className="grid auto-rows-[150px] grid-cols-2 border-l border-t border-white/12 sm:auto-rows-[190px] md:grid-cols-4 lg:auto-rows-[220px]">
          {visible.map((src, index) => {
            const featured = index === 0 || index === 3;
            return (
              <li
                key={`${src}-${index}`}
                className={
                  featured
                    ? "relative col-span-2 row-span-2 overflow-hidden border-b border-r border-white/12 bg-[#f4f4f2]"
                    : "relative overflow-hidden border-b border-r border-white/12 bg-[#f4f4f2]"
                }
              >
                <div className="absolute left-3 top-3 z-10 bg-[#06065c] px-2 py-1 font-mono text-[8px] font-bold uppercase tracking-[0.12em] text-white/60">
                  IMG_{String(index + 1).padStart(2, "0")}
                </div>
                <Image
                  src={src}
                  alt="Electrical and automation product stock"
                  fill
                  sizes={featured ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 50vw, 25vw"}
                  className="object-contain p-5 drop-shadow-[0_16px_24px_rgba(17,19,34,0.08)] transition-transform duration-500 hover:scale-[1.02] sm:p-7"
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
