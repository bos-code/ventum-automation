import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { ProductView } from "@/types";
import { AddToEnquiryButton } from "./enquiry-selection";
import { ProductCard } from "./product-card";
import { PriceTag } from "./price-tag";

export function FeaturedProducts({ products }: { products: ProductView[] }) {
  if (products.length === 0) return null;

  const [lead, ...rest] = products;
  const supporting = rest.slice(0, 3);
  const selectedLead = {
    id: lead.id,
    slug: lead.slug,
    name: lead.name,
    brand: lead.brand,
    model: lead.model,
    price: lead.price,
    currency: lead.currency,
  };

  return (
    <section className="border-b border-[#d9dbe4] bg-[#f8f8f5] py-16 sm:py-22 lg:py-26">
      <div className="ventum-shell">
        <div className="grid gap-7 border-b border-[#d9dbe4] pb-7 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="text-sm font-semibold text-[#ed0101]">Featured equipment</p>
            <h2 className="mt-3 max-w-3xl text-4xl font-semibold leading-[1.02] tracking-[-0.04em] text-[#111322] sm:text-5xl">
              Products worth putting front and centre.
            </h2>
          </div>
          <Link
            href="/products"
            className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#06065c] hover:text-[#ed0101]"
          >
            Full catalogue <ArrowUpRight size={16} />
          </Link>
        </div>

        <div className="mt-8 grid overflow-hidden border border-[#d9dbe4] bg-white lg:grid-cols-[1.15fr_.85fr]">
          <Link href={`/products/${lead.slug}`} className="group relative min-h-[360px] bg-[#efefe9] sm:min-h-[500px]">
            {lead.imageUrls[0] ? (
              <Image
                src={lead.imageUrls[0]}
                alt={lead.name}
                fill
                sizes="(max-width: 1024px) 100vw, 58vw"
                className="object-contain p-[8%] transition-transform duration-600 ease-out group-hover:scale-[1.025]"
              />
            ) : null}
          </Link>

          <div className="flex flex-col justify-between border-t border-[#d9dbe4] p-6 sm:p-8 lg:border-l lg:border-t-0 lg:p-10">
            <div>
              <p className="text-sm font-semibold text-[#06065c]">{lead.brand}</p>
              <h3 className="mt-3 text-3xl font-semibold leading-tight tracking-[-0.035em] text-[#111322] sm:text-4xl">
                {lead.name}
              </h3>
              {lead.model && (
                <p className="mt-4 font-mono text-sm font-semibold text-[#555967]">{lead.model}</p>
              )}
              {lead.shortDescription && (
                <p className="mt-5 max-w-md text-base leading-7 text-[#656879]">{lead.shortDescription}</p>
              )}
            </div>

            <div className="mt-8 border-t border-[#d9dbe4] pt-6">
              <PriceTag
                price={lead.price}
                currency={lead.currency}
                className="text-2xl font-semibold text-[#111322]"
              />
              <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                <AddToEnquiryButton product={selectedLead} />
                <Link
                  href={`/products/${lead.slug}`}
                  className="inline-flex min-h-11 items-center justify-center gap-2 bg-[#06065c] px-4 text-sm font-semibold text-white hover:bg-[#03033b]"
                >
                  View product <ArrowUpRight size={15} />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {supporting.length > 0 && (
          <div className="mt-10 grid gap-x-5 gap-y-10 min-[430px]:grid-cols-2 lg:grid-cols-3">
            {supporting.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
