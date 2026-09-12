import { WHATSAPP_NUMBER } from "@/lib/constants";
import { formatPrice, toWhatsAppDigits } from "@/lib/utils";

/** Build a wa.me deep link with a prefilled message. */
export function whatsappLink(message: string, number: string = WHATSAPP_NUMBER) {
  const digits = toWhatsAppDigits(number);
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

interface ProductLike {
  name: string;
  model?: string | null;
  price?: number | null;
  currency?: string | null;
}

interface SelectedProductLike extends ProductLike {
  brand?: string | null;
  quantity?: number;
}

/** Prefilled enquiry message for a specific product. */
export function productWhatsappMessage(product: ProductLike): string {
  const model = product.model ? ` (${product.model})` : "";
  const price =
    product.price != null
      ? ` listed for ${formatPrice(product.price, product.currency ?? "NGN")}`
      : "";
  return (
    `Hello Ventum Global Automation.\n\n` +
    `I'm interested in the ${product.name}${model}${price}.\n\n` +
    `I'd like to discuss availability and supply.`
  );
}

/** Build one structured WhatsApp message for a multi-product enquiry list. */
export function selectionWhatsappMessage(products: SelectedProductLike[]): string {
  const lines = products.map((product, index) => {
    const brand = product.brand ? `${product.brand} — ` : "";
    const model = product.model ? ` (${product.model})` : "";
    const quantity = Math.max(1, product.quantity ?? 1);
    const price = product.price != null
      ? ` — ${formatPrice(product.price, product.currency ?? "NGN")}`
      : "";
    return `${index + 1}. ${brand}${product.name}${model} × ${quantity}${price}`;
  });

  return [
    "Hello Ventum Global Automation.",
    "",
    "I'd like to discuss the following products:",
    ...lines,
    "",
    "Please confirm availability and supply details.",
  ].join("\n");
}

/** Generic "get in touch" message for the site-wide WhatsApp CTA. */
export function generalWhatsappMessage(): string {
  return "Hello Ventum Global Automation. I'd like to make an enquiry.";
}
