import { Badge } from "@/components/ui/badge";

export function AvailabilityBadge({ inStock }: { inStock: boolean }) {
  return inStock ? (
    <Badge variant="success">In stock</Badge>
  ) : (
    <Badge variant="warning">Out of stock</Badge>
  );
}
