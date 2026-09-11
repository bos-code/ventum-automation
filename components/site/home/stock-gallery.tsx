import Image from "next/image";
import Link from "next/link";

export function StockGallery({ images }: { images: string[] }) {
  if (images.length < 3) return null;

  const visible = images.slice(0, 7);

  return (
    <section className="border-b border-[#d9dbe4] bg-[#08082f] text-white">
      <div className="ventum-shell py-16 sm:py-20 lg:py-24">
        <div className="grid gap-6 border-b border-white/15 pb-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.15em] text-[#ed0101]">
              A closer look
            </p>
            <h2 className="mt-4 max-w-3xl text-3xl font-semibold leading-tight tracking-tight sm:text-5xl">
              Protection. Control. Automation.
            </h2>
          </div>
          <Link
            href="/products"
            className="inline-flex h-11 items-center border border-white/25 px-4 text-sm font-medium text-white transition-colors hover:bg-white hover:text-[#06065c]"
          >
            Explore catalogue{" "}
            <span className="ml-2 text-[#ed0101]" aria-hidden="true">
              ↗
            </span>
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
                <Image
                  src={src}
                  alt="Electrical and automation product stock"
                  fill
                  sizes={
                    featured
                      ? "(max-width: 768px) 100vw, 50vw"
                      : "(max-width: 768px) 50vw, 25vw"
                  }
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
