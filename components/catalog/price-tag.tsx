import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/utils";

export function PriceTag({
  price,
  currency = "NGN",
  className,
}: {
  price: number | null;
  currency?: string;
  className?: string;
}) {
  return (
    <span className={cn("font-semibold tabular-nums", className)}>
      {price != null ? formatPrice(price, currency) : "Price on request"}
    </span>
  );
}
