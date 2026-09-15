"use client";

import { useEnquiry } from "./enquiry-context";
import type { Product } from "@/lib/types";

/**
 * Selects or deselects a product for the enquiry list.
 *
 * Selecting is deliberately quiet — no drawer, no form. The customer picks
 * as many products as they like, then opens the list once from the header
 * and fills in their details a single time.
 *
 * Styling lives here rather than in a className prop because the selected
 * and unselected states need different colours, and a Server Component
 * cannot pass a function down to compute them.
 */
export function AddToEnquiryButton({
  product,
  imageUrl = null,
  variant = "full",
}: {
  product: Product;
  /** Resolved by the Server Component that renders this button. The browser
      cannot build it: productImageUrl needs the server-only bucket id. */
  imageUrl?: string | null;
  variant?: "icon" | "full";
}) {
  const { addItem, removeItem, hasItem } = useEnquiry();
  const selected = hasItem(product.id);

  const toggle = (e: React.MouseEvent) => {
    // The card wraps a stretched link; keep the tap on the button.
    e.preventDefault();
    e.stopPropagation();
    if (selected) removeItem(product.id);
    else addItem(product, 1, imageUrl);
  };

  const focus =
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ventum-blue-400";

  if (variant === "icon") {
    return (
      <button
        type="button"
        onClick={toggle}
        aria-pressed={selected}
        className={`inline-flex h-11 w-11 items-center justify-center rounded-full shadow-md shadow-navy-950/50 transition-colors sm:h-9 sm:w-9 ${focus} ${
          selected
            ? "bg-emerald-600 text-white hover:bg-emerald-500"
            : "bg-ventum-red-600 text-white hover:bg-ventum-red-500"
        }`}
      >
        <span className="sr-only">
          {selected
            ? `Remove ${product.name} from enquiry list`
            : `Add ${product.name} to enquiry list`}
        </span>
        {selected ? <CheckIcon /> : <PlusIcon />}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={selected}
      className={`inline-flex h-12 items-center gap-2 rounded-full px-6 text-sm font-semibold transition-colors ${focus} ${
        selected
          ? "border border-emerald-500/40 bg-emerald-600/15 text-emerald-300 hover:bg-emerald-600/25"
          : "bg-navy-950 text-offwhite hover:bg-navy-900"
      }`}
    >
      {selected ? <CheckIcon /> : <PlusIcon />}
      {selected ? "In your enquiry list" : "Add to enquiry list"}
    </button>
  );
}

function PlusIcon() {
  return (
    <svg
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2.5}
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}
