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
import { Badge } from "@/components/ui/badge";
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

export async function generateMetadata(
  props: PageProps<"/products/[slug]">,
): Promise<Metadata> {
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

export default async function ProductDetailPage(
  props: PageProps<"/products/[slug]">,
) {
  const { slug } = await props.params;
  const [product, settings] = await Promise.all([
    getPublishedProductView(slug),
    getSettings(),
  ]);

  if (!product) notFound();

  const related = await getRelatedProducts(product, 4);

  return (
    <main className="bg-[#f7f7f9]">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <nav
          className="mb-5 flex flex-wrap items-center gap-1 text-xs text-muted-foreground sm:text-sm"
          aria-label="Breadcrumb"
        >
          <Link href="/products" className="hover:text-[#ed0101]">Products</Link>
          {product.category && (
            <>
              <ChevronRight className="size-3.5" aria-hidden="true" />
              <Link
                href={`/products?category=${product.category.slug}`}
                className="hover:text-[#ed0101]"
              >
                {product.category.name}
              </Link>
            </>
          )}
          <ChevronRight className="size-3.5" aria-hidden="true" />
          <span className="max-w-[220px] truncate text-foreground sm:max-w-none">
            {product.name}
          </span>
        </nav>

        <section className="grid gap-6 lg:grid-cols-[1.05fr_.95fr] lg:gap-10">
          <div className="overflow-hidden rounded-[28px] border border-border bg-white p-3 sm:p-5">
            <ProductGallery images={product.imageUrls} name={product.name} />
          </div>

          <div className="rounded-[28px] border border-border bg-white p-5 sm:p-7 lg:p-8">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline">{product.brand}</Badge>
              {product.featured && <Badge>Featured</Badge>}
              <AvailabilityBadge inStock={product.inStock} />
            </div>

            <h1 className="mt-5 text-3xl font-semibold leading-tight tracking-tight text-[#06065c] sm:text-4xl">
              {product.name}
            </h1>
            {product.model && (
              <p className="mt-2 text-sm text-muted-foreground">Model / type: {product.model}</p>
            )}

            <div className="mt-6 border-y border-border py-5">
              <PriceTag
                price={product.price}
                currency={product.currency}
                className="block text-2xl font-semibold text-[#06065c] sm:text-3xl"
              />
            </div>

            {product.shortDescription && (
              <p className="mt-5 text-sm leading-7 text-muted-foreground sm:text-base">
                {product.shortDescription}
              </p>
            )}

            <div className="mt-6">
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
              <div className="mt-7 border-t border-border pt-6">
                <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-[#ed0101]">
                  Product details
                </h2>
                <div className="mt-3 space-y-3 text-sm leading-7 text-foreground/80">
                  {product.description.split(/\n{2,}/).map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6">
              <ProductSpecs specifications={product.specifications} />
            </div>
          </div>
        </section>

        <section className="mt-12 sm:mt-16">
          <RelatedProducts products={related} />
        </section>
      </div>
    </main>
  );
}
