"use client";

import { useActionState, useState } from "react";
import Image from "next/image";
import { saveProduct, toggleProductFlag, type ProductFormState } from "./actions";
import { AdminToggleSwitch } from "@/components/admin/toggle-switch";
import type { Product } from "@/lib/types";

const initialProductState: ProductFormState = { status: "idle", message: "" };

const ICON = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  viewBox: "0 0 24 24",
  "aria-hidden": true as const,
  className: "h-4 w-4",
};

export function ProductRow({
  product,
  imageUrl,
  onEdit,
  onDelete,
}: {
  product: Product;
  imageUrl: string | null;
  onEdit?: (product: Product) => void;
  onDelete?: (product: Product) => void;
}) {
  const action = saveProduct.bind(null, product.id);
  const [state, formAction, pending] = useActionState(action, initialProductState);
  const [flagError, setFlagError] = useState<string | null>(null);

  const hasImage = product.imageIds.length > 0;

  /**
   * The server refuses to publish a product with no image and reports it in
   * the result rather than throwing. Rethrow so the switch reverts instead of
   * showing a state the server never accepted.
   */
  const applyFlag = async (
    field: "published" | "inStock" | "isNewArrival" | "isNowAvailable",
    value: boolean
  ) => {
    setFlagError(null);
    const result = await toggleProductFlag(product.id, field, value);
    if (!result.ok) {
      setFlagError(result.error ?? "Could not update.");
      throw new Error(result.error ?? "toggle rejected");
    }
  };

  return (
    <div className="rounded-2xl border border-navy-950/10 bg-white p-4 sm:p-5">
      {/* Identity */}
      <div className="flex min-w-0 items-start gap-3 sm:gap-4">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-navy-950/10 bg-mist-200">
          {imageUrl ? (
            <Image src={imageUrl} alt="" fill sizes="64px" className="object-cover" />
          ) : (
            <span className="flex h-full w-full items-center justify-center px-1 text-center text-[10px] font-semibold text-steel-600">
              No photo
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate font-mono text-[11px] uppercase tracking-wide text-steel-600">
            {product.brand}
            {product.model ? ` · ${product.model}` : ""}
          </p>
          <p className="mt-0.5 font-display text-base font-bold leading-tight text-navy-950">
            {product.name}
          </p>

          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            {/* Status reads at a glance; shape and text, not colour alone. */}
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold ${
                product.published
                  ? "bg-green-50 text-green-800"
                  : "bg-mist-200 text-steel-700"
              }`}
            >
              <span
                aria-hidden="true"
                className={`h-1.5 w-1.5 rounded-full ${
                  product.published ? "bg-green-600" : "bg-steel-500"
                }`}
              />
              {product.published ? "Live" : "Draft"}
            </span>

            {!hasImage && (
              <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-800">
                Needs an image to publish
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Flags */}
      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-navy-950/10 pt-4">
        <AdminToggleSwitch
          label="Published"
          checked={product.published}
          activeColor="green"
          disabled={!hasImage && !product.published}
          onChange={(value) => applyFlag("published", value)}
        />
        <AdminToggleSwitch
          label="In Stock"
          checked={product.inStock}
          activeColor="amber"
          onChange={(value) => applyFlag("inStock", value)}
        />
        <AdminToggleSwitch
          label="New Arrival"
          checked={product.isNewArrival}
          activeColor="blue"
          variant="badge"
          onChange={(value) => applyFlag("isNewArrival", value)}
        />
        <AdminToggleSwitch
          label="Now Available"
          checked={product.isNowAvailable}
          activeColor="green"
          variant="badge"
          onChange={(value) => applyFlag("isNowAvailable", value)}
        />
      </div>

      {flagError && (
        <p role="alert" className="mt-2 text-xs font-semibold text-ventum-red-700">
          {flagError}
        </p>
      )}

      {/* Price + actions */}
      <div className="mt-4 flex flex-wrap items-end justify-between gap-3 border-t border-navy-950/10 pt-4">
        <form action={formAction} className="flex flex-wrap items-end gap-2">
          <label className="flex flex-col text-xs font-semibold text-steel-700">
            Price (₦)
            <input
              type="number"
              inputMode="numeric"
              name="price"
              min={0}
              defaultValue={product.price ?? ""}
              placeholder="0"
              className="mt-1 h-11 w-28 rounded-lg border border-navy-950/15 px-2 text-sm text-navy-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ventum-blue-500"
            />
          </label>
          <button
            type="submit"
            disabled={pending}
            className="h-11 rounded-lg bg-navy-950 px-4 text-xs font-semibold text-offwhite transition-colors hover:bg-navy-900 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ventum-blue-500"
          >
            {pending ? "Saving…" : "Save"}
          </button>
          {state.status !== "idle" && (
            <span
              role="status"
              className={`self-center text-xs font-semibold ${
                state.status === "success" ? "text-green-800" : "text-ventum-red-700"
              }`}
            >
              {state.message}
            </span>
          )}
        </form>

        <div className="flex items-center gap-1.5">
          {onEdit && (
            <button
              type="button"
              onClick={() => onEdit(product)}
              className="inline-flex h-11 items-center gap-1.5 rounded-lg border border-navy-950/15 px-3 text-xs font-semibold text-navy-950 transition-colors hover:bg-mist-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ventum-blue-500"
            >
              <svg {...ICON} className="h-3.5 w-3.5">
                <path d="M4 20h4L18.5 9.5a2.1 2.1 0 0 0-3-3L5 17v3Z" strokeLinejoin="round" />
              </svg>
              Edit
            </button>
          )}

          {product.published && (
            <a
              href={`/products/${product.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`View ${product.name} on the public site (opens in a new tab)`}
              className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-navy-950/15 text-steel-600 transition-colors hover:bg-mist-100 hover:text-navy-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ventum-blue-500"
            >
              <svg {...ICON}>
                <path d="M10 6H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4M14 4h6m0 0v6m0-6L10 14" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          )}

          {onDelete && (
            <button
              type="button"
              onClick={() => onDelete(product)}
              aria-label={`Delete ${product.name}`}
              className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-navy-950/15 text-steel-600 transition-colors hover:border-ventum-red-600 hover:bg-ventum-red-50 hover:text-ventum-red-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ventum-blue-500"
            >
              <svg {...ICON}>
                <path d="M4 7h16M10 11v6M14 11v6M5 7l1 13h12l1-13M9 7V4h6v3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
