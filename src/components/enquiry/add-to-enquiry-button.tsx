"use client";

import { useEnquiry } from "./enquiry-context";
import type { Product } from "@/lib/types";

export function AddToEnquiryButton({
  product,
  className,
  children,
}: {
  product: Product;
  className?: string;
  children?: React.ReactNode;
}) {
  const { addItem } = useEnquiry();

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        addItem(product);
      }}
      className={
        className ||
        "inline-flex h-10 items-center justify-center rounded-lg bg-navy-900 px-4 text-sm font-semibold text-offwhite transition-colors hover:bg-navy-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ventum-blue-500"
      }
    >
      {children || "Add to Enquiry"}
    </button>
  );
}

