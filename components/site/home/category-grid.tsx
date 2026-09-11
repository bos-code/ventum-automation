import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
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
    <section id="categories" className="bg-[#f2f2f2] py-16 sm:py-20 lg:py-24">
      <div className="ventum-shell">
        <div className="mb-8 flex flex-col gap-5 border-b border-[#06065c]/15 pb-7 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="ventum-kicker text-[#ed0101]">Browse by category</p>
            <h2 className="mt-4 max-w-2xl text-3xl font-black tracking-[-0.04em] text-[#06065c] sm:text-4xl lg:text-5xl">
              Find the equipment you need faster.
            </h2>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.08em] text-[#06065c] hover:text-[#ed0101]"
          >
            Full catalogue
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </Link>
        </div>

        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category, index) => (
            <li key={category.id} className={index === 0 ? "sm:col-span-2 lg:col-span-1" : ""}>
              <Link
                href={`/products?category=${category.slug}`}
                className="group relative block min-h-[280px] overflow-hidden bg-[#06065c] text-white sm:min-h-[320px]"
              >
                {category.previewImage ? (
                  <Image
                    src={category.previewImage}
                    alt={category.previewAlt}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-contain bg-white p-6 transition-transform duration-500 group-hover:scale-[1.035]"
                  />
                ) : (
                  <div className="absolute inset-0 ventum-grid bg-[#06065c]" />
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-[#06065c] via-[#06065c]/25 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 sm:p-6">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-[0.16em] text-white/60">
                      {String(index + 1).padStart(2, "0")} / {category.productCount || "—"} products
                    </span>
                    <h3 className="mt-2 max-w-[15rem] text-xl font-black leading-tight tracking-[-0.025em] sm:text-2xl">
                      {category.name}
                    </h3>
                  </div>
                  <span className="grid size-11 shrink-0 place-items-center border border-white/30 bg-white/10 transition-colors group-hover:bg-[#ed0101]">
                    <ArrowUpRight className="size-5" aria-hidden="true" />
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
