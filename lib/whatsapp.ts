import { WHATSAPP_NUMBER } from "@/lib/constants";
import { formatPrice } from "@/lib/utils";

/** Build a wa.me deep link with a prefilled message. */
export function whatsappLink(message: string, number: string = WHATSAPP_NUMBER) {
  const digits = number.replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

interface ProductLike {
  name: string;
  model?: string | null;
  price?: number | null;
  currency?: string | null;
}

/**
 * Prefilled enquiry message for a specific product, per the brief:
 *
 *   Hello Ventum Global Automation.
 *   I'm interested in the {name} ({model}) listed for {price}.
 *   Is it currently available?
 */
export function productWhatsappMessage(product: ProductLike): string {
  const model = product.model ? ` (${product.model})` : "";
  const price =
    product.price != null
      ? ` listed for ${formatPrice(product.price, product.currency ?? "NGN")}`
      : "";
  return (
    `Hello Ventum Global Automation.\n\n` +
    `I'm interested in the ${product.name}${model}${price}.\n\n` +
    `Is it currently available?`
  );
}

/** Generic "get in touch" message for the site-wide WhatsApp CTA. */
export function generalWhatsappMessage(): string {
  return "Hello Ventum Global Automation. I'd like to make an enquiry.";
}
