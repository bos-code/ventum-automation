"use client";

import { useActionState } from "react";
import Image from "next/image";
import { saveProduct, toggleProductFlag, type ProductFormState } from "./actions";
import { AdminToggleSwitch } from "@/components/admin/toggle-switch";
import type { Product } from "@/lib/types";

const initialProductState: ProductFormState = { status: "idle", message: "" };

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
  const [state, formAction, pending] = useActionState(
    action,
    initialProductState
  );

  return (
    <div className="flex flex-col gap-5 rounded-2xl border border-navy-950/10 bg-white p-5 lg:flex-row lg:items-center">
      {/* Product Image & Info */}
      <div className="flex min-w-0 flex-1 items-center gap-4">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-navy-950/5 bg-mist-200">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              sizes="64px"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-[10px] font-semibold text-steel-400">
              No photo
            </div>
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
      </div>

      {/* Marketing Badges (New Arrival & Now Available) */}
      <div className="flex flex-wrap items-center gap-3 border-t border-navy-950/5 pt-4 lg:border-t-0 lg:pt-0">
        <AdminToggleSwitch
          label="New Arrival"
          checked={product.isNewArrival}
          activeColor="blue"
          variant="badge"
          onChange={async (val) => {
            await toggleProductFlag(product.id, "isNewArrival", val);
          }}
        />
        <AdminToggleSwitch
          label="Now Available"
          checked={product.isNowAvailable}
          activeColor="green"
          variant="badge"
          onChange={async (val) => {
            await toggleProductFlag(product.id, "isNowAvailable", val);
          }}
        />
      </div>

      {/* Price Form & Row Actions */}
      <div className="flex flex-wrap items-end gap-3 border-t border-navy-950/5 pt-4 lg:border-t-0 lg:pt-0">
        <form action={formAction} className="flex items-end gap-2">
          <label className="flex flex-col text-xs font-semibold text-steel-600">
            Price (₦)
            <input
              type="number"
              name="price"
              min={0}
              defaultValue={product.price ?? ""}
              placeholder="0"
              className="mt-1 h-10 w-28 rounded-md border border-navy-950/15 px-2 text-sm text-navy-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ventum-blue-500"
            />
          </label>
          <button
            type="submit"
            disabled={pending}
            className="h-10 rounded-lg bg-navy-950 px-4 text-xs font-semibold text-offwhite transition-colors hover:bg-navy-900 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ventum-blue-500"
          >
            {pending ? "Saving..." : "Save"}
          </button>
          {state.status !== "idle" && (
            <span
              className={`text-xs font-semibold ${
                state.status === "success"
                  ? "text-green-700"
                  : "text-ventum-red-600"
              }`}
            >
              {state.message}
            </span>
          )}
        </form>

        <div className="flex items-center gap-1.5 self-end">
          {onEdit && (
            <button
              type="button"
              onClick={() => onEdit(product)}
              className="inline-flex h-10 items-center gap-1 rounded-lg border border-navy-950/15 px-3 text-xs font-semibold text-navy-950 transition-colors hover:bg-mist-200"
              title="Full Product Edit"
            >
              <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
              Edit
            </button>
          )}

          {onDelete && (
            <button
              type="button"
              onClick={() => onDelete(product)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-navy-950/15 text-steel-400 transition-colors hover:border-ventum-red-300 hover:bg-ventum-red-50 hover:text-ventum-red-600"
              title="Delete Product"
            >
              <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          )}

          {product.published && (
            <a
              href={`/products/${product.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-navy-950/15 text-steel-400 transition-colors hover:bg-mist-200 hover:text-navy-950"
              title="View on public site"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
