"use client";

import { useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil, Star, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { Product } from "@/types";
import { TD, TR } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProductImage } from "@/components/catalog/product-image";
import { PriceTag } from "@/components/catalog/price-tag";
import {
  deleteProductAction,
  setProductFlagAction,
} from "@/lib/actions/products";

export function ProductRow({
  product,
  categoryName,
  imageUrl,
}: {
  product: Product;
  categoryName: string | null;
  imageUrl?: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function toggle(field: "published" | "featured" | "inStock") {
    startTransition(async () => {
      const result = await setProductFlagAction({
        id: product.id,
        field,
        value: !product[field],
      });
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      router.refresh();
    });
  }

  function onDelete() {
    if (!window.confirm(`Delete "${product.name}"? This cannot be undone.`)) {
      return;
    }
    startTransition(async () => {
      const result = await deleteProductAction({ id: product.id });
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      toast.success("Product deleted");
      router.refresh();
    });
  }

  return (
    <TR className={isPending ? "opacity-60" : undefined}>
      <TD>
        <div className="flex items-center gap-3">
          <ProductImage
            src={imageUrl}
            alt=""
            className="size-12 shrink-0 rounded-md"
          />
          <div className="min-w-0">
            <p className="truncate font-medium">{product.name}</p>
            <p className="truncate text-xs text-muted-foreground">
              {product.brand}
              {product.model ? ` · ${product.model}` : ""}
            </p>
          </div>
        </div>
      </TD>
      <TD className="text-sm text-muted-foreground">
        {categoryName ?? "—"}
      </TD>
      <TD>
        <PriceTag price={product.price} currency={product.currency} className="text-sm" />
      </TD>
      <TD>
        <div className="flex flex-wrap gap-1.5">
          <button type="button" onClick={() => toggle("published")} disabled={isPending}>
            <Badge variant={product.published ? "success" : "outline"}>
              {product.published ? "Published" : "Draft"}
            </Badge>
          </button>
          <button type="button" onClick={() => toggle("inStock")} disabled={isPending}>
            <Badge variant={product.inStock ? "outline" : "warning"}>
              {product.inStock ? "In stock" : "Out of stock"}
            </Badge>
          </button>
          <button
            type="button"
            onClick={() => toggle("featured")}
            disabled={isPending}
            aria-label={product.featured ? "Unfeature" : "Feature"}
          >
            <Star
              className={
                product.featured
                  ? "size-4 fill-amber-400 text-amber-400"
                  : "size-4 text-muted-foreground"
              }
            />
          </button>
        </div>
      </TD>
      <TD>
        <div className="flex justify-end gap-1">
          <Button asChild variant="ghost" size="icon" aria-label="Edit">
            <Link href={`/admin/products/${product.id}/edit`}>
              <Pencil className="size-4" />
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Delete"
            onClick={onDelete}
            disabled={isPending}
          >
            <Trash2 className="size-4 text-destructive" />
          </Button>
        </div>
      </TD>
    </TR>
  );
}
