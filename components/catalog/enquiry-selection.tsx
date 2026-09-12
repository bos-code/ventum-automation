"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Check, ListPlus, Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { selectionWhatsappMessage, whatsappLink } from "@/lib/whatsapp";

export interface SelectedProduct {
  id: string;
  slug: string;
  name: string;
  brand: string;
  model: string | null;
  price: number | null;
  currency: string;
  quantity: number;
}

interface EnquirySelectionContextValue {
  items: SelectedProduct[];
  count: number;
  contains: (id: string) => boolean;
  add: (product: Omit<SelectedProduct, "quantity">) => void;
  remove: (id: string) => void;
  setQuantity: (id: string, quantity: number) => void;
  clear: () => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}

const EnquirySelectionContext = createContext<EnquirySelectionContextValue | null>(null);
const STORAGE_KEY = "ventum-enquiry-selection-v1";

export function EnquirySelectionProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<SelectedProduct[]>([]);
  const [open, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as SelectedProduct[];
        if (Array.isArray(parsed)) setItems(parsed.filter((item) => item && item.id && item.name));
      }
    } catch {
      // A broken local value should never block browsing.
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Storage can be unavailable in private/restricted browser modes.
    }
  }, [hydrated, items]);

  const value = useMemo<EnquirySelectionContextValue>(() => ({
    items,
    count: items.reduce((sum, item) => sum + item.quantity, 0),
    contains: (id) => items.some((item) => item.id === id),
    add: (product) => {
      setItems((current) => {
        if (current.some((item) => item.id === product.id)) return current;
        return [...current, { ...product, quantity: 1 }];
      });
    },
    remove: (id) => setItems((current) => current.filter((item) => item.id !== id)),
    setQuantity: (id, quantity) => {
      const safeQuantity = Math.min(999, Math.max(1, Math.round(quantity) || 1));
      setItems((current) => current.map((item) => item.id === id ? { ...item, quantity: safeQuantity } : item));
    },
    clear: () => setItems([]),
    open,
    setOpen,
  }), [items, open]);

  return (
    <EnquirySelectionContext.Provider value={value}>
      {children}
    </EnquirySelectionContext.Provider>
  );
}

export function useEnquirySelection() {
  const value = useContext(EnquirySelectionContext);
  if (!value) throw new Error("useEnquirySelection must be used inside EnquirySelectionProvider");
  return value;
}

export function AddToEnquiryButton({
  product,
  className,
  compact = false,
}: {
  product: Omit<SelectedProduct, "quantity">;
  className?: string;
  compact?: boolean;
}) {
  const selection = useEnquirySelection();
  const selected = selection.contains(product.id);

  return (
    <button
      type="button"
      onClick={() => {
        if (selected) selection.remove(product.id);
        else selection.add(product);
      }}
      className={cn(
        "inline-flex min-h-11 items-center justify-center gap-2 border px-3 text-sm font-semibold transition-colors",
        selected
          ? "border-[#06065c] bg-[#06065c] text-white"
          : "border-[#cfd1d8] bg-white text-[#06065c] hover:border-[#06065c]",
        className,
      )}
      aria-pressed={selected}
    >
      {selected ? <Check size={16} aria-hidden="true" /> : <ListPlus size={16} aria-hidden="true" />}
      {compact ? (selected ? "Selected" : "Select") : (selected ? "Added to enquiry" : "Add to enquiry")}
    </button>
  );
}

export function EnquirySelectionPanel({ whatsappNumber }: { whatsappNumber: string }) {
  const selection = useEnquirySelection();
  const message = selectionWhatsappMessage(selection.items);
  const href = whatsappLink(message, whatsappNumber);

  if (selection.items.length === 0) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => selection.setOpen(true)}
        className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-40 inline-flex min-h-12 items-center gap-3 bg-[#06065c] px-4 text-sm font-semibold text-white shadow-[0_14px_38px_rgba(17,19,34,.22)] transition-transform hover:-translate-y-0.5 sm:bottom-6 sm:right-6"
        aria-label={`Review enquiry selection, ${selection.count} ${selection.count === 1 ? "item" : "items"}`}
      >
        <ShoppingBag size={18} aria-hidden="true" />
        <span>Enquiry</span>
        <span className="grid min-w-6 place-items-center bg-white px-1.5 py-0.5 text-xs font-bold text-[#06065c]">
          {selection.count}
        </span>
      </button>

      <Dialog open={selection.open} onOpenChange={selection.setOpen}>
        <DialogContent className="gap-0 border-0 p-0 sm:inset-y-0 sm:left-auto sm:right-0 sm:top-0 sm:h-dvh sm:max-h-dvh sm:w-[430px] sm:max-w-[92vw] sm:translate-x-0 sm:translate-y-0 sm:rounded-none">
          <div className="border-b border-[#d9dbe4] px-5 py-5 pr-16 sm:px-6 sm:py-6">
            <DialogTitle className="text-2xl font-semibold tracking-[-0.03em] text-[#111322]">
              Your enquiry
            </DialogTitle>
            <DialogDescription className="mt-1 text-sm leading-6 text-[#656879]">
              Review the products, set quantities, then send the complete list to Ventum on WhatsApp.
            </DialogDescription>
          </div>

          <div className="flex-1 overflow-y-auto px-5 sm:px-6">
            <ul className="divide-y divide-[#e1e2e7]">
              {selection.items.map((item) => (
                <li key={item.id} className="py-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-[#06065c]">{item.brand}</p>
                      <p className="mt-1 text-base font-semibold leading-6 text-[#111322]">{item.name}</p>
                      {item.model && <p className="mt-1 font-mono text-xs text-[#656879]">{item.model}</p>}
                    </div>
                    <button
                      type="button"
                      onClick={() => selection.remove(item.id)}
                      className="grid size-11 shrink-0 place-items-center text-[#656879] hover:text-[#ed0101]"
                      aria-label={`Remove ${item.name}`}
                    >
                      <X size={17} />
                    </button>
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-4">
                    <div className="inline-flex items-center border border-[#d9dbe4]">
                      <button
                        type="button"
                        onClick={() => selection.setQuantity(item.id, item.quantity - 1)}
                        className="grid size-11 place-items-center hover:bg-[#f2f2f2]"
                        aria-label={`Decrease ${item.name} quantity`}
                      >
                        <Minus size={15} />
                      </button>
                      <span className="min-w-10 text-center text-sm font-semibold" aria-label={`Quantity ${item.quantity}`}>
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => selection.setQuantity(item.id, item.quantity + 1)}
                        className="grid size-11 place-items-center hover:bg-[#f2f2f2]"
                        aria-label={`Increase ${item.name} quantity`}
                      >
                        <Plus size={15} />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t border-[#d9dbe4] bg-[#f8f8f5] p-5 sm:p-6">
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 w-full items-center justify-center bg-[#ed0101] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#c90000]"
            >
              Discuss {selection.count} {selection.count === 1 ? "item" : "items"} on WhatsApp
            </a>
            <button
              type="button"
              onClick={selection.clear}
              className="mt-3 inline-flex min-h-11 w-full items-center justify-center gap-2 text-sm font-medium text-[#656879] hover:text-[#ed0101]"
            >
              <Trash2 size={15} /> Clear selection
            </button>
          </div>

          <DialogClose className="sr-only">Close</DialogClose>
        </DialogContent>
      </Dialog>
    </>
  );
}
