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
    <div className="mx-auto max-w-6xl px-4 py-8">
      <nav
        className="mb-6 flex flex-wrap items-center gap-1 text-sm text-muted-foreground"
        aria-label="Breadcrumb"
      >
        <Link href="/products" className="hover:text-foreground">
          Products
        </Link>
        {product.category && (
          <>
            <ChevronRight className="size-4" aria-hidden="true" />
            <Link
              href={`/products?category=${product.category.slug}`}
              className="hover:text-foreground"
            >
              {product.category.name}
            </Link>
          </>
        )}
        <ChevronRight className="size-4" aria-hidden="true" />
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        <ProductGallery images={product.imageUrls} name={product.name} />

        <div className="space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline">{product.brand}</Badge>
            {product.featured && <Badge>Featured</Badge>}
            <AvailabilityBadge inStock={product.inStock} />
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              {product.name}
            </h1>
            {product.model && (
              <p className="text-sm text-muted-foreground">
                Model / type: {product.model}
              </p>
            )}
          </div>

          <PriceTag
            price={product.price}
            currency={product.currency}
            className="block text-2xl"
          />

          {product.shortDescription && (
            <p className="text-muted-foreground">{product.shortDescription}</p>
          )}

          <ProductActions
            productId={product.id}
            name={product.name}
            model={product.model}
            price={product.price}
            currency={product.currency}
            whatsappNumber={settings.whatsapp}
          />

          {product.description && (
            <div className="border-t border-border pt-5">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Description
              </h2>
              <div className="mt-2 space-y-3 text-sm leading-relaxed text-foreground/90">
                {product.description.split(/\n{2,}/).map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </div>
          )}

          <ProductSpecs specifications={product.specifications} />
        </div>
      </div>

      <div className="mt-14">
        <RelatedProducts products={related} />
      </div>
    </div>
  );
}
