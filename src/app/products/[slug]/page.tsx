import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/data/products";
import { getSettings } from "@/lib/data/settings";
import { productImageUrl } from "@/lib/appwrite/images";
import { formatPrice } from "@/lib/format";
import { whatsappLink } from "@/lib/site-config";

export async function generateMetadata(
  props: PageProps<"/products/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product not found" };

  return {
    title: product.name,
    description:
      product.shortDescription ??
      `${product.brand} ${product.model ?? ""} — ${formatPrice(product.price, product.currency)}`,
  };
}

export default async function ProductDetailPage(
  props: PageProps<"/products/[slug]">
) {
  const { slug } = await props.params;
  const [product, settings] = await Promise.all([
    getProductBySlug(slug),
    getSettings(),
  ]);

  if (!product) notFound();

  const [mainImage, ...otherImages] = product.imageIds;
  const enquiryMessage = `Hi Ventum, I'd like to enquire about the ${product.name}${
    product.model ? ` (${product.model})` : ""
  }.`;

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <Link
          href="/products"
          className="text-sm font-semibold text-ventum-blue-600 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ventum-blue-500"
        >
          &larr; All products
        </Link>

        <div className="mt-6 grid gap-10 md:grid-cols-2 md:gap-16">
          <div className="flex flex-col gap-4">
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-mist-200">
              {mainImage && (
                <Image
                  src={productImageUrl(mainImage)}
                  alt={product.name}
                  fill
                  priority
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover"
                />
              )}
            </div>
            {otherImages.length > 0 && (
              <div className="grid grid-cols-3 gap-4">
                {otherImages.map((imageId) => (
                  <div
                    key={imageId}
                    className="relative aspect-square overflow-hidden rounded-xl bg-mist-200"
                  >
                    <Image
                      src={productImageUrl(imageId)}
                      alt={product.name}
                      fill
                      sizes="200px"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-steel-600">
              {product.brand}
              {product.model ? ` · Model ${product.model}` : ""}
            </p>
            <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-navy-950 sm:text-4xl">
              {product.name}
            </h1>

            <p className="mt-4 font-display text-2xl font-extrabold text-ventum-red-600">
              {formatPrice(product.price, product.currency)}
            </p>

            {!product.inStock && (
              <p className="mt-2 text-sm font-semibold text-ventum-red-600">
                Currently out of stock — message us for restock timing.
              </p>
            )}

            {product.description && (
              <p className="mt-6 max-w-md text-base leading-relaxed text-steel-600">
                {product.description}
              </p>
            )}

            {product.specifications.length > 0 && (
              <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-navy-950/10 pt-6 sm:max-w-md">
                {product.specifications.map((spec) => (
                  <div key={spec.label}>
                    <dt className="text-xs uppercase tracking-wide text-steel-600">
                      {spec.label}
                    </dt>
                    <dd className="font-display text-sm font-bold text-navy-950">
                      {spec.value}
                    </dd>
                  </div>
                ))}
              </dl>
            )}

            <a
              href={whatsappLink(settings.whatsapp, enquiryMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex h-12 items-center rounded-full bg-ventum-red-600 px-6 text-sm font-semibold text-offwhite transition-colors hover:bg-ventum-red-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ventum-blue-500"
            >
              Enquire on WhatsApp
            </a>

            <p className="mt-4 text-xs text-steel-600">
              Rating shown exactly as printed on the unit. Availability
              confirmed at time of enquiry.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
