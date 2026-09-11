import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
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
  if (!categories.length) return null;

  const visible = categories.slice(0, 7);

  return (
    <section id="categories" className="bg-[#f6f6f3] py-18 sm:py-24 lg:py-30">
      <div className="ventum-shell">
        <div className="mb-10 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-12">
          <div>
            <p className="ventum-kicker text-[#6a6c79]">Browse by application</p>
            <h2 className="mt-5 max-w-3xl text-4xl font-semibold leading-[1.02] tracking-[-0.04em] text-[#111322] sm:text-6xl">
              Start with what the job needs.
            </h2>
          </div>
          <Link
            href="/products"
            className="group inline-flex min-h-12 items-center gap-5 text-sm font-semibold text-[#06065c]"
          >
            View full catalogue
            <span className="flex size-10 items-center justify-center border border-[#06065c]/20 transition-colors group-hover:bg-[#06065c] group-hover:text-white">
              <ArrowRight size={17} />
            </span>
          </Link>
        </div>

        <ul className="grid auto-rows-[220px] grid-cols-1 gap-px overflow-hidden bg-[#d9dbe4] sm:auto-rows-[250px] sm:grid-cols-2 lg:auto-rows-[270px] lg:grid-cols-4">
          {visible.map((category, index) => {
            const featured = index === 0;
            const wide = index === 3;
            const dark = index === 2 || index === 5;

            return (
              <li
                key={category.id}
                className={[
                  "min-w-0 bg-white",
                  featured ? "sm:row-span-2 lg:col-span-2" : "",
                  wide ? "lg:col-span-2" : "",
                ].join(" ")}
              >
                <Link
                  href={`/products?category=${category.slug}`}
                  className={`group relative flex h-full overflow-hidden ${dark ? "bg-[#06065c] text-white" : "bg-white text-[#111322]"}`}
                >
                  {category.previewImage ? (
                    <div className={`absolute inset-0 ${featured ? "right-[28%]" : "left-[28%]"}`}>
                      <Image
                        src={category.previewImage}
                        alt={category.previewAlt}
                        fill
                        sizes={featured ? "(max-width: 1024px) 100vw, 50vw" : "(max-width: 1024px) 50vw, 25vw"}
                        className={`object-contain transition-transform duration-700 ease-out group-hover:scale-[1.045] ${featured ? "p-[7%]" : "p-[10%]"}`}
                      />
                    </div>
                  ) : (
                    <div className={`absolute inset-0 ${dark ? "ventum-grid-dark opacity-35" : "ventum-grid opacity-50"}`} aria-hidden="true" />
                  )}

                  <div className={`relative z-10 flex w-full flex-col justify-between p-5 sm:p-6 ${featured ? "lg:p-8" : ""}`}>
                    <div className="flex items-start justify-between gap-5">
                      <span className={`text-[10px] font-semibold uppercase tracking-[0.14em] ${dark ? "text-white/50" : "text-[#777a88]"}`}>
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className={`flex size-10 items-center justify-center border transition-all duration-300 group-hover:translate-x-1 ${dark ? "border-white/20 group-hover:bg-white group-hover:text-[#06065c]" : "border-[#06065c]/15 group-hover:bg-[#06065c] group-hover:text-white"}`}>
                        <ArrowRight size={16} />
                      </span>
                    </div>

                    <div className={featured ? "max-w-xs" : "max-w-[80%]"}>
                      <h3 className={`${featured ? "text-3xl sm:text-4xl" : "text-xl sm:text-2xl"} font-semibold leading-tight tracking-[-0.025em]`}>
                        {category.name}
                      </h3>
                      <p className={`mt-2 text-xs ${dark ? "text-white/55" : "text-[#777a88]"}`}>
                        {category.productCount} {category.productCount === 1 ? "product" : "products"}
                      </p>
                    </div>
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
