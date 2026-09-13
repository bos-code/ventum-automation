"use client";

import { useActionState } from "react";
import Image from "next/image";
import { saveProduct, type ProductFormState } from "./actions";
import { productImageUrl } from "@/lib/appwrite/images";
import type { Product } from "@/lib/types";

const initialProductState: ProductFormState = { status: "idle", message: "" };

export function ProductRow({ product }: { product: Product }) {
  const action = saveProduct.bind(null, product.id);
  const [state, formAction, pending] = useActionState(
    action,
    initialProductState
  );

  return (
    <form
      action={formAction}
      className="flex flex-col gap-4 rounded-2xl border border-navy-950/10 bg-white p-5 sm:flex-row sm:items-center"
    >
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-mist-200">
        {product.imageIds[0] && (
          <Image
            src={productImageUrl(product.imageIds[0])}
            alt={product.name}
            fill
            sizes="64px"
            className="object-cover"
          />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold uppercase tracking-wide text-steel-600">
          {product.brand}
          {product.model ? ` · ${product.model}` : ""}
        </p>
        <p className="truncate font-display text-base font-bold text-navy-950">
          {product.name}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <label className="flex flex-col text-xs font-semibold text-steel-600">
          Price (₦)
          <input
            type="number"
            name="price"
            min={0}
            defaultValue={product.price ?? ""}
            className="mt-1 h-10 w-28 rounded-md border border-navy-950/15 px-2 text-sm text-navy-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ventum-blue-500"
          />
        </label>

        <label className="flex items-center gap-2 text-xs font-semibold text-steel-600">
          <input
            type="checkbox"
            name="inStock"
            defaultChecked={product.inStock}
            className="h-5 w-5 rounded border-navy-950/25"
          />
          In stock
        </label>

        <label className="flex items-center gap-2 text-xs font-semibold text-steel-600">
          <input
            type="checkbox"
            name="published"
            defaultChecked={product.published}
            className="h-5 w-5 rounded border-navy-950/25"
          />
          Published
        </label>

        <label className="flex items-center gap-2 text-xs font-semibold text-steel-600">
          <input
            type="checkbox"
            name="featured"
            defaultChecked={product.featured}
            className="h-5 w-5 rounded border-navy-950/25"
          />
          Featured
        </label>

        <button
          type="submit"
          disabled={pending}
          className="h-10 rounded-full bg-navy-950 px-4 text-xs font-semibold text-offwhite transition-colors hover:bg-navy-900 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ventum-blue-500"
        >
          {pending ? "Saving..." : "Save"}
        </button>

        {state.status !== "idle" && (
          <span
            role="status"
            className={
              state.status === "error"
                ? "text-xs font-medium text-ventum-red-600"
                : "text-xs font-medium text-green-700"
            }
          >
            {state.message}
          </span>
        )}
      </div>
    </form>
  );
}
