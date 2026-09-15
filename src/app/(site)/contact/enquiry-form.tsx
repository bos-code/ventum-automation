"use client";

import { useActionState } from "react";
import { submitEnquiry, type EnquiryFormState } from "./actions";
import type { Product } from "@/lib/types";

const initialEnquiryState: EnquiryFormState = { status: "idle", message: "" };

export function EnquiryForm({ products }: { products: Product[] }) {
  const [state, formAction, pending] = useActionState(
    submitEnquiry,
    initialEnquiryState
  );

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <div>
        <label
          htmlFor="product"
          className="block text-sm font-semibold text-navy-950"
        >
          Product
        </label>
        <select
          id="product"
          name="product"
          className="mt-2 h-12 w-full rounded-lg border border-navy-950/15 bg-white px-3 text-base text-navy-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ventum-blue-500"
        >
          <option value="">General enquiry (not sure yet)</option>
          {products.map((product) => (
            <option key={product.id} value={product.slug}>
              {product.name}
              {product.model ? ` (${product.model})` : ""}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="name" className="block text-sm font-semibold text-navy-950">
          Your name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          className="mt-2 h-12 w-full rounded-lg border border-navy-950/15 px-3 text-base text-navy-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ventum-blue-500"
        />
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-semibold text-navy-950">
          Phone or WhatsApp number
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          required
          className="mt-2 h-12 w-full rounded-lg border border-navy-950/15 px-3 text-base text-navy-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ventum-blue-500"
        />
      </div>

      <div>
        <label htmlFor="quantity" className="block text-sm font-semibold text-navy-950">
          Quantity
        </label>
        <input
          id="quantity"
          name="quantity"
          type="number"
          min={1}
          defaultValue={1}
          className="mt-2 h-12 w-28 rounded-lg border border-navy-950/15 px-3 text-base text-navy-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ventum-blue-500"
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-semibold text-navy-950">
          Message (optional)
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          className="mt-2 w-full rounded-lg border border-navy-950/15 px-3 py-2 text-base text-navy-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ventum-blue-500"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="h-12 rounded-full bg-ventum-red-600 text-sm font-semibold text-offwhite transition-colors hover:bg-ventum-red-500 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ventum-blue-500"
      >
        {pending ? "Sending..." : "Send enquiry"}
      </button>

      <p
        aria-live="polite"
        className={
          state.status === "error"
            ? "text-sm font-medium text-ventum-red-600"
            : "text-sm font-medium text-ventum-blue-600"
        }
      >
        {state.message}
      </p>
    </form>
  );
}
