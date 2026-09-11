import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WhatsAppLink } from "@/components/site/whatsapp-link";
import type { Settings } from "@/types";

export function Hero({
  settings,
  productCount,
  brandCount,
}: {
  settings: Settings;
  productCount: number;
  brandCount: number;
}) {
  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:py-24">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {settings.businessName}
        </p>
        <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
          Electrical protection. Industrial control. Built to perform.
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
          Reliable electrical, automation and solar-protection products for
          homes, businesses and industrial applications — supplied from Alaba
          International Market, Lagos.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild size="lg">
            <Link href="/products">
              Explore products
              <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
          <WhatsAppLink
            number={settings.whatsapp}
            variant="secondary"
            size="lg"
          />
        </div>

        {(productCount > 0 || brandCount > 0) && (
          <dl className="mt-12 flex flex-wrap gap-x-12 gap-y-4 border-t border-border pt-6 text-sm">
            {productCount > 0 && (
              <div>
                <dt className="text-muted-foreground">Products listed</dt>
                <dd className="text-2xl font-semibold">{productCount}</dd>
              </div>
            )}
            {brandCount > 0 && (
              <div>
                <dt className="text-muted-foreground">Trusted brands</dt>
                <dd className="text-2xl font-semibold">{brandCount}</dd>
              </div>
            )}
            <div>
              <dt className="text-muted-foreground">Enquiry response</dt>
              <dd className="text-2xl font-semibold">Same day</dd>
            </div>
          </dl>
        )}
      </div>
    </section>
  );
}
