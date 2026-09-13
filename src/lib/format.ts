export function formatPrice(price: number | null, currency: string = "NGN") {
  if (price === null) return "Price on request";
  if (currency === "NGN") {
    return `₦${price.toLocaleString("en-NG")}`;
  }
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency,
  }).format(price);
}
