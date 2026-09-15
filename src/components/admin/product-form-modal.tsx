"use client";

import { useActionState, useEffect, useState } from "react";
import {
  createProductAction,
  updateProductFullAction,
  type ProductFormState,
} from "@/app/admin/(protected)/products/actions";
import { SpecsEditor } from "@/components/admin/specs-editor";
import { ImageUploader, type ExistingImage } from "@/components/admin/image-uploader";
import type { Product, Category } from "@/lib/types";

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null;
  existingImages?: ExistingImage[];
  categories: Category[];
  onSaved?: () => void;
}

const initialState: ProductFormState = { status: "idle", message: "" };

export function ProductFormModal({
  isOpen,
  onClose,
  product,
  existingImages = [],
  categories,
  onSaved,
}: ProductFormModalProps) {
  const isEditing = Boolean(product);

  const boundAction = isEditing && product
    ? updateProductFullAction.bind(null, product.id)
    : createProductAction;

  const [state, formAction, pending] = useActionState(boundAction, initialState);

  // Local state for checkboxes / toggles so they can be toggled reliably
  const [published, setPublished] = useState(product?.published ?? true);
  const [inStock, setInStock] = useState(product?.inStock ?? true);
  const [isNewArrival, setIsNewArrival] = useState(product?.isNewArrival ?? false);
  const [isNowAvailable, setIsNowAvailable] = useState(product?.isNowAvailable ?? false);
  const [imageCount, setImageCount] = useState(existingImages.length);
  const [name, setName] = useState(product?.name ?? "");
  const [brand, setBrand] = useState(product?.brand ?? "");

  // Mirrors the server rule in resolvePublish(); the server still decides.
  const publishBlockers = [
    imageCount === 0 ? "an image" : null,
    name.trim() ? null : "a name",
    brand.trim() ? null : "a brand",
  ].filter(Boolean) as string[];
  const canPublish = publishBlockers.length === 0;

  // No prop->state sync effect: the dialog is mounted fresh per product
  // (keyed in products-manager), so useState initialisers above are enough.

  // Handle successful save
  useEffect(() => {
    if (state.status === "success") {
      const timer = setTimeout(() => {
        onClose();
        if (onSaved) onSaved();
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [state.status, onClose, onSaved]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-navy-950/60 backdrop-blur-xs animate-in fade-in sm:items-center sm:p-6">
      <div
        className="flex h-dvh w-full max-w-2xl flex-col border-navy-950/10 bg-white shadow-2xl animate-in slide-in-from-bottom-4 sm:h-auto sm:max-h-[92vh] sm:rounded-2xl sm:border sm:zoom-in-95"
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-modal-title"
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-navy-950/10 px-4 py-3 sm:px-6 sm:py-4">
          <div>
            <h2
              id="product-modal-title"
              className="font-display text-lg font-bold text-navy-950"
            >
              {isEditing ? "Edit Product" : "Add New Product"}
            </h2>
            <p className="mt-0.5 text-xs text-steel-600">
              {isEditing
                ? `Editing catalog item: ${product?.name}`
                : "Fill in the product specifications and marketing flags."}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-steel-600 transition-colors hover:bg-mist-100 hover:text-navy-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ventum-blue-500"
            aria-label="Close dialog"
          >
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form action={formAction} className="flex flex-1 flex-col overflow-hidden">
          <div className="flex-1 space-y-5 overflow-y-auto p-4 text-sm sm:p-6">
            {/* Status alerts */}
            {state.status === "error" && (
              <div className="rounded-xl border border-ventum-red-200 bg-ventum-red-50 p-3 text-xs font-semibold text-ventum-red-700">
                {state.message}
              </div>
            )}
            {state.status === "success" && (
              <div
                className={`rounded-xl border p-3 text-xs font-semibold ${
                  state.savedAsDraft
                    ? "border-amber-300 bg-amber-50 text-amber-800"
                    : "border-green-200 bg-green-50 text-green-800"
                }`}
              >
                {state.message} Closing...
              </div>
            )}

            <ImageUploader
              existingImages={existingImages}
              onCountChange={setImageCount}
            />

            {/* Row 1: Brand & Name */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-steel-700">
                  Brand
                </label>
                <input
                  type="text"
                  name="brand"
                  value={brand}
                  onChange={(event) => setBrand(event.target.value)}
                  placeholder="e.g. Schneider Electric, ABB"
                  className="mt-1 h-11 w-full rounded-xl border border-navy-950/15 bg-white px-3 text-base text-navy-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ventum-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-steel-700">
                  Product Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="e.g. Acti9 Miniature Circuit Breaker"
                  className="mt-1 h-11 w-full rounded-xl border border-navy-950/15 bg-white px-3 text-base text-navy-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ventum-blue-500 sm:text-sm"
                />
              </div>
            </div>

            {/* Row 2: Model, Slug & Category */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-steel-700">
                  Model / Part No.
                </label>
                <input
                  type="text"
                  name="model"
                  defaultValue={product?.model ?? ""}
                  placeholder="e.g. iC60N-3P-63A"
                  className="mt-1 h-11 w-full rounded-xl border border-navy-950/15 bg-white px-3 text-base text-navy-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ventum-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-steel-700">
                  URL Slug
                </label>
                <input
                  type="text"
                  name="slug"
                  defaultValue={product?.slug ?? ""}
                  placeholder="Auto-generated if blank"
                  className="mt-1 h-11 w-full rounded-xl border border-navy-950/15 bg-white px-3 text-base text-navy-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ventum-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-steel-700">
                  Category
                </label>
                <select
                  name="categoryId"
                  defaultValue={product?.categoryId ?? ""}
                  className="mt-1 h-11 w-full rounded-xl border border-navy-950/15 bg-white px-3 text-base text-navy-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ventum-blue-500 sm:text-sm"
                >
                  <option value="">-- Select Category --</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Row 3: Pricing & Sort Order */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-steel-700">
                  Price (₦ NGN)
                </label>
                <input
                  type="number"
                  name="price"
                  min={0}
                  defaultValue={product?.price ?? ""}
                  placeholder="0 (leave blank for Quote)"
                  className="mt-1 h-11 w-full rounded-xl border border-navy-950/15 bg-white px-3 text-base text-navy-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ventum-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-steel-700">
                  Currency
                </label>
                <input
                  type="text"
                  name="currency"
                  defaultValue={product?.currency ?? "NGN"}
                  className="mt-1 h-11 w-full rounded-xl border border-navy-950/15 bg-white px-3 text-base text-navy-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ventum-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-steel-700">
                  Sort Order
                </label>
                <input
                  type="number"
                  name="sortOrder"
                  defaultValue={product?.sortOrder ?? 0}
                  className="mt-1 h-11 w-full rounded-xl border border-navy-950/15 bg-white px-3 text-base text-navy-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ventum-blue-500 sm:text-sm"
                />
              </div>
            </div>

            {/* Marketing & Inventory Badges (Henry's Ground Rules) */}
            <div className="rounded-xl border border-navy-950/10 bg-mist-100/50 p-4">
              <span className="block text-xs font-bold uppercase tracking-wider text-steel-700">
                Visibility & Marketing Badges
              </span>
              <p className="mt-0.5 text-xs text-steel-500">
                {canPublish
                  ? "This product can go live. Untick to keep it as a draft."
                  : `Needs ${publishBlockers.join(" and ")} before it can go live — it will save as a draft.`}
              </p>

              <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <label
                  className={`flex items-center gap-2 select-none ${
                    canPublish ? "cursor-pointer" : "cursor-not-allowed opacity-60"
                  }`}
                >
                  <input
                    type="checkbox"
                    name="published"
                    checked={published && canPublish}
                    disabled={!canPublish}
                    onChange={(e) => setPublished(e.target.checked)}
                    className="h-4 w-4 rounded border-navy-950/20 text-navy-950 focus:ring-ventum-blue-500"
                  />
                  <span className="text-xs font-semibold text-navy-950">
                    Live on site
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    name="inStock"
                    checked={inStock}
                    onChange={(e) => setInStock(e.target.checked)}
                    className="h-4 w-4 rounded border-navy-950/20 text-navy-950 focus:ring-ventum-blue-500"
                  />
                  <span className="text-xs font-semibold text-navy-950">In Stock</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    name="isNewArrival"
                    checked={isNewArrival}
                    onChange={(e) => setIsNewArrival(e.target.checked)}
                    className="h-4 w-4 rounded border-navy-950/20 text-ventum-blue-600 focus:ring-ventum-blue-500"
                  />
                  <span className="text-xs font-semibold text-ventum-blue-700">New Arrival</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    name="isNowAvailable"
                    checked={isNowAvailable}
                    onChange={(e) => setIsNowAvailable(e.target.checked)}
                    className="h-4 w-4 rounded border-navy-950/20 text-green-600 focus:ring-green-500"
                  />
                  <span className="text-xs font-semibold text-green-700">Now Available</span>
                </label>
              </div>
            </div>

            {/* Descriptions */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-steel-700">
                Short Description
              </label>
              <textarea
                name="shortDescription"
                rows={2}
                defaultValue={product?.shortDescription ?? ""}
                placeholder="Brief 1-sentence product summary displayed on cards..."
                className="mt-1 w-full rounded-xl border border-navy-950/15 bg-white p-3 text-base text-navy-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ventum-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-steel-700">
                Full Description
              </label>
              <textarea
                name="description"
                rows={4}
                defaultValue={product?.description ?? ""}
                placeholder="Detailed commercial, engineering and technical overview..."
                className="mt-1 w-full rounded-xl border border-navy-950/15 bg-white p-3 text-base text-navy-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ventum-blue-500 sm:text-sm"
              />
            </div>

            {/* Technical Specifications Key-Value Editor */}
            <SpecsEditor initialSpecs={product?.specifications} />
          </div>

          {/* Footer Actions */}
          <div className="flex shrink-0 items-center justify-end gap-3 border-t border-navy-950/10 bg-mist-100 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-6 sm:py-4">
            <button
              type="button"
              disabled={pending}
              onClick={onClose}
              className="inline-flex min-h-11 items-center rounded-xl border border-navy-950/15 bg-white px-4 text-xs font-semibold text-navy-950 transition-colors hover:bg-mist-100 disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ventum-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={pending}
              className="inline-flex min-h-11 items-center rounded-xl bg-navy-950 px-5 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-navy-900 disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ventum-blue-500"
            >
              {pending
                ? "Saving..."
                : canPublish && published
                  ? isEditing
                    ? "Save & keep live"
                    : "Create & publish"
                  : isEditing
                    ? "Save as draft"
                    : "Save draft"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

