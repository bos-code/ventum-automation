import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ProductImage } from "@/components/catalog/product-image";
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
  return (
    <section id="categories" className="bg-[#f2f2f2] py-14 sm:py-20">
      <div className="ventum-shell">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="ventum-kicker text-[#656879]">The range</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-5xl">
              What are you looking for?
            </h2>
          </div>
          <Link
            href="/products"
            className="inline-flex min-h-11 items-center gap-4 text-sm font-medium"
          >
            All products <ArrowUpRight size={18} />
          </Link>
        </div>
        <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-5">
          {categories.slice(0, 8).map((category) => (
            <li key={category.id} className="min-w-0">
              <Link
                href={`/products?category=${category.slug}`}
                className="group block h-full bg-white"
              >
                {category.previewImage && (
                  <ProductImage
                    src={category.previewImage}
                    alt={category.previewAlt}
                    sizes="(max-width: 1024px) 50vw, 25vw"
                    className="bg-white [&_img]:p-[10%] [&_img]:transition-transform [&_img]:duration-500 group-hover:[&_img]:scale-[1.04]"
                  />
                )}
                <div className="flex items-start justify-between gap-2 border-t border-[#e8e8eb] p-4 sm:p-5">
                  <div>
                    <h3 className="text-base font-semibold leading-snug sm:text-lg">
                      {category.name}
                    </h3>
                    <p className="mt-2 text-xs text-[#656879]">
                      {category.productCount}{" "}
                      {category.productCount === 1 ? "product" : "products"}
                    </p>
                  </div>
                  <ArrowUpRight size={18} className="shrink-0 text-[#06065c]" />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
