import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { ProductGallery } from "@/components/catalog/product-gallery";
import { ProductSpecs } from "@/components/catalog/product-specs";
import { ProductActions } from "@/components/catalog/product-actions";
import { RelatedProducts } from "@/components/catalog/related-products";
import { AvailabilityBadge } from "@/components/catalog/availability-badge";
import { PriceTag } from "@/components/catalog/price-tag";
import {
  getPublishedProducts,
  getPublishedProductView,
  getRelatedProducts,
} from "@/lib/appwrite/products";
import { getSettings } from "@/lib/appwrite/settings";
import { SITE_URL } from "@/lib/constants";

export const revalidate = 300;
export const dynamicParams = true;

export async function generateStaticParams() {
  try {
    const products = await getPublishedProducts();
    return products.map((product) => ({ slug: product.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata(props: PageProps<"/products/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const product = await getPublishedProductView(slug);
  if (!product) return { title: "Product not found" };

  const description =
    product.shortDescription ||
    product.description?.slice(0, 155) ||
    `${product.brand} ${product.name} — available from Ventum Global Automation.`;

  return {
    title: product.name,
    description,
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: {
      title: product.name,
      description,
      url: `${SITE_URL}/products/${product.slug}`,
      images: product.imageUrls.slice(0, 1),
      type: "website",
    },
  };
}

export default async function ProductDetailPage(props: PageProps<"/products/[slug]">) {
  const { slug } = await props.params;
  const [product, settings] = await Promise.all([
    getPublishedProductView(slug),
    getSettings(),
  ]);

  if (!product) notFound();
  const related = await getRelatedProducts(product, 4);

  return (
    <div className="bg-white pb-20 text-[#111322] sm:pb-0">
      <div className="ventum-shell py-5 sm:py-8 lg:py-10">
        <nav
          className="mb-7 flex min-w-0 items-center gap-1 overflow-hidden text-xs text-[#747785] sm:text-sm"
          aria-label="Breadcrumb"
        >
          <Link href="/products" className="shrink-0 hover:text-[#ed0101]">Products</Link>
          {product.category && (
            <>
              <ChevronRight className="size-3.5 shrink-0" aria-hidden="true" />
              <Link href={`/products?category=${product.category.slug}`} className="shrink-0 hover:text-[#ed0101]">
                {product.category.name}
              </Link>
            </>
          )}
          <ChevronRight className="size-3.5 shrink-0" aria-hidden="true" />
          <span className="truncate text-[#111322]">{product.name}</span>
        </nav>

        <section className="grid items-start gap-10 lg:grid-cols-[minmax(0,1.08fr)_minmax(360px,.72fr)] lg:gap-16 xl:gap-20">
          <div className="min-w-0 lg:sticky lg:top-28">
            <ProductGallery images={product.imageUrls} name={product.name} />
          </div>

          <div className="min-w-0 lg:pt-3">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs uppercase tracking-[0.12em]">
              <span className="font-bold text-[#06065c]">{product.brand}</span>
              {product.category && <span className="text-[#747785]">{product.category.name}</span>}
              <AvailabilityBadge inStock={product.inStock} />
            </div>

            <h1 className="mt-5 max-w-[16ch] text-[clamp(2.1rem,4vw,4.25rem)] font-semibold leading-[.98] tracking-[-0.045em] text-[#06065c]">
              {product.name}
            </h1>

            {product.model && (
              <p className="mt-4 border-l-2 border-[#ed0101] pl-3 font-mono text-xs leading-5 text-[#656879] sm:text-sm">
                Model / type · {product.model}
              </p>
            )}

            <div className="mt-7 border-y border-[#d9dbe4] py-5">
              <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#747785]">Price</p>
              <PriceTag
                price={product.price}
                currency={product.currency}
                className="block text-2xl font-semibold tracking-tight text-[#111322] sm:text-3xl"
              />
            </div>

            {product.shortDescription && (
              <p className="mt-6 max-w-xl text-base leading-7 text-[#555967]">
                {product.shortDescription}
              </p>
            )}

            <div className="mt-7">
              <ProductActions
                productId={product.id}
                name={product.name}
                model={product.model}
                price={product.price}
                currency={product.currency}
                whatsappNumber={settings.whatsapp}
              />
            </div>

            {product.description && (
              <section className="mt-9 border-t border-[#d9dbe4] pt-7">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#ed0101]">Overview</p>
                <h2 className="mt-2 text-xl font-semibold tracking-tight text-[#06065c]">Product details</h2>
                <div className="mt-4 space-y-4 text-sm leading-7 text-[#555967] sm:text-[15px]">
                  {product.description.split(/\n{2,}/).map((para, i) => <p key={i}>{para}</p>)}
                </div>
              </section>
            )}

            <div className="mt-9">
              <ProductSpecs specifications={product.specifications} />
            </div>
          </div>
        </section>

        {related.length > 0 && (
          <section className="mt-16 border-t border-[#d9dbe4] pt-10 sm:mt-24 sm:pt-14">
            <RelatedProducts products={related} />
          </section>
        )}
      </div>
    </div>
  );
}
