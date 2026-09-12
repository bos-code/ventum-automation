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
  if (!categories.length) return null;

  const visible = categories.slice(0, 6);

  return (
    <section id="categories" className="bg-white py-16 sm:py-22 lg:py-26">
      <div className="ventum-shell">
        <div className="mb-9 grid gap-6 border-b border-[#d9dbe4] pb-7 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="text-sm font-semibold text-[#ed0101]">Browse by category</p>
            <h2 className="mt-3 max-w-3xl text-4xl font-semibold leading-[1.02] tracking-[-0.04em] text-[#111322] sm:text-5xl">
              Find the right equipment faster.
            </h2>
          </div>
          <Link
            href="/products"
            className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#06065c] hover:text-[#ed0101]"
          >
            View all products <ArrowUpRight size={16} />
          </Link>
        </div>

        <ul className="grid gap-x-5 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((category) => (
            <li key={category.id} className="min-w-0">
              <Link
                href={`/products?category=${category.slug}`}
                className="group block"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-[#f3f3ef]">
                  {category.previewImage ? (
                    <Image
                      src={category.previewImage}
                      alt={category.previewAlt}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-contain p-[9%] transition-transform duration-500 ease-out group-hover:scale-[1.025]"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-[#f3f3ef]" aria-hidden="true" />
                  )}
                </div>

                <div className="flex items-start justify-between gap-5 border-b border-[#d9dbe4] py-4 transition-colors group-hover:border-[#06065c]">
                  <div>
                    <h3 className="text-xl font-semibold tracking-[-0.025em] text-[#111322]">{category.name}</h3>
                    <p className="mt-1 text-sm text-[#656879]">
                      {category.productCount} {category.productCount === 1 ? "product" : "products"}
                    </p>
                  </div>
                  <span className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-[#06065c]">
                    Browse <ArrowUpRight size={15} />
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
