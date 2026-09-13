"use client";

import { useTransition } from "react";
import { deleteProductAction } from "@/app/admin/(protected)/products/actions";

interface DeleteConfirmDialogProps {
  isOpen: boolean;
  productId: string;
  productName: string;
  onClose: () => void;
  onDeleted?: () => void;
}

export function DeleteConfirmDialog({
  isOpen,
  productId,
  productName,
  onClose,
  onDeleted,
}: DeleteConfirmDialogProps) {
  const [isPending, startTransition] = useTransition();

  if (!isOpen) return null;

  function handleDelete() {
    startTransition(async () => {
      const res = await deleteProductAction(productId);
      if (res.ok) {
        onClose();
        if (onDeleted) onDeleted();
      } else {
        alert(res.error || "Failed to delete product.");
      }
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-xs animate-in fade-in">
      <div
        className="w-full max-w-md rounded-2xl border border-navy-950/10 bg-white p-6 shadow-2xl animate-in zoom-in-95"
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-dialog-title"
      >
        <div className="flex items-center gap-3 text-ventum-red-600">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-ventum-red-50">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 id="delete-dialog-title" className="font-display text-lg font-bold text-navy-950">
            Delete Product
          </h2>
        </div>

        <p className="mt-4 text-sm text-steel-600 leading-relaxed">
          Are you sure you want to delete <strong className="text-navy-950">{productName}</strong>? This action will permanently remove it from the catalog and website.
        </p>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            disabled={isPending}
            onClick={onClose}
            className="rounded-xl border border-navy-950/15 px-4 py-2.5 text-xs font-semibold text-navy-950 transition-colors hover:bg-mist-100 disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isPending}
            onClick={handleDelete}
            className="rounded-xl bg-ventum-red-600 px-4 py-2.5 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-ventum-red-700 disabled:opacity-60"
          >
            {isPending ? "Deleting..." : "Delete Product"}
          </button>
        </div>
      </div>
    </div>
  );
}

