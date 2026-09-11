"use client";

import { useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil, Star, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { Product } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProductImage } from "@/components/catalog/product-image";
import { PriceTag } from "@/components/catalog/price-tag";
import {
  deleteProductAction,
  setProductFlagAction,
} from "@/lib/actions/products";

export function AdminProductCard({
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
    if (!window.confirm(`Delete "${product.name}"? This cannot be undone.`)) return;
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
    <article
      className={`rounded-2xl border border-border bg-white p-3 shadow-sm ${
        isPending ? "opacity-60" : ""
      }`}
    >
      <div className="flex gap-3">
        <ProductImage
          src={imageUrl}
          alt=""
          className="size-24 shrink-0 rounded-xl border border-border bg-[#f7f7f9]"
        />
        <div className="min-w-0 flex-1 py-1">
          <p className="truncate text-xs font-bold uppercase tracking-[0.14em] text-[#ed0101]">
            {product.brand}
          </p>
          <h2 className="mt-1 line-clamp-2 text-sm font-semibold leading-snug text-[#06065c]">
            {product.name}
          </h2>
          <p className="mt-1 truncate text-xs text-muted-foreground">
            {categoryName ?? "Uncategorised"}{product.model ? ` · ${product.model}` : ""}
          </p>
          <PriceTag
            price={product.price}
            currency={product.currency}
            className="mt-2 block text-sm font-semibold"
          />
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-1.5 border-t border-border pt-3">
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
          className="grid min-h-9 min-w-9 place-items-center rounded-lg"
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

        <div className="ml-auto flex gap-1">
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
      </div>
    </article>
  );
}
