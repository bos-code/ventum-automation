import Image from "next/image";
import Link from "next/link";
import type { Category } from "@/types";

export function CategoryGrid({
  categories,
}: {
  categories: (Category & {
    productCount: number;
    previewImage?: string;
    previewAlt: string;
  })[];
}) {
  if (categories.length === 0) return null;

  return (
    <section id="categories" className="border-b border-[#d9dbe4] bg-[#f8f8f5] py-16 sm:py-20 lg:py-24">
      <div className="ventum-shell">
        <div className="grid gap-7 border-b border-[#d9dbe4] pb-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <div>
            <p className="ventum-technical-label text-[#ed0101]">Supply systems / 02</p>
            <h2 className="mt-4 max-w-2xl text-4xl font-bold leading-[0.98] tracking-[-0.045em] text-[#06065c] sm:text-5xl lg:text-6xl">
              Browse the range by system.
            </h2>
          </div>
          <div className="flex flex-col gap-5 lg:items-end">
            <p className="max-w-lg text-sm leading-7 text-[#6d707e] lg:text-right">
              Start with the equipment category, then narrow by brand, model and the specifications available for each product.
            </p>
            <Link
              href="/products"
              className="inline-flex h-11 items-center border border-[#06065c] px-4 text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#06065c] transition-colors hover:bg-[#06065c] hover:text-white"
            >
              Full catalogue <span className="ml-2 text-[#ed0101]" aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>

        <ul className="grid border-x border-[#d9dbe4] md:grid-cols-2 lg:grid-cols-12">
          {categories.map((category, index) => {
            const featured = index === 0 || index === 3;
            const span = featured ? "lg:col-span-6" : "lg:col-span-3";

            return (
              <li key={category.id} className={`${span} border-b border-r border-[#d9dbe4]`}>
                <Link
                  href={`/products?category=${category.slug}`}
                  className="group flex h-full min-h-[330px] flex-col bg-white transition-colors hover:bg-[#06065c]"
                >
                  <div className="flex items-center justify-between border-b border-[#d9dbe4] px-4 py-3 group-hover:border-white/15 sm:px-5">
                    <span className="font-mono text-[9px] font-bold uppercase tracking-[0.13em] text-[#8a8d99] group-hover:text-white/42">
                      SYS_{String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="font-mono text-[9px] font-bold uppercase tracking-[0.12em] text-[#8a8d99] group-hover:text-white/42">
                      {category.productCount || "—"} products
                    </span>
                  </div>

                  <div className="relative flex flex-1 items-center justify-center overflow-hidden bg-[#f4f4f2] p-5 group-hover:bg-[#f1f1ef] sm:p-6">
                    {category.previewImage ? (
                      <Image
                        src={category.previewImage}
                        alt={category.previewAlt}
                        fill
                        sizes={featured ? "(max-width: 1024px) 100vw, 50vw" : "(max-width: 1024px) 50vw, 25vw"}
                        className="object-contain p-6 drop-shadow-[0_16px_24px_rgba(17,19,34,0.08)] transition-transform duration-500 group-hover:scale-[1.025]"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="size-20 border border-[#06065c]/12">
                          <span className="block h-1/2 border-b border-[#06065c]/12" />
                          <span className="mx-auto block h-1/2 w-px bg-[#06065c]/12" />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-[1fr_auto] items-end gap-4 border-t border-[#d9dbe4] p-5 group-hover:border-white/15 sm:p-6">
                    <div>
                      <h3 className="text-xl font-bold leading-tight tracking-[-0.025em] text-[#111322] group-hover:text-white sm:text-2xl">
                        {category.name}
                      </h3>
                      {category.description ? (
                        <p className="mt-2 line-clamp-2 text-xs leading-5 text-[#747785] group-hover:text-white/55">
                          {category.description}
                        </p>
                      ) : null}
                    </div>
                    <span className="text-xl text-[#ed0101] transition-transform group-hover:translate-x-0.5" aria-hidden="true">↗</span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
