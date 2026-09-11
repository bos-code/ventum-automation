import Image from "next/image";
import Link from "next/link";
import type { Category } from "@/types";

export function CategoryGrid({ categories }: { categories: (Category & { productCount: number; previewImage?: string; previewAlt: string })[] }) {
  if (categories.length === 0) return null;

  return (
    <section id="categories" className="border-b border-[#d9dbe4] bg-[#f6f6f2] py-12 sm:py-16 lg:py-20">
      <div className="ventum-shell">
        <div className="mb-7 flex items-end justify-between gap-5 border-b border-[#d9dbe4] pb-5 sm:mb-9 sm:pb-6">
          <div>
            <p className="ventum-technical-label text-[#ed0101]">Shop by system</p>
            <h2 className="mt-2 max-w-xl text-3xl font-bold leading-[0.95] tracking-[-0.045em] text-[#06065c] sm:text-4xl lg:text-5xl">
              Find the equipment visually.
            </h2>
          </div>
          <Link href="/products" className="hidden text-[10px] font-extrabold uppercase tracking-[0.13em] text-[#06065c] sm:inline-flex">
            Full catalogue <span className="ml-2 text-[#ed0101]">↗</span>
          </Link>
        </div>

        <ul className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-12 lg:gap-4">
          {categories.slice(0, 8).map((category, index) => {
            const large = index === 0 || index === 3;
            const span = large ? "lg:col-span-6" : "lg:col-span-3";
            return (
              <li key={category.id} className={`${span} min-w-0`}>
                <Link
                  href={`/products?category=${category.slug}`}
                  className="group relative block min-h-[220px] overflow-hidden bg-white sm:min-h-[300px] lg:min-h-[360px]"
                >
                  <div className="absolute inset-0 bg-[#efefeb]">
                    {category.previewImage ? (
                      <Image
                        src={category.previewImage}
                        alt={category.previewAlt}
                        fill
                        sizes={large ? "(max-width: 1024px) 100vw, 50vw" : "(max-width: 1024px) 50vw, 25vw"}
                        className="object-contain p-4 transition-transform duration-700 ease-out group-hover:scale-[1.045] sm:p-6"
                      />
                    ) : (
                      <div className="absolute inset-0 ventum-grid opacity-50" />
                    )}
                  </div>

                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#02021a]/95 via-[#02021a]/72 to-transparent px-3 pb-3 pt-16 text-white sm:px-5 sm:pb-5 sm:pt-24">
                    <div className="flex items-end justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-mono text-[8px] font-bold uppercase tracking-[0.15em] text-white/45">
                          {category.productCount ? `${category.productCount} products` : "Explore"}
                        </p>
                        <h3 className="mt-1 line-clamp-2 text-base font-bold leading-tight tracking-[-0.025em] sm:text-xl lg:text-2xl">
                          {category.name}
                        </h3>
                      </div>
                      <span className="shrink-0 text-xl text-[#ed0101] transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">↗</span>
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>

        <Link href="/products" className="mt-4 inline-flex h-11 w-full items-center justify-center border border-[#06065c] text-[10px] font-extrabold uppercase tracking-[0.13em] text-[#06065c] sm:hidden">
          View full catalogue <span className="ml-2 text-[#ed0101]">↗</span>
        </Link>
      </div>
    </section>
  );
}
